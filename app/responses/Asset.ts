let cache = {} as any;
export default function (context: any) {
   if (cache[context.params["*"]]) {
    
      return new Response(cache[context.params["*"]]);
   } else {
      cache[context.params["*"]] = Bun.file("public/" + context.params["*"]);

      return new Response(cache[context.params["*"]]);
   }
}
