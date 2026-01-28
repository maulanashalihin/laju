/**
 * View Service
 * This service handles template rendering and view management for the application.
 * It uses Eta as the templating engine and supports hot reloading in development.
 */

import { readFileSync, readdirSync, statSync, watch, existsSync } from "fs";
import { Eta } from 'eta'
import path from "path";
import "dotenv/config";  

// Set views directory based on environment
let directory = "resources/views";

// Configure Eta instance
const eta = new Eta({
   views: path.join(process.cwd(), directory),
   cache: process.env.NODE_ENV !== 'development',
   autoEscape: true
});

// Cache for JS files in development mode
let jsFilesCache: string[] = [];

// Cache for Vite manifest in production
interface ViteManifestEntry {
   file: string;
   name?: string;
   src?: string;
   isEntry?: boolean;
   isDynamicEntry?: boolean;
   imports?: string[];
   dynamicImports?: string[];
   css?: string[];
}

let viteManifest: Record<string, ViteManifestEntry> ;

/**
 * Load Vite manifest.json for production asset paths
 */
function loadViteManifest() {
   const manifestPath = path.join(process.cwd(), 'dist/.vite/manifest.json');
   if (existsSync(manifestPath)) {
      try {
         const manifestContent = readFileSync(manifestPath, 'utf8');
         viteManifest = JSON.parse(manifestContent);
  
      } catch (error) {
         console.error('Error loading Vite manifest:', error);
         viteManifest = {};
      }
   }
}

if(process.env.NODE_ENV === 'production')
{
   loadViteManifest(); 
}

 

/**
 * Renders a template file with provided data
 * @param filename - Name of the template file to render
 * @param view_data - Data to be passed to the template
 * @returns Rendered HTML string
 */
export function view(filename: string, view_data?: Record<string, unknown>) {
   view_data = view_data || {};  
   view_data.base_url = process.env.APP_URL; 
   view_data.current_year = new Date().getFullYear(); 
   view_data.asset = function(file: string){
      if(process.env.NODE_ENV === 'production')
      {
        const entry = viteManifest[file];
        if (!entry) return file;
        return file.endsWith(".js") ? "/"+entry.file : entry.file.endsWith(".css") ? "/"+entry.file : "/"+entry.css?.[0] || "/"+file;
      }
      return `http://localhost:${process.env.VITE_PORT}/${file}`
   }

   let rendered = eta.render(filename, view_data || {});
    
 
   
   return rendered;
}
 