import { Response, Request } from "../../type";
import fs from "fs";
import path from "path";
import "dotenv/config";

const storagePath = process.env.LOCAL_STORAGE_PATH || "./storage";

class Controller {
    public async serveFile(request: Request, response: Response) {
        // Extract path after /storage/ from request.path (same pattern as AssetController)
        const requestPath = request.path || "";
        const filePath = requestPath.startsWith("/storage/") 
            ? requestPath.substring("/storage/".length).replaceAll("%20", " ")
            : "";

        try {
            const fullPath = path.join(storagePath, filePath);

            const allowedExtensions = [
                '.ico', '.png', '.jpeg', '.jpg', '.gif', '.svg', '.webp',
                '.txt', '.pdf', '.css', '.js',
                '.woff', '.woff2', '.ttf', '.eot',
                '.mp4', '.webm', '.mp3', '.wav'
            ];

            if (!filePath.includes('.')) {
                return response.status(404).send('File not found');
            }

            if (!allowedExtensions.some(ext => filePath.toLowerCase().endsWith(ext))) {
                return response.status(403).send('File type not allowed');
            }

            if (!fs.existsSync(fullPath)) {
                return response.status(404).send('File not found');
            }

            response.setHeader("Cache-Control", "public, max-age=31536000");

            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf',
                '.eot': 'application/vnd.ms-fontobject',
                '.pdf': 'application/pdf',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.txt': 'text/plain',
                '.ico': 'image/x-icon'
            };

            if (mimeTypes[ext]) {
                response.setHeader("Content-Type", mimeTypes[ext]);
            }

            return response.download(fullPath);
        } catch (error) {
            console.error("Error serving storage file:", error);
            return response.status(500).send("Internal server error");
        }
    }
}

export default new Controller();
