/**
 * Email Service using Nodemailer
 * This service provides email functionality using Gmail's SMTP server.
 * It supports both default and custom SMTP configurations.
 */

const nodemailer = require("nodemailer");

/**
 * Cache object to store multiple mailer instances
 * Used to prevent creating duplicate transporter instances for the same credentials
 */
const instace = {};

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

/**
 * Creates or retrieves a cached mail transporter with custom credentials
 * @param {Object} config - The configuration object
 * @param {string} config.user - Gmail account username
 * @param {string} config.pass - Gmail account password or app-specific password
 * @returns {Object} Configured nodemailer transporter instance
 */
transporter.config = ({ user, pass }) => {
  if(instace[user]) {
    return instace[user];
  } else {
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
}

export default transporter;

/**
 * Here's how to set up Gmail SMTP for your application:
 * 
 * 1. Enable 2-Step Verification:
 * - Go to your Google Account settings
 * - Navigate to Security
 * - Enable 2-Step Verification if not already enabled
 * 2. Create an App Password:
 * - Go to your Google Account settings
 * - Navigate to Security
 * - Under "2-Step Verification", click on "App passwords"
 * - Select "Mail" as the app and your device
 * - Click "Generate"
 * - Google will generate a 16-character password
 * 3. Set up Environment Variables: Create or update your .env file with these variables:
 * 
 * USER_MAILER=your.email@gmail.com
 * PASS_MAILER=your-16-digit-app-password
 */
