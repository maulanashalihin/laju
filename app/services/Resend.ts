/**
 * Resend Email Service
 * 
 * Service ini menangani pengiriman email transaksional menggunakan API Resend.
 * Membutuhkan RESEND_API_KEY di environment variables.
 */
import { Resend } from 'resend';

let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("⚠️ RESEND_API_KEY not found. Email service (Resend) is disabled.");
}

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

/**
 * Mengirim email menggunakan Resend API
 * 
 * @param {MailOptions} options - Opsi pengiriman email (to, subject, text)
 * @returns {Promise<any>} Response dari Resend API atau void jika client belum diinit
 * 
 * @example
 * await MailTo({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   text: "Hello world"
 * });
 */
export async function MailTo({ to, subject, text }: MailOptions) {
  // Fail-safe: Jangan crash jika API key tidak ada, cukup log warning
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
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error);
    throw error;
  }
}