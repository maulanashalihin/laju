// Laju Server Entrypoint
// Boots the HTTP server, wires middlewares & routes,
// loads environment variables, and configures HTTPS for local development.

// Load environment variables from .env into process.env
import "dotenv/config";

// Inertia middleware: integrates Inertia.js responses for SSR-like pages
import inertia from "./app/middlewares/inertia";

// CSRF protection middleware
// import csrf from "./app/middlewares/csrf";

// Security headers middleware
// import { securityHeaders } from "./app/middlewares/securityHeaders";

// Application routes definition (all app endpoints)
import Web from "./routes/web";

// HyperExpress: high-performance HTTP server framework
import HyperExpress from "hyper-express";

// Node.js path utilities (used to resolve HTTPS certificate paths)
import path from 'path';

import { Response, Request } from "./type";
import { logError, logInfo } from "./app/services/Logger";

// Base server options: request body limit and TLS placeholders
const option = {
  max_body_length: 10 * 1024 * 1024, // 10MB request body limit
  key_file_name : "", // HTTPS private key file path (set when PROTOCOL='https')
  cert_file_name : "", // HTTPS certificate file path (set when PROTOCOL='https')
};

// Enable HTTPS when PROTOCOL='https' using local dev certificates
// Enable HTTPS when HAS_CERTIFICATE='true' using local dev certificates
if(process.env.HAS_CERTIFICATE === 'true') {
  option.key_file_name = path.join(process.cwd(), 'localhost+1-key.pem'); // private key
  option.cert_file_name = path.join(process.cwd(), 'localhost+1.pem');     // certificate
}

// Create the HyperExpress server with the above options
const webserver = new HyperExpress.Server(option);

// Register view engine & template rendering (side-effect import)
// This module sets up HTML/Inertia view rendering globally.
import "app/services/View";

// Global middlewares
// webserver.use(securityHeaders()); // Add security headers to all responses
 

webserver.use(inertia()); // Enable Inertia middleware for SSR-like responses

// webserver.use(csrf()); // Enable CSRF protection for state-changing requests

// Mount application routes
webserver.use(Web);

// Resolve server port from environment or default to 5555
const PORT = parseInt(process.env.PORT || '') || 5555;

// Global error handler (runs for unhandled errors in requests)
webserver.set_error_handler((request : Request, response : Response, error: any) => {
   // Log error properly with Winston
   logError('Unhandled request error', error, {
      method: request.method,
      url: request.url,
      ip: request.ip
   });

   // Handle SQLite-specific errors with 500 status
   if (error.code == "SQLITE_ERROR") {
      response.status(500);
   }

   // In production, return generic error message
   // In development, return error details for debugging
   const isDevelopment = process.env.NODE_ENV !== 'production';
   response.json({
      error: isDevelopment ? error.message : 'Internal server error',
      ...(isDevelopment && { stack: error.stack, code: error.code })
   });
});

// Start the server and log the local URL
webserver
   .listen(PORT)
   .then(() => {
      const protocol = process.env.HAS_CERTIFICATE === 'true' ? 'https' : 'http';
      logInfo(`Server is running at ${protocol}://localhost:${PORT}`, {
         port: PORT,
         protocol,
         environment: process.env.NODE_ENV || 'development'
      });
   })
   .catch((err: any) => {
      logError('Failed to start server', err);
      process.exit(1);
   });

// Graceful shutdown: handle SIGTERM (e.g., Docker/K8s stop)
process.on("SIGTERM", () => {
   logInfo('SIGTERM signal received, shutting down gracefully');
   process.exit(0);
});
