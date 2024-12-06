import inertia from "./app/middlewares/inertia";

import Web from "./routes/web";

import HyperExpress from "hyper-express";

const webserver = new HyperExpress.Server();

import * as fs from 'fs';

require("dotenv").config();

//  rendering html files
import "./app/services/View";

//

var cors = require("cors");

webserver.use(cors());

webserver.use(inertia());

webserver.use(Web);

let cache = {};

webserver.get("/assets/:file", async (request, response) => {
   let file = request.params.file;

   try {
      const filePath = `dist/assets/${file}`;

      if (file.endsWith(".css")) {
         response.setHeader("Content-Type", "text/css");
      } else if (file.endsWith(".js")) {
         response.setHeader("Content-Type", "application/javascript");
      } else {
         response.setHeader("Content-Type", "application/octet-stream");
      }

      response.setHeader("Cache-Control", "public, max-age=31536000");

      if (cache[file]) {
         return response.send(cache[file]);
      } else if (
         await fs.promises
            .access(filePath)
            .then(() => true)
            .catch(() => false)
      ) {
         const fileContent = await fs.promises.readFile(filePath);

         cache[file] = fileContent;

         return response.send(fileContent);
      } else {
         return response.status(404).send("File not found");
      }
   } catch (error) {
      console.error("Error serving file:", error);
      return response.status(500).send("Internal server error");
   }
});

webserver.get("/*", (request, response) => {
   const allowedExtensions = [
      '.ico', '.png', '.jpeg', '.jpg', '.gif', '.svg', 
      '.txt', '.pdf', '.css', '.js', 
      '.woff', '.woff2', '.ttf', '.eot',
      '.mp4', '.webm', '.mp3', '.wav'
   ];
   const path = "public/"+request.path.replace("/", "").replaceAll("%20", " ");
   
   if (!allowedExtensions.some(ext => path.toLowerCase().endsWith(ext))) {
      return response.status(403).send('File type not allowed');
   }

   if (!fs.existsSync(path)) {
      return response.status(404).send('File not found');
   }

   return response.download(path);
});

const PORT = parseInt(process.env.PORT) || 5000;
 

webserver.set_error_handler((req, res, error: any) => {
   console.log(error);

   if (error.code == "SQLITE_ERROR") {
      res.status(500);
   }

   res.json(error);
});

webserver
   .listen(PORT)
   .then(() => {
      console.log(`Server is running at http://localhost:${PORT}`);
   })
   .catch((err: any) => {});

process.on("SIGTERM", () => {
   console.info("SIGTERM signal received.");
   process.exit(0);
});
