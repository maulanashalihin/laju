import { renderToString } from "react-dom/server";


export default async function (filename : string, params : any) {

    const {Component} = await import(`../../resources/views/${filename}`);

    const page = Component(params);

    const stream = await renderToString(page);

   return new Response(stream, {
      headers: { "Content-Type": "text/html" },
   });
}
