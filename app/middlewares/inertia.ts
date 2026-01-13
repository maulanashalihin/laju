import { view } from "../services/View";
import { Request, Response } from "../../type";
import { readFileSync } from "fs";
import path from "path";

const pkg = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8"));

interface InertiaProps {
   user?: any;
   error?: string | null;
   [key: string]: any;
}

const inertia = () => {
   return (request: Request, response: Response) => {
      response.inertia = (component: string, inertiaProps: InertiaProps = {}, viewProps: InertiaProps = {}) => {
         const url = request.originalUrl;
         const props: InertiaProps = { user: request.user || {}, ...inertiaProps, ...viewProps, error: null };

         if (request.cookies.error) {
            props.error = request.cookies.error;
            response.cookie("error", "", 0);
         }

         const inertiaObject = {
            component,
            props,
            url,
            version: pkg.version,
         };

         if (!request.header("X-Inertia")) {
            const html = view("inertia.html", {
               page: JSON.stringify(inertiaObject),
               title: process.env.TITLE || "LAJU - Ship Your Next Project Faster",
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
