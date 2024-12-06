"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inertia_1 = __importDefault(require("./app/middlewares/inertia"));
const web_1 = __importDefault(require("./routes/web"));
const hyper_express_1 = __importDefault(require("hyper-express"));
const webserver = new hyper_express_1.default.Server();
const fs = __importStar(require("fs"));
require("dotenv").config();
require("./app/services/View");
var cors = require("cors");
webserver.use(cors());
webserver.use((0, inertia_1.default)());
webserver.use(web_1.default);
let cache = {};
webserver.get("/assets/:file", async (request, response) => {
    let file = request.params.file;
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
        else if (await fs.promises
            .access(filePath)
            .then(() => true)
            .catch(() => false)) {
            const fileContent = await fs.promises.readFile(filePath);
            cache[file] = fileContent;
            return response.send(fileContent);
        }
        else {
            return response.status(404).send("File not found");
        }
    }
    catch (error) {
        console.error("Error serving file:", error);
        return response.status(500).send("Internal server error");
    }
});
webserver.get("/*", (request, response) => {
    const allowedExtensions = [
        '.ico', '.png', '.jpeg', '.jpg', '.gif', '.svg',
        '.txt', '.pdf', '.css', '.js',
        '.woff', '.woff2', '.ttf', '.eot',
        '.mp4', '.webm', '.mp3', '.wav'
    ];
    const path = "public/" + request.path.replace("/", "").replaceAll("%20", " ");
    if (!allowedExtensions.some(ext => path.toLowerCase().endsWith(ext))) {
        return response.status(403).send('File type not allowed');
    }
    if (!fs.existsSync(path)) {
        return response.status(404).send('File not found');
    }
    return response.download(path);
});
const PORT = parseInt(process.env.PORT) || 5000;
webserver.set_error_handler((req, res, error) => {
    console.log(error);
    if (error.code == "SQLITE_ERROR") {
        res.status(500);
    }
    res.json(error);
});
webserver
    .listen(PORT)
    .then(() => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
    .catch((err) => { });
process.on("SIGTERM", () => {
    console.info("SIGTERM signal received.");
    process.exit(0);
});
//# sourceMappingURL=server.js.map