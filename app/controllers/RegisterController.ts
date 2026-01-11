import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import { Response, Request } from "../../type";
import { randomUUID } from "crypto";

class RegisterController {
   public async registerPage(request: Request, response: Response) {
      if (request.cookies.auth_id) {
         return response.redirect("/home");
      }
      return response.inertia("auth/register");
   }

   public async processRegister(request: Request, response: Response) {
      let { email, password, name } = await request.json();

      email = email.toLowerCase();

      try {
         const user = {
            email: email,
            id: randomUUID(),
            name,
            password: await Authenticate.hash(password),
         };

         await DB.table("users").insert(user);

         return Authenticate.process(user, request, response);
      } catch (error) {
         console.log(error);
         return response
            .cookie("error", "Maaf, Email sudah terdaftar", 3000)
            .redirect("/register");
      }
   }
}

export default new RegisterController();
