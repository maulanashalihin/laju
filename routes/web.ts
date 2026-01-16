import LoginController from "../app/controllers/LoginController";
import RegisterController from "../app/controllers/RegisterController";
import PasswordController from "../app/controllers/PasswordController";
import ProfileController from "../app/controllers/ProfileController";
import OAuthController from "../app/controllers/OAuthController";
import Auth from "../app/middlewares/auth"
import PublicController from "../app/controllers/PublicController";
import AssetController from "../app/controllers/AssetController";
import UploadController from "../app/controllers/UploadController";
import S3Controller from "../app/controllers/S3Controller";
import StorageController from "../app/controllers/StorageController";
import HyperExpress from 'hyper-express';

// Rate limiting middleware
import {
  authRateLimit,
  apiRateLimit,
  passwordResetRateLimit,
  createAccountRateLimit,
  uploadRateLimit
} from "../app/middlewares/rateLimit";

const Route = new HyperExpress.Router();

/**
 * Public Routes
 * These routes are accessible without authentication
 * ------------------------------------------------
 * GET  / - Home page
 */
Route.get("/", PublicController.index);
Route.get("/test", PublicController.test);

/**
 * Upload Routes
 * Routes for file uploads
 * ------------------------------------------------
 * POST /api/upload/image - Upload image with processing
 * POST /api/upload/file - Upload file (PDF, Word, Excel, etc.)
 */
Route.post("/api/upload/image", [Auth, uploadRateLimit], UploadController.uploadImage);
Route.post("/api/upload/file", [Auth, uploadRateLimit], UploadController.uploadFile);

/**
 * S3 Routes
 * Routes for handling S3 operations
 * ------------------------------------------------
 * POST /api/s3/signed-url - Generate signed URL for file upload
 * GET  /api/s3/public-url/:fileKey - Get public URL for existing file
 * GET  /api/s3/health - S3 service health check
 */
Route.post("/api/s3/signed-url", [Auth, uploadRateLimit], S3Controller.getSignedUrl);
Route.get("/api/s3/public-url/:fileKey", [apiRateLimit], S3Controller.getPublicUrl);
Route.get("/api/s3/health", [apiRateLimit], S3Controller.health);

/**
 * Local Storage Static Files
 * Serves files from local storage
 * ------------------------------------------------
 * GET /storage/* - Serve local storage files
 */
Route.get("/storage/*", StorageController.serveFile);
/**
 * Authentication Routes
 * Routes for handling user authentication
 * ------------------------------------------------
 * GET   /login - Login page
 * POST  /login - Process login
 * GET   /register - Registration page
 * POST  /register - Process registration
 * POST  /logout - Logout user
 * GET   /google/redirect - Google OAuth redirect
 * GET   /google/callback - Google OAuth callback
 */
Route.get("/login", LoginController.loginPage);
Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.get("/register", RegisterController.registerPage);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);
Route.post("/logout", LoginController.logout);
Route.get("/google/redirect", OAuthController.redirect);
Route.get("/google/callback", OAuthController.googleCallback);

/**
 * Password Reset Routes
 * Routes for handling password reset
 * ------------------------------------------------
 * GET   /forgot-password - Forgot password page
 * POST  /forgot-password - Send reset password link
 * GET   /reset-password/:id - Reset password page
 * POST  /reset-password - Process password reset
 */
Route.get("/forgot-password", PasswordController.forgotPasswordPage);
Route.post("/forgot-password", [passwordResetRateLimit], PasswordController.sendResetPassword);
Route.get("/reset-password/:id", PasswordController.resetPasswordPage);
Route.post("/reset-password", [authRateLimit], PasswordController.resetPassword);

/**
 * Protected Routes
 * These routes require authentication
 * ------------------------------------------------
 * GET   /home - User dashboard
 * GET   /profile - User profile
 * POST  /change-profile - Update profile
 * POST  /change-password - Change password
 * DELETE /users - Delete users (admin only)
 */
Route.get("/home", [Auth], ProfileController.homePage);
Route.get("/profile", [Auth], ProfileController.profilePage);
Route.post("/change-profile", [Auth], ProfileController.changeProfile);
Route.post("/change-password", [Auth], PasswordController.changePassword);
Route.delete("/users", [Auth], ProfileController.deleteUsers);

/**
 * Static Asset Handling Routes
 *
 * 1. Dist Assets (/assets/:file)
 * Serves compiled and bundled assets from the dist/assets directory
 * - Handles JavaScript files (*.js) with proper content type
 * - Handles CSS files (*.css) with proper content type
 * - Implements file caching for better performance
 * - Sets appropriate cache headers for browser caching
 * Example URLs:
 * - /assets/app.1234abc.js
 * - /assets/main.5678def.css
 */
Route.get("/assets/:file", AssetController.distFolder);

/**
 * 2. Public Assets (/*) - Catch-all Route
 * Serves static files from the public directory
 * - Must be the LAST route in the file
 * - Only serves files with allowed extensions
 * - Returns 404 for paths without extensions
 * - Implements security checks against unauthorized access
 *
 * Allowed file types:
 * - Images: .ico, .png, .jpeg, .jpg, .gif, .svg
 * - Documents: .txt, .pdf
 * - Fonts: .woff, .woff2, .ttf, .eot
 * - Media: .mp4, .webm, .mp3, .wav
 * - Web: .css, .js
 *
 * Example URLs:
 * - /images/logo.png
 * - /documents/terms.pdf
 * - /fonts/roboto.woff2
 */
Route.get("/public/*", AssetController.publicFolder);

export default Route;
