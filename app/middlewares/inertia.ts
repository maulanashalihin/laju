
import { view } from "../services/View";
import { Request, Response } from "../../type";
import { readFileSync } from "fs";
import path from "path";

const pkg = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8"));

const inertia = () => {
   return async (request: Request, response: Response) => {
      // Set up the flash method on response
      response.flash = (type: string, message: string, ttl: number = 3000) => {
         response.cookie(type, message, ttl);
         return response;
      };


      response.redirect = ((url: string, status: number = 302) => { 
         return response.status(status).setHeader("Location", url).send();
      }) as { (url: string): boolean; (url: string, status?: number): Response };

      // Set up the inertia method on response
      response.inertia = async (component : string, inertiaProps = {}, viewProps = {}) => {

          const url = request.originalUrl;

         // Merge shared props with inertia props
         let props: Record<string, unknown> = {
            ...request.share,
            user: request.user || {},
            ...inertiaProps
         };

         // Parse all flash messages from cookies
         const flashTypes = ['error', 'success', 'info', 'warning'];
         const flashMessages: Record<string, string> = {};

         for (const type of flashTypes) {
            if (request.cookies[type]) {
               flashMessages[type] = request.cookies[type];
               response.cookie(type, "", 0);
            }
         }

         // Add flash messages to props
         if (Object.keys(flashMessages).length > 0) {
            props.flash = flashMessages;
         }

         const inertiaObject = {
            component: component,
            props: props,
            url: url,
            version: pkg.version,
         };

         if (!request.header("X-Inertia")) {
            const html = view("inertia.html", {
               page: JSON.stringify(inertiaObject), 
               ...viewProps
            });

            return response.type("html").send(html);
         }

         response.setHeader("Vary", "Accept");
         response.setHeader("X-Inertia", "true");
         response.setHeader("X-Inertia-Version", pkg.version);

         return response.json(inertiaObject);
      };

      // CRITICAL: Must not call anything here to let request pass through to route handlers
      // The inertia method is just attached to response for use by controllers
   };
};

export default inertia;