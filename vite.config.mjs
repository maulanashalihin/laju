import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import 'dotenv/config'
import { resolve } from 'path';

// Vite entry point - only build JS/CSS assets
const input = {
  app: resolve(__dirname, 'resources/js/app.js'),
  index: resolve(__dirname, 'resources/js/index.js'),
  css: resolve(__dirname, 'resources/js/index.css'),
};

// Default port from environment or fallback to 3000
const PORT = parseInt(process.env.VITE_PORT) || 3000;
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
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
    manifest: true,
    rollupOptions: {
      input: input
    }
  }
});
