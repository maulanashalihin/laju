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
      try {
         const body = await request.json();
         
         const validationResult = Validator.validate(registerSchema, body);
         
         if (!validationResult.success) {
            const errors = validationResult.errors || {};
            const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
            return response
               .flash("error", firstError)
               .redirect("/register");
         }
         
         const { email, password, name } = validationResult.data!;

         const existingUser = await DB.from("users").where("email", email).first();
         if (existingUser) {
            return response
               .flash("error", "Email sudah terdaftar. Silakan gunakan email lain atau login.")
               .redirect("/register");
         }

         const user = {
            email,
            id: randomUUID(),
            name,
            password: await Authenticate.hash(password),
            is_admin: false,
            is_verified: false,
         };

         await DB.table("users").insert(user);

         return Authenticate.process(user, request, response);
      } catch (error: any) {
         console.error("Registration error:", error);
         
         if (error.code === 'SQLITE_CONSTRAINT') {
            return response
               .flash("error", "Email sudah terdaftar. Silakan gunakan email lain atau login.")
               .redirect("/register");
         }
         
         return response
            .flash("error", "Terjadi kesalahan saat mendaftar. Silakan coba lagi nanti.")
            .redirect("/register");
      }
   }
}

export default new RegisterController();
