/**
 * SMTP Email Service
 * 
 * This service handles transactional email delivery using Nodemailer via SMTP (specifically configured for Gmail).
 * It shares the same interface as the Resend service, allowing for easy swapping between providers.
 * 
 * Requirements:
 * - USER_MAILER: Gmail address
 * - PASS_MAILER: Gmail App Password (not your login password)
 */

import nodemailer from "nodemailer";

/**
 * Default mail transporter instance
 * Uses environment variables for authentication:
 * - USER_MAILER: Gmail account username
 * - PASS_MAILER: Gmail account password or app-specific password
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Uses SSL
  auth: {
    user: process.env.USER_MAILER,
    pass: process.env.PASS_MAILER
  }
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

/**
 * Sends an email using the configured SMTP transporter (Nodemailer).
 * 
 * This function maintains the same signature as the Resend service's MailTo,
 * enabling "drop-in" replacement in Controllers without code changes.
 * 
 * @param {MailOptions} options - Email options containing recipient, subject, and body text
 * @returns {Promise<void>} Resolves when the handshake and transmission are complete
 * 
 * @example
 * await MailTo({
 *   to: "user@example.com",
 *   subject: "Password Reset",
 *   text: "Click here to reset..."
 * });
 */
export async function MailTo({to,subject,text}: MailOptions)
{
    if (!process.env.USER_MAILER || !process.env.PASS_MAILER) {
        console.warn("⚠️ SMTP credentials (USER_MAILER/PASS_MAILER) not found. Email not sent.");
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM_NAME ? `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>` : 'Laju Notification <hello@laju.dev>',
            to: to,
            subject: subject,
            text: text,
            replyTo: process.env.MAIL_FROM_ADDRESS || 'hello@laju.dev'
        });
    } catch (error) {
        console.error("❌ Failed to send email via SMTP:", error);
        throw error;
    }
}

/**
 * Gmail SMTP Setup Guide:
 * 
 * 1. Enable 2-Step Verification:
 *    - Google Account Settings -> Security -> 2-Step Verification (Turn ON)
 * 
 * 2. Create an App Password:
 *    - Google Account Settings -> Security -> 2-Step Verification -> App passwords
 *    - Select "Mail" and your device
 *    - Generate and copy the 16-character password
 * 
 * 3. Configure .env:
 *    USER_MAILER=your.email@gmail.com
 *    PASS_MAILER=your-16-digit-app-password
 */
