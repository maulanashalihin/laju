"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SQLite_1 = __importDefault(require("../services/SQLite"));
exports.default = async (request, response) => {
    if (request.cookies.auth_id) {
        const user = SQLite_1.default.get(`
            SELECT u.id, u.name, u.email, u.phone, u.is_admin, u.is_verified 
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
       `, [request.cookies.auth_id]);
        if (user) {
            user.is_admin = !!user.is_admin;
            user.is_verified = !!user.is_verified;
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