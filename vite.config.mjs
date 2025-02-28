import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import 'dotenv/config'
import { resolve } from 'path'
import { readdirSync } from 'fs';

const files = readdirSync("resources/views");

let input = {};

for (const filename of files) {
  input[filename.replace(".html", "")] = resolve(__dirname, `resources/views/${filename}`);
}

// Default port from environment or fallback to 3000
const PORT = parseInt(process.env.VITE_PORT) || 3000;
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'port-handling',
      configureServer(server) {
        // Handle server startup errors
        server.httpServer?.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.error(`\x1b[31mError: Vite Port ${PORT} is already in use. Shutting down server.\x1b[0m`);
            // Exit the process with an error code
            process.exit(1);
          }
        });
      }
    }
  ],
  root: 'resources',
  server: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: true // Don't allow Vite to automatically try the next available port
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: input
    }
  }
});
