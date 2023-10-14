import Html from "./Html";

const pkg = require("../../package.json");
import manifest  from "../../public/manifest.json";


export default function(ctx: any) {
   
    return {
        render : (component: string, props: any = {})=>{

            const inertiaObject = {
                component: component,
                props: props,
                url: ctx.url.replace("http:",""), 
                version: pkg.version,
            };  

            if(!ctx.headers.get("X-Inertia"))
            {
                
               return Html("inertia.html",{page : JSON.stringify(inertiaObject).replace(/"/g, "&quot;"), "app.js" : manifest["app.js"]});
            
            }

          
            return new Response(JSON.stringify(inertiaObject), {
                headers: {
                    "Vary": "Accept",
                    "X-Inertia": "true",
                    "Content-Type": "application/json",
                },
            });

           
        }
    }
}