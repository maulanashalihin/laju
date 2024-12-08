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
