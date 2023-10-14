import { Router } from "@stricjs/router";
import AuthController from "../app/controllers/AuthController";

import Cookie from "../app/services/Cookie";

import Session from "../app/services/Session";

const Route = new Router();

Route.get("/login", AuthController.loginPage);
Route.post("/login", AuthController.loginWithPassword, { body: "json" });
Route.get("/login-with-google", AuthController.loginWithGoogle);
Route.get("/register", AuthController.registerPage);
Route.post("/register", AuthController.register, { body: "json" });
Route.post("/logout", AuthController.logout);

Route.guard("/auth", async (ctx: any) => {
   const session_id = Cookie(ctx).get("session_id");

   if (session_id) {
      let session_ = await Session.get(session_id);

      if (!session_) {
         return null;
      }

      return true;
   }

   return null;
});

Route.get("/auth/home", AuthController.home);

Route.reject("/auth", () => new Response("Forbidden"));

export default Route;
