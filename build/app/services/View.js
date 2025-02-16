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
exports.view = view;
const fs_1 = require("fs");
const Sqrl = __importStar(require("squirrelly"));
const path_1 = __importDefault(require("path"));
require("dotenv").config();
let html_files = {};
let directory = process.env.NODE_ENV == 'development' ? "resources/views" : "dist/views";
if (process.env.NODE_ENV == 'development') {
    const chokidar = require("chokidar");
    var watcher = chokidar.watch('resources/views', { ignored: /^\./, persistent: true });
    watcher
        .on('change', (path) => {
        importFiles(directory);
    });
}
function importFiles(nextDirectory = "resources/views") {
    try {
        if (!(0, fs_1.statSync)(nextDirectory).isDirectory()) {
            throw new Error(`Path ${nextDirectory} is not a directory`);
        }
        const files = (0, fs_1.readdirSync)(nextDirectory);
        for (const filename of files) {
            const results = (0, fs_1.statSync)(path_1.default.join(nextDirectory, filename));
            if (results.isDirectory()) {
                importFiles(path_1.default.join(nextDirectory, filename));
            }
            else {
                const html = (0, fs_1.readFileSync)(path_1.default.join(nextDirectory, filename), "utf8");
                if (nextDirectory.includes("partials")) {
                    const dir = nextDirectory.replace(directory + "/", "");
                    Sqrl.templates.define(dir + "/" + filename, Sqrl.compile(html));
                }
                html_files[nextDirectory + "/" + filename] = html;
            }
        }
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`Views directory not found: ${nextDirectory}. Please make sure the directory exists.`);
        }
        throw error;
    }
}
function view(filename, view_data) {
    const keys = Object.keys(view_data || {});
    let html = html_files[directory + "/" + filename];
    if (process.env.NODE_ENV == 'development') {
        const files = (0, fs_1.readdirSync)("resources/js");
        for (const filename of files) {
            html = html.replace("/js/" + filename, `http://localhost:${process.env.VITE_PORT}/js/${filename}`);
        }
    }
    html = Sqrl.render(html, {
        ...view_data
    });
    return html;
}
exports.default = importFiles(directory);
//# sourceMappingURL=View.js.map