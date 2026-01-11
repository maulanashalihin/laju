import DB from "../services/DB";
import { Response, Request } from "../../type";

class ProfileController {
   public async profilePage(request: Request, response: Response) {
      return response.inertia("profile");
   }

   public async changeProfile(request: Request, response: Response) {
      const data = await request.json();

      await DB.from("users").where("id", request.user.id).update({
         name: data.name,
         email: data.email.toLowerCase(),
         phone: data.phone,
      });

      return response.json({ message: "Your profile has been updated" });
   }

   public async homePage(request: Request, response: Response) {
      return response.inertia("home");
   }

   public async deleteUsers(request: Request, response: Response) {
      const { ids } = request.body;

      if (!Array.isArray(ids)) {
         return response.status(400).json({ error: "Invalid request format" });
      }

      if (!request.user.is_admin) {
         return response.status(403).json({ error: "Unauthorized" });
      }

      await DB.from("users").whereIn("id", ids).delete();

      return response.redirect("/home");
   }
}

export default new ProfileController();
