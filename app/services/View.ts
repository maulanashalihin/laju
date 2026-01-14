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
let directory = process.env.NODE_ENV !== 'production' ? "resources/views" : "dist/views";

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

// Debounce timer for file watcher
let reloadTimeout: NodeJS.Timeout | null = null;

// Set up file watcher for hot reloading in development using native fs.watch 

/**
 * Recursively imports and compiles template files from the views directory
 * Handles both regular templates and partials (reusable template components)
 * Also replaces asset paths based on environment
 * @param nextDirectory - Directory to scan for template files
 */ 
 
/**
 * Load Vite manifest.json for production asset paths
 */
function loadViteManifest() {
   const manifestPath = path.join(process.cwd(), 'dist/.vite/manifest.json');
   if (existsSync(manifestPath)) {
      try {
         const manifestContent = readFileSync(manifestPath, 'utf8');
         viteManifest = JSON.parse(manifestContent);
        Object.keys(viteManifest).forEach(item => {
                if (viteManifest[item].css) {
                    viteManifest[item].css.forEach(cssItem => {
                        viteManifest[item.replace(".js", ".css")] = {
                            file: cssItem
                        };
                    });
                }
            }); 
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
export function view(filename: string, view_data?: any) {
   view_data = view_data || {};
   let css = {} as string[] | undefined;
   view_data.asset = function(file: string){
      if(process.env.NODE_ENV === 'production')
      {   
        return viteManifest[file].file
      }
      return `http://localhost:${process.env.VITE_PORT}/${file}`
   }

   let rendered = eta.render(filename, view_data || {});
   
   // Replace asset paths in production
   // if (process.env.NODE_ENV !== 'development') {
   //    if (!viteManifest) {
   //       loadViteManifest();
   //    }
   //    if (viteManifest) {
   //       return replaceAssetsWithManifest(rendered);
   //    }
   // }else{
   //      for (const jsFile of jsFilesCache) {
   //                rendered = rendered.replace("/js/"+jsFile, `http://localhost:${process.env.VITE_PORT}/js/${jsFile}`);
   //             }
   // }
 
   
   return rendered;
}

// Initialize by importing all template files
// export default importFiles(directory);
