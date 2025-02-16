"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
let cache = {};
class Controller {
    async distFolder(request, response) {
        const file = request.params.file;
        try {
            const filePath = `dist/assets/${file}`;
            if (file.endsWith(".css")) {
                response.setHeader("Content-Type", "text/css");
            }
            else if (file.endsWith(".js")) {
                response.setHeader("Content-Type", "application/javascript");
            }
            else {
                response.setHeader("Content-Type", "application/octet-stream");
            }
            response.setHeader("Cache-Control", "public, max-age=31536000");
            if (cache[file]) {
                return response.send(cache[file]);
            }
            if (await fs_1.default.promises.access(filePath).then(() => true).catch(() => false)) {
                const fileContent = await fs_1.default.promises.readFile(filePath);
                cache[file] = fileContent;
                return response.send(fileContent);
            }
            return response.status(404).send("File not found");
        }
        catch (error) {
            console.error("Error serving dist file:", error);
            return response.status(500).send("Internal server error");
        }
    }
    async publicFolder(request, response) {
        const allowedExtensions = [
            '.ico', '.png', '.jpeg', '.jpg', '.gif', '.svg',
            '.txt', '.pdf', '.css', '.js',
            '.woff', '.woff2', '.ttf', '.eot',
            '.mp4', '.webm', '.mp3', '.wav'
        ];
        const path = "public/" + request.path.replace("/", "").replaceAll("%20", " ");
        if (!path.includes('.')) {
            return response.status(404).send('Page not found');
        }
        if (!allowedExtensions.some(ext => path.toLowerCase().endsWith(ext))) {
            return response.status(403).send('File type not allowed');
        }
        if (!fs_1.default.existsSync(path)) {
            return response.status(404).send('File not found');
        }
        return response.download(path);
    }
}
exports.default = new Controller();
//# sourceMappingURL=AssetController.js.map