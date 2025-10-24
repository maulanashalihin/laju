"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const instace = {};
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_MAILER,
        pass: process.env.PASS_MAILER
    }
});
transporter.config = ({ user, pass }) => {
    if (instace[user]) {
        return instace[user];
    }
    else {
        instace[user] = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: user,
                pass: pass
            }
        });
    }
    return instace[user];
};
exports.default = transporter;
//# sourceMappingURL=Mailer.js.map