"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
exports.default = async (request, response) => {
    if (request.cookies.auth_id) {
        const session = await DB_1.default.from("sessions").where("id", request.cookies.auth_id).first();
        if (session) {
            const user = await DB_1.default.from("users").where("id", session.user_id).select(["id", "name", "email", "phone", "is_admin", "is_verified"]).first();
            request.user = user;
            request.share = {
                "user": request.user,
            };
        }
        else {
            response.cookie("auth_id", "", 0).redirect("/login");
        }
    }
    else {
        response.cookie("auth_id", "", 0).redirect("/login");
    }
};
//# sourceMappingURL=auth.js.map