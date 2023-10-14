import Html from "./Html";

const pkg = require("../../package.json");
import manifest  from "../../public/manifest.json";
import Cookie from "../services/Cookie";
import Session from "../services/Session";


export default function(ctx: any,headers = {}) {
   
    return {
        render : async (component: string, props: any = {})=>{

            const error = Cookie(ctx).get("error");

            if(error)
            {
                props.error = error;
                Cookie(ctx).remove("error");
            } 

            const session = await Session.current(ctx);

            if(session)
            {
                props.session = session;

            }


            const inertiaObject = {
                component: component,
                props: props,
                url: ctx.url.replace("http:",""), 
                version: pkg.version,
            };  

            if(!ctx.headers.get("X-Inertia"))
            {
               return Html(ctx,headers).render("inertia.html",{page : JSON.stringify(inertiaObject).replace(/"/g, "&quot;"), "app.js" : manifest["app.js"], "style.css" : manifest["style.css"]});
            }

          
            return new Response(JSON.stringify(inertiaObject), {
                headers: {
                    ...headers,
                    "Set-Cookie": ctx.headers.get("Set-Cookie"),
                    "Vary": "Accept",
                    "X-Inertia": "true",
                    "Content-Type": "application/json",
                },
            });

           
        }
    }
}