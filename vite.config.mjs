import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import 'dotenv/config'

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
      input: {
        main: 'resources/views/inertia.html',
        home: 'resources/views/index.html'
      }
    }
  }
})