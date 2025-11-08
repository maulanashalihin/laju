"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv7_1 = require("uuidv7");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const DB_1 = __importDefault(require("../services/DB"));
const S3_1 = require("../services/S3");
let cache = {};
class Controller {
    async uploadAsset(request, response) {
        try {
            let isValidFile = true;
            await request.multipart(async (field) => {
                if (field.file) {
                    if (!field.mime_type.includes("image")) {
                        isValidFile = false;
                        return;
                    }
                    const id = (0, uuidv7_1.uuidv7)();
                    const fileName = `${id}.webp`;
                    const chunks = [];
                    const readable = field.file.stream;
                    readable.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    readable.on('end', async () => {
                        const buffer = Buffer.concat(chunks);
                        try {
                            const processedBuffer = await (0, sharp_1.default)(buffer)
                                .webp({ quality: 80 })
                                .resize(1200, 1200, {
                                fit: 'inside',
                                withoutEnlargement: true
                            })
                                .toBuffer();
                            const s3Key = `/assets/${fileName}`;
                            await (0, S3_1.uploadBuffer)(s3Key, processedBuffer, 'image/webp', 'public, max-age=31536000');
                            const publicUrl = (0, S3_1.getPublicUrl)(s3Key);
                            const result = {
                                id,
                                type: 'image',
                                url: publicUrl,
                                mime_type: 'image/webp',
                                name: fileName,
                                size: processedBuffer.length,
                                user_id: request.user.id,
                                s3_key: s3Key,
                                created_at: Date.now(),
                                updated_at: Date.now()
                            };
                            await DB_1.default.from("assets").insert(result);
                            response.json(result);
                        }
                        catch (err) {
                            console.error('Error processing and uploading image:', err);
                            response.status(500).send("Error processing and uploading image");
                        }
                    });
                }
            });
            if (!isValidFile) {
                return response.status(400).send("Invalid file type. Only images are allowed.");
            }
        }
        catch (error) {
            console.error("Error uploading asset:", error);
            return response.status(500).send("Internal server error");
        }
    }
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