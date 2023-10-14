import { renderToString } from "react-dom/server";

export default  function (ctx, headers = {}) {
   return {
      render: async (filename: string, params: any) => {
         const { Component } = await import(
            `../../resources/views/${filename}`
         );

         const page = Component(params);

         const stream = await renderToString(page);

         return new Response(stream, {
            headers: { ...headers,
                "Content-Type": "text/html",
                "Set-Cookie": ctx.headers.get("Set-Cookie"),
             },
         });
      },
   };
}
