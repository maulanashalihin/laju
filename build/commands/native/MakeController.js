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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class Command {
    constructor() {
        this.args = [];
        this.commandName = "make:controller";
    }
    run() {
        if (this.args.length > 1) {
            let filename = this.args[1];
            if (!filename.includes("Controller")) {
                filename += "Controller";
            }
            const path = "./app/controllers/" + filename + ".ts";
            if (fs.existsSync(path)) {
                console.log("File already exists");
                return;
            }
            fs.writeFileSync(path, this.getText());
        }
    }
    getText() {
        return `
import { Response, Request } from "../../type"; 
import DB from "../services/DB";

class Controller {
    
  public async index (request : Request,response : Response) { 
  }

  public async create (request : Request, response : Response) {
  }

  public async store (request : Request, response : Response) {
  }

  public async show (request : Request, response : Response) {
  }

  public async edit (request : Request, response : Response) {
  }

  public async update (request : Request, response : Response) {
  }

  public async destroy (request : Request, response : Response) {
  }

}

export default new Controller()
  `;
    }
}
exports.default = new Command();
//# sourceMappingURL=MakeController.js.map