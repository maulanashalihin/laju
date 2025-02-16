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
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  root: 'resources',
  server: {
    host: '0.0.0.0',
    port: process.env.VITE_PORT
  },
  
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input:  input
    }
  }
})
