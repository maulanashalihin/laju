import DB from "./DB";
import { generateUUID } from "./helper";
const bcrypt = require("bcrypt");
const saltRounds = 10;
import { Request, Response } from "../../type";

class Autenticate {
   async hash(password: string) {
      return await bcrypt.hash(password, saltRounds);
   }
   async compare(password: string, hash: string) {
      return await bcrypt.compare(password, hash);
   }
   async process(user, request: Request, response: Response) {
      const token = generateUUID();

      await DB.table("sessions").insert({
         id: token,
         user_id: user.id,
         user_agent: request.headers["user-agent"],
      });

      response
         .cookie("auth_id", token, 1000 * 60 * 60 * 24 * 60)
         .redirect("home");
   }

   async logout(request: Request, response: Response) {
      await DB.from("sessions").where("id", request.cookies.auth_id).delete();

      response.cookie("auth_id", "", 0).redirect("login");
   }
}

export default new Autenticate();
