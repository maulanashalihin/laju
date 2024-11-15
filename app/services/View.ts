import { readFileSync, readdirSync, statSync } from "fs";
import * as Sqrl from 'squirrelly' 
import path from "path";

let html_files = {} as {
   [key: string]: string;
};

let manifest = {};

 

 let directory = process.env.NODE_ENV == 'production' ? "dist/views" :  "resources/views";

 
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

   
  
}
export function view(filename: string, view_data?: any) {
    

   const keys = Object.keys(view_data || {});
   

   let html = process.env.CACHE_VIEW == "true" ?  html_files[directory + "/" + filename] : readFileSync(path.join(directory, filename), "utf8");;
   
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
