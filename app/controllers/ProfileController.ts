import DB from "../services/DB";
import Validator from "../services/Validator";
import Authenticate from "../services/Authenticate";
import { updateProfileSchema, deleteUsersSchema } from "../validators/ProfileValidator";
import { Response, Request } from "../../type";

class ProfileController {
   public async profilePage(request: Request, response: Response) {
 
      return response.inertia("profile", { user: request.user });
   }

   public async changeProfile(request: Request, response: Response) {
      if (!request.user) {
         return response.status(401).json({ error: 'Unauthorized' });
      }

      const body = await request.json();
      const validationResult = Validator.validate(updateProfileSchema, body);

      if (!validationResult.success) {
         const errors = validationResult.errors || {};
         const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
         return response.flash("error", firstError).redirect("/profile", 303);
      }

      const { name, email, phone, avatar } = validationResult.data!;

      await DB.from("users").where("id", request.user.id).update({
         name,
         email,
         phone: phone || null,
         avatar: avatar || null,
      });
 

      return response.flash("success", "Profile updated successfully").redirect("/profile", 303);
   }

   public async homePage(request: Request, response: Response) {
      return response.inertia("home");
   }

   public async deleteUsers(request: Request, response: Response) {
      if (!request.user) {
         return response.status(401).json({ error: 'Unauthorized' });
      }

      const body = await request.json();

      const validationResult = Validator.validate(deleteUsersSchema, body);
      
      if (!validationResult.success) {
         return response.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.errors,
         });
      }
      
      const validated = validationResult.data!;

      if (!request.user.is_admin) {
         return response.status(403).json({ error: "Unauthorized" });
      }

      const userIds = validated.ids;
      
      await DB.from("users").whereIn("id", userIds).delete();

   

      return response.redirect("/home");
   }
}

export default new ProfileController();
