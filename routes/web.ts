import AuthHandler from "../app/handlers/auth.handler";
import AppHandler from "../app/handlers/app.handler";
import PublicHandler from "../app/handlers/public.handler";
import UploadHandler from "../app/handlers/upload.handler";
import S3Handler from "../app/handlers/s3.handler";
import StorageHandler from "../app/handlers/storage.handler";
import AssetHandler from "../app/handlers/asset.handler";
import Auth from "../app/middlewares/auth.middleware";
import HyperExpress from 'hyper-express';

// Rate limiting middleware
import {
  authRateLimit,
  apiRateLimit,
  passwordResetRateLimit,
  createAccountRateLimit,
  uploadRateLimit
} from "../app/middlewares/rate-limit.middleware";

const Route = new HyperExpress.Router();

/**
 * Public Routes
 * These routes are accessible without authentication
 * ------------------------------------------------
 * GET  / - Home page
 */
Route.get("/", PublicHandler.index);
Route.get("/test", PublicHandler.test);
Route.get("/test2", PublicHandler.test2);

/**
 * Upload Routes
 * Routes for handling file uploads
 * ------------------------------------------------
 * POST /api/upload/image - Upload image with processing
 * POST /api/upload/file - Upload file (PDF, Word, Excel, etc.)
 */
Route.post("/api/upload/image", [Auth, uploadRateLimit], UploadHandler.uploadImage);
Route.post("/api/upload/file", [Auth, uploadRateLimit], UploadHandler.uploadFile);

/**
 * S3 Routes
 * Routes for handling S3 operations
 * ------------------------------------------------
 * POST /api/s3/signed-url - Generate signed URL for file upload
 * GET  /api/s3/public-url/:fileKey - Get public URL for existing file
 * GET  /api/s3/health - S3 service health check
 */
Route.post("/api/s3/signed-url", [Auth, uploadRateLimit], S3Handler.getSignedUrl);
Route.get("/api/s3/public-url/:fileKey", [apiRateLimit], S3Handler.getPublicUrl);
Route.get("/api/s3/health", [apiRateLimit], S3Handler.health);

/**
 * Local Storage Static Files
 * Serves files from local storage
 * ------------------------------------------------
 * GET /storage/* - Serve local storage files
 */
Route.get("/storage/*", StorageHandler.serveFile);
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
Route.get("/login", AuthHandler.loginPage);
Route.post("/login", [authRateLimit], AuthHandler.processLogin);
Route.get("/register", AuthHandler.registerPage);
Route.post("/register", [createAccountRateLimit], AuthHandler.processRegister);
Route.post("/logout", AuthHandler.logout);
Route.get("/google/redirect", AuthHandler.googleRedirect);
Route.get("/google/callback", AuthHandler.googleCallback);

/**
 * Password Reset Routes
 * Routes for handling password reset
 * ------------------------------------------------
 * GET   /forgot-password - Forgot password page
 * POST  /forgot-password - Send reset password link
 * GET   /reset-password/:id - Reset password page
 * POST  /reset-password - Process password reset
 */
Route.get("/forgot-password", AuthHandler.forgotPasswordPage);
Route.post("/forgot-password", [passwordResetRateLimit], AuthHandler.sendResetPassword);
Route.get("/reset-password/:id", AuthHandler.resetPasswordPage);
Route.post("/reset-password", [authRateLimit], AuthHandler.resetPassword);

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
Route.get("/home", [Auth], AppHandler.homePage);
Route.get("/profile", [Auth], AppHandler.profilePage);
Route.post("/change-profile", [Auth], AppHandler.changeProfile);
Route.post("/change-password", [Auth], AuthHandler.changePassword);
Route.delete("/users", [Auth], AppHandler.deleteUsers);

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
Route.get("/assets/:file", AssetHandler.distFolder);

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
Route.get("/public/*", AssetHandler.publicFolder);

export default Route;
