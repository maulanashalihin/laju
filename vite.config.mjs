import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import 'dotenv/config'
import { readdirSync } from 'fs';

const files = readdirSync("resources/views");

let input = {};

for (const filename of files) {
  input[filename.replace(".html", "")] = `resources/views/${filename}`;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  root: 'resources',
  server: {
    port: process.env.VITE_PORT
  },
  
  build: {
    outDir: '../dist',
    rollupOptions: {
      rollupOptions: {
        input
      }
    }
  }
})
