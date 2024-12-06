"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("./DB"));
const helper_1 = require("./helper");
const bcrypt = require("bcrypt");
const saltRounds = 10;
class Autenticate {
    async hash(password) {
        return await bcrypt.hash(password, saltRounds);
    }
    async compare(password, hash) {
        return await bcrypt.compare(password, hash);
    }
    async process(user, request, response) {
        const token = (0, helper_1.generateUUID)();
        await DB_1.default.table("sessions").insert({
            id: token,
            user_id: user.id,
            user_agent: request.headers["user-agent"],
        });
        response
            .cookie("auth_id", token, 1000 * 60 * 60 * 24 * 60)
            .redirect("/home");
    }
    async logout(request, response) {
        await DB_1.default.from("sessions").where("id", request.cookies.auth_id).delete();
        response.cookie("auth_id", "", 0).redirect("login");
    }
}
exports.default = new Autenticate();
//# sourceMappingURL=Authenticate.js.map