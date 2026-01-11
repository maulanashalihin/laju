import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import { loginSchema } from "../validators/AuthValidator";
import { Response, Request } from "../../type";

class LoginController {
   public async loginPage(request: Request, response: Response) {
      if (request.cookies.auth_id) {
         return response.redirect("/home");
      }
      return response.inertia("auth/login");
   }

   public async processLogin(request: Request, response: Response) {
      const body = await request.json();
      
      const validated = Validator.validateOrFail(loginSchema, body, response);
      if (!validated) return;
      
      const { email, password, phone } = validated;

      let user;

      if (email && email.includes("@")) {
         user = await DB.from("users").where("email", email.toLowerCase()).first();
      } else if (phone) {
         user = await DB.from("users").where("phone", phone).first();
      }

      if (user) {
         const password_match = await Authenticate.compare(password, user.password);

         if (password_match) {
            return Authenticate.process(user, request, response);
         } else {
            return response
               .cookie("error", "Maaf, Password salah", 3000)
               .redirect("/login");
         }
      } else {
         return response
            .cookie("error", "Email/No.HP tidak terdaftar", 3000)
            .redirect("/login");
      }
   }

   public async logout(request: Request, response: Response) {
      if (request.cookies.auth_id) {
         await Authenticate.logout(request, response);
      }
   }
}

export default new LoginController();
