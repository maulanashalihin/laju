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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class Command {
    constructor() {
        this.args = [];
        this.commandName = "make:command";
    }
    run() {
        if (this.args.length > 1) {
            let filename = this.args[1];
            filename = filename.replace(/[^a-z0-9]/gi, "");
            const path = "./commands/" + filename + ".ts";
            if (fs.existsSync(path)) {
                console.log("File already exists");
                return;
            }
            fs.writeFileSync(path, this.getText());
        }
    }
    getText() {
        return `
  import DB from "../app/services/DB";

  (async () => {
    
    const users = await DB.from("users").select("*");

    console.log(users);
    
    process.exit(1);
  })()

`;
    }
}
exports.default = new Command();
//# sourceMappingURL=MakeCommand.js.map