// Laju Server Entrypoint
// Boots the HTTP server, wires middlewares & routes,
// loads environment variables, and configures HTTPS for local development.

// Inertia middleware: integrates Inertia.js responses for SSR-like pages
import inertia from "./app/middlewares/inertia";

// Application routes definition (all app endpoints)
import Web from "./routes/web";

// HyperExpress: high-performance HTTP server framework
import HyperExpress from "hyper-express";

// CORS middleware to allow cross-origin requests
import cors from 'cors';

// Node.js path utilities (used to resolve HTTPS certificate paths)
import path from 'path';
 
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
 
// Load environment variables from .env into process.env
require("dotenv").config();

// Register view engine & template rendering (side-effect import)
// This module sets up HTML/Inertia view rendering globally.
import "app/services/View"; 

// Global middlewares
webserver.use(cors()); // Enable CORS for cross-origin requests

webserver.use(inertia()); // Enable Inertia middleware for SSR-like responses

// Mount application routes
webserver.use(Web); 

// Resolve server port from environment or default to 5555
const PORT = parseInt(process.env.PORT) || 5555;
 
// Global error handler (runs for unhandled errors in requests)
webserver.set_error_handler((req, res, error: any) => {
   console.log(error); // Log error for visibility

   // Example: handle SQLite-specific errors with 500 status
   if (error.code == "SQLITE_ERROR") {
      res.status(500);
   }

   // Return error details in JSON (useful during development)
   res.json(error);
});

// Start the server and log the local URL
webserver
   .listen(PORT)
   .then(() => {
      console.log(`Server is running at http://localhost:${PORT}`);
   })
   // Consider logging or handling startup errors here
   .catch((err: any) => {});

// Graceful shutdown: handle SIGTERM (e.g., Docker/K8s stop)
process.on("SIGTERM", () => {
   console.info("SIGTERM signal received.");
   process.exit(0);
});
