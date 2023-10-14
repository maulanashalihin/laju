import {  readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import path from "path";
/**
 * @param {string | Buffer | URL} directoryPath
 * @returns {Promise<string[]>} - Array of long file paths
 */
async function getFiles( directoryPath ) {

    try {
        const fileNames = await readdir( directoryPath ); // returns a JS array of just short/local file-names, not paths.
        const filePaths = fileNames.map( fn => join( directoryPath, fn ) );
        return filePaths;
    }
    catch (err) {
        console.error( err ); // depending on your application, this `catch` block (as-is) may be inappropriate; consider instead, either not-catching and/or re-throwing a new Error with the previous err attached.
    }
}

const files = await getFiles(import.meta.dir+"/../../resources/views") as string[];

const cache_view = {};

for (const file of files) {
    if(file)
    { 
        const filename = file.split("/").pop();

        if(filename)
        {
             
            cache_view[filename] = await Bun.file(file).text();; 
        }
        
    }
    
}



export default   function(ctx, headers = {})
{
    
  
   return {
    render : (filename, params = {})=>{

        let html =  cache_view[filename] || ''; 
    
        if (process.env.APP_ENV == "development") {
    
            html = readFileSync(path.join("resources/views", filename), "utf8");
    
            html = html.replace(
               "</body>",
               `
            <script>
            var evtSource = new EventSource('http://localhost:8005/subscribe');
      
               evtSource.onmessage = function (event) { 
               if (event.data.includes("reload")) {
                  console.log("reloaded")
                  location.reload()
               }
            };
            </script>
            </body>
            `
            );
         }
    
         Object.keys(params).forEach(key => {
            html = html.replaceAll(`{{${key}}}`, params[key]);
        }) 
    
       
        return new Response(html, {
            headers: {
                ...headers,
                "Set-Cookie": ctx.headers.get("Set-Cookie"),
                "Content-Type": "text/html"
            }
        });
    }
   }
}

