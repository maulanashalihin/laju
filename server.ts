import inertia from "./app/middlewares/inertia";

import Web from "./routes/web";

import HyperExpress from "hyper-express";

import cors from 'cors';
import path from 'path';
 

const option = {
  max_body_length: 10 * 1024 * 1024, // 10MB
  key_file_name : "",
  cert_file_name : "",
};

if(process.env.PROTOCOL === 'https') {
  option.key_file_name = path.join(process.cwd(), 'localhost+1-key.pem');
  option.cert_file_name = path.join(process.cwd(), 'localhost+1.pem');
}

const webserver = new HyperExpress.Server(option);
 
require("dotenv").config();

//  rendering html files
import "app/services/View"; 


webserver.use(cors());

webserver.use(inertia());

webserver.use(Web); 

const PORT = parseInt(process.env.PORT) || 5555;
 
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
