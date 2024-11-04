import { readFileSync, readdirSync, statSync } from "fs";
import * as Sqrl from 'squirrelly'
// const manifest = require("../../public/manifest.json");
import path from "path";

let html_files = {} as {
   [key: string]: string;
};

let manifest = {};

 function getJsFiles(directory = "resources/js") {
    const files = readdirSync(directory);
 
 
    for (const filename of files) {
     
       const filePath = path.join(directory, filename);
       const stats = statSync(filePath);
 
       if (!stats.isDirectory()) { 
       
         if(process.env.NODE_ENV == 'development')
         {
            manifest[filename] = `http://localhost:${process.env.VITE_PORT}/js/${filename}`;
         }else{
            manifest[filename] = "/js/" + filename;
         }
        
          
       }
    }
 
 }
 

 let directory = "resources/views";

 if(process.env.NODE_ENV == 'production')
{
   directory = "dist/views";
} 
 
function importFiles( nextDirectory = "resources/views") {


   const files = readdirSync(nextDirectory);

   for (const filename of files) {
      const results = statSync(path.join(nextDirectory, filename));

      if (results.isDirectory()) {
         importFiles(path.join(nextDirectory, filename)); // recursive call to get all files
      } else {
         const html = readFileSync(path.join(nextDirectory, filename), "utf8");

         html_files[nextDirectory + "/" + filename] = html;
      }
   }

   getJsFiles()
}
export function view(filename: string, view_data?: any) {
    

   const keys = Object.keys(view_data || {});

   let html = process.env.CACHE_VIEW == "true" ?  html_files[directory + "/" + filename] : readFileSync(path.join(directory, filename), "utf8");;
   
   if(process.env.NODE_ENV == 'development')
   {
      Object.keys(manifest).forEach((key) => {
         html = html.replace("/js/"+key, manifest[key]);
      });
   }
 

   html = Sqrl.render(html, {
      ...view_data
   });



 

   return html;
}

export default importFiles(directory);
