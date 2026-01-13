/**
 * View Service
 * This service handles template rendering and view management for the application.
 * It uses Eta as the templating engine and supports hot reloading in development.
 */

import { readFileSync, readdirSync, statSync, watch } from "fs";
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

// Debounce timer for file watcher
let reloadTimeout: NodeJS.Timeout | null = null;

// Set up file watcher for hot reloading in development using native fs.watch
if (process.env.NODE_ENV === 'development') {
   watch('resources/views', { recursive: true }, (eventType, filename) => {
      if (filename && eventType === 'change') {
         // Debounce reload to prevent multiple rapid re-imports
         if (reloadTimeout) clearTimeout(reloadTimeout);
         reloadTimeout = setTimeout(() => {
            try {
               importFiles(directory);
            } catch (error) {
               console.error('Error reloading views:', error);
            }
         }, 100);
      }
   });

   // Cache JS files at startup in development
   try {
      jsFilesCache = readdirSync("resources/js");
   } catch (error) {
      console.error('Error caching JS files:', error);
      jsFilesCache = [];
   }
}

/**
 * Recursively imports and compiles template files from the views directory
 * Handles both regular templates and partials (reusable template components)
 * @param nextDirectory - Directory to scan for template files
 */
function importFiles( nextDirectory = "resources/views") {
   try {
      if (!statSync(nextDirectory).isDirectory()) {
         throw new Error(`Path ${nextDirectory} is not a directory`);
      }

      const files = readdirSync(nextDirectory);

      for (const filename of files) {
         const results = statSync(path.join(nextDirectory, filename));

         if (results.isDirectory()) {
            importFiles(path.join(nextDirectory, filename)); // recursive call to get all files
         } else {
            const html = readFileSync(path.join(nextDirectory, filename), "utf8");

            if(nextDirectory.includes("partials"))
            {
               const dir = nextDirectory.replace(directory+"/", "");
               eta.loadTemplate(dir + "/" + filename, html);
            }
            eta.loadTemplate(nextDirectory + "/" + filename, html);
         }
      }
   } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
         throw new Error(`Views directory not found: ${nextDirectory}. Please make sure the directory exists.`);
      }
      throw error;
   }
}

/**
 * Renders a template file with provided data
 * In development, it also handles asset path transformation for Vite
 * @param filename - Name of the template file to render
 * @param view_data - Data to be passed to the template
 * @returns Rendered HTML string
 */
export function view(filename: string, view_data?: any) {
   let html = eta.render(filename, view_data || {});

   if(process.env.NODE_ENV == 'development')
   {
      // Use cached JS files list instead of scanning every time
      for (const jsFile of jsFilesCache) {
         html = html.replace("/js/"+jsFile, `http://localhost:${process.env.VITE_PORT}/js/${jsFile}`);
      }
   }

   return html;
}

// Initialize by importing all template files
export default importFiles(directory);
