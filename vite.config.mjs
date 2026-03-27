import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import inertia from "@inertiajs/vite";
import "dotenv/config";
import { resolve } from "path";
import { writeFileSync, rmSync } from "fs";

// Vite entry point - only build JS/CSS assets
const input = {
  app: resolve(__dirname, "frontend/src/app.js"),
  index: resolve(__dirname, "frontend/src/index.js"),
  css: resolve(__dirname, "frontend/src/index.css"),
};

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend/src"),
    },
  },
  plugins: [
    tailwindcss(),
    svelte(),
    inertia(),
    {
      name: "write-port",
      configureServer(server) {
        server.httpServer?.on("listening", () => {
          const address = server.httpServer?.address();
          if (typeof address === "object" && address) {
            const port = address.port;
            const url = `http://localhost:${port}`;
            writeFileSync(".vite-port", url);
            console.log(`[vite-plugin] Port written to .vite-port: ${url}`);
          }
        });
        // Cleanup on exit
        const cleanup = () => {
          try {
            rmSync(".vite-port");
          } catch {}
          process.exit();
        };
        process.on("SIGINT", cleanup);
        process.on("SIGTERM", cleanup);
      },
    },
  ],
  root: "frontend",
  server: {
    host: "0.0.0.0",
    port: 0, // Let Vite find available port automatically
    strictPort: false, // Allow Vite to find next available port
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    manifest: true,
    target: "es2022",
    rollupOptions: {
      input: input,
    },
  },
});
