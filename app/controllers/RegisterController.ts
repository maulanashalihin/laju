import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import { registerSchema } from "../validators/AuthValidator";
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
      const body = await request.json();
      
      const validated = Validator.validateOrFail(registerSchema, body, response);
      if (!validated) return;
      
      const { email, password, name } = validated;

      try {
         const user = {
            email,
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
