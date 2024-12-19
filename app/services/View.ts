/**
 * View Service
 * This service handles template rendering and view management for the application.
 * It uses Squirrelly as the templating engine and supports hot reloading in development.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import * as Sqrl from 'squirrelly' 
import path from "path";
require("dotenv").config();

/**
 * Cache object to store compiled HTML templates
 * Key: template path, Value: compiled HTML content
 */
let html_files = {} as {
   [key: string]: string;
}; 

// Set views directory based on environment
let directory = process.env.NODE_ENV == 'development' ?    "resources/views" : "dist/views";

// Set up file watcher for hot reloading in development
if(process.env.NODE_ENV == 'development')
   {
      const chokidar = require("chokidar");

      var watcher = chokidar.watch('resources/views', { ignored: /^\./, persistent: true });

      watcher 
      .on('change', (path) => {

         importFiles(directory);
         
      })
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
               Sqrl.templates.define(dir + "/" + filename, Sqrl.compile(html))
            } 
            html_files[nextDirectory + "/" + filename] = html;
         }
      }
   } catch (error) {
      if (error.code === 'ENOENT') {
         throw new Error(`Views directory not found: ${nextDirectory}. Please make sure the directory exists.`);
      }
      throw error; // Re-throw other errors
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
    

   const keys = Object.keys(view_data || {}); 

   let html = html_files[directory + "/" + filename];
   
   if(process.env.NODE_ENV == 'development')
   {
      
      const files = readdirSync("resources/js");

      for (const filename of files) {
     
         
         html = html.replace("/js/"+filename, `http://localhost:${process.env.VITE_PORT}/js/${filename}`);
      }

       
   }
 
   html = Sqrl.render(html, {
      ...view_data
   }); 

   return html;
}

// Initialize by importing all template files
export default importFiles(directory);
