import esbuild from "esbuild";

import svelteInertiaPlugin from "esbuild-svelte-inertia";

import sveltePlugin from "esbuild-svelte";

let clients = [] as any;

let files = {};

let hash = {};

const port = 8005;

import { writeFileSync } from "fs";

async function Build(init = false) {
   try {
      const start = Date.now();

      let result = await esbuild.build({
         entryPoints: ["./resources/js/app.js"],
         mainFields: ["svelte", "browser", "module", "main"],
         conditions: ["svelte", "browser"],
         bundle: true,
         minify: true,
         write: false,
         plugins: [sveltePlugin(), svelteInertiaPlugin()],
         outdir: "public",
      });

      const end = Date.now();

      console.log(`compile done in ${end - start}ms`);

      const out = result.outputFiles;

      let manifest = `{
  "style.css" : "http://localhost:${port}/style.css",`;

      let count = 0;

      let push_change = false;

      for await (const file of out) {
         count++;
         const filename = file.path.split("/").pop();

         if (!filename) continue;

         files[filename] = file.text;
         if (hash[filename] != file.hash) {
            push_change = true;
            hash[filename] = file.hash;
         }
         manifest += `"${filename}": "http://localhost:${port}/${filename}"${count < out.length ? "," : ""
            }`;
      }

      if (push_change && !init) {
         console.log("compile done, pushing change...");

         clients.forEach((client) => {
            client.controller.enqueue(`data: reload\n\n`);
         });
      }

      manifest += `}`;

      if (init) {
         writeFileSync("./public/manifest.json", manifest);

         const getEnv = readFileSync("./.env", "utf8");

         getEnv.replace("APP_ENV=production", "APP_ENV=development");

         writeFileSync("./.env", getEnv);

      }
   } catch (error) { }
}

import chokidar from "chokidar";

var watcher = chokidar.watch("resources", {
   ignored: /^\./,
   persistent: true,
});

import { compile } from "svelte/compiler";
import { readFileSync } from "fs";
const fse = require("fs-extra");

function Compile(path) {
   const compiled = compile(readFileSync(path, "utf-8"), {
      name: "Component",
      generate: "ssr",
   });

   const filename = path
      .replace("resources/views/", "")
      .replace("svelte", "js");

   console.log(filename);

   fse.outputFile("./cache/" + filename, compiled.js.code)
      .then(() => {
         console.log("The file has been saved!");
      })
      .catch((err) => {
         console.error(err);
      });
}

watcher
   .on("ready", () => {
      console.log("Initial scan complete. Ready for changes");

      Build(true);
   })
   .on("change", (path) => {
      console.log("File", path, "has been changed");

      if (path.includes("/views/")) {

         clients.forEach((client) => {

            client.controller.enqueue(`data: reload\n\n`);
         });

         if (path.includes(".svelte")) {
            Compile(path);
         }
      } else {
         Build(false);
      }
   });

const server = Bun.serve({
   port: port,
   fetch(request) {
      const path = request.url.replace("http://localhost:" + port + "/", "");


      if (path == "subscribe") {

         
         const signal = request.signal;

         const stream = new ReadableStream({
            async start(controller) {
               controller.enqueue(`data: initialize\n\n`);

               clients.push({ controller });

               while (!signal.aborted) {
                  await Bun.sleep(1000);
               }
               clients = clients.filter((client) => client.controller != controller);
               controller.close(); 


            }
         });

         return new Response(stream, {
            status: 200,
            headers: {
               "Access-Control-Allow-Origin": "*",
               "Content-Type": "text/event-stream;charset=utf-8",
               "Cache-Control": "no-cache, no-transform",
               Connection: "keep-alive",
               "X-Accel-Buffering": "no",
            },
         });
      }

      let file;

      if (files[path]) {
         file = files[path];
      } else if (path == "favicon.ico") {
         file = Bun.file("public/favicon/favicon.ico");
      } else {
         file = Bun.file("public/" + path);
      }

      return new Response(file);
   },
});

console.log(
   `💎 esbuild is running at http://${server?.hostname}:${server?.port}`
);
