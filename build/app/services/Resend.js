"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailTo = MailTo;
const resend_1 = require("resend");
let resend = null;
if (process.env.RESEND_API_KEY) {
    resend = new resend_1.Resend(process.env.RESEND_API_KEY);
}
else {
    console.warn("⚠️ RESEND_API_KEY not found. Email service (Resend) is disabled.");
}
async function MailTo({ to, subject, text }) {
    if (!resend) {
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        const data = await resend.emails.send({
            from: process.env.MAIL_FROM_NAME ? `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>` : 'Laju Notification <hello@laju.dev>',
            to: to,
            subject: subject,
            replyTo: process.env.MAIL_FROM_ADDRESS || 'hello@laju.dev',
            text: text,
        });
        return data;
    }
    catch (error) {
        console.error("❌ Failed to send email via Resend:", error);
        throw error;
    }
}
//# sourceMappingURL=Resend.js.map