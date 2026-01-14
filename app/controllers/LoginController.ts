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
      try {
         const body = await request.json();
         
         const validationResult = Validator.validate(loginSchema, body);
         
         if (!validationResult.success) {
            const errors = validationResult.errors || {};
            const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
            return response
               .flash("error", firstError)
               .redirect("/login");
         }
         
         const { email, password, phone } = validationResult.data!;

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
                  .flash("error", "Incorrect password")
                  .redirect("/login");
            }
         } else {
            return response
               .flash("error", "Email/Phone not registered")
               .redirect("/login");
         }
      } catch (error: any) {
         console.error("Login error:", error);
         return response
            .flash("error", "An error occurred during login. Please try again later.")
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
