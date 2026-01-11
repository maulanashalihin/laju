
import { view } from "../services/View";
import { Request, Response } from "../../type";

let pkg = { version: "1.0.0" };


const inertia = () => {
   return (request: Request, response: Response, next: Function) => {
      response.inertia = async (component, inertiaProps = {}, viewProps = {}) => {

         const url = `${request.originalUrl}`;

         let props = { user: request.user || {}, ...inertiaProps, ...viewProps, error: null } as any;



         if (request.cookies.error) {
            props.error = request.cookies.error;
            response
               .cookie("error", "", 0)
         }

         const inertiaObject = {
            component: component,
            props: props,
            url: url,
            version: pkg.version,
         };

         if (!request.header("X-Inertia")) {
            const html = await view("inertia.html", {
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

      next();
   };
};

export default inertia;
