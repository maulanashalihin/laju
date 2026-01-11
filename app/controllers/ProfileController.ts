import DB from "../services/DB";
import Validator from "../services/Validator";
import { updateProfileSchema, deleteUsersSchema } from "../validators/ProfileValidator";
import { Response, Request } from "../../type";

class ProfileController {
   public async profilePage(request: Request, response: Response) {
      return response.inertia("profile");
   }

   public async changeProfile(request: Request, response: Response) {
      const body = await request.json();
      
      const validated = Validator.validateOrFail(updateProfileSchema, body, response);
      if (!validated) return;

      await DB.from("users").where("id", request.user.id).update({
         name: validated.name,
         email: validated.email,
         phone: validated.phone || null,
      });

      return response.json({ message: "Your profile has been updated" });
   }

   public async homePage(request: Request, response: Response) {
      return response.inertia("home");
   }

   public async deleteUsers(request: Request, response: Response) {
      const body = await request.json();
      
      const validated = Validator.validateOrFail(deleteUsersSchema, body, response);
      if (!validated) return;

      if (!request.user.is_admin) {
         return response.status(403).json({ error: "Unauthorized" });
      }

      await DB.from("users").whereIn("id", validated.ids).delete();

      return response.redirect("/home");
   }
}

export default new ProfileController();
