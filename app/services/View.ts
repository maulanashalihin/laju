import { readFileSync, readdirSync, statSync } from "fs";
import * as Sqrl from 'squirrelly' 
import path from "path";
require("dotenv").config();
let html_files = {} as {
   [key: string]: string;
}; 

 let directory = process.env.NODE_ENV == 'development' ?    "resources/views" : "dist/views";
 
 if(process.env.NODE_ENV == 'development')
   {
      const chokidar = require("chokidar");

      var watcher = chokidar.watch('resources/views', { ignored: /^\./, persistent: true });

      watcher 
      .on('change', (path) => {

         importFiles(directory);
         
      })
   }


 
function importFiles( nextDirectory = "resources/views") {



   const files = readdirSync(nextDirectory);

   for (const filename of files) {
      const results = statSync(path.join(nextDirectory, filename));

      if (results.isDirectory()) {
         importFiles(path.join(nextDirectory, filename)); // recursive call to get all files
      } else {
         const html = readFileSync(path.join(nextDirectory, filename), "utf8");

         if(nextDirectory.includes("partials"))
         {
            Sqrl.templates.define(filename, Sqrl.compile(html))
         }
         


         html_files[nextDirectory + "/" + filename] = html;
      }
   }

   
  
}
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

export default importFiles(directory);
