import { eq, sql } from "drizzle-orm";
import DB from "../db";
import { sessions, users } from "../db/schema";
import response from "../responses";
import Inertia from "../responses/Inertia";
import { generateUUID } from "../services/Helper";
import Cookie from "../services/Cookie";
import Session from "../services/Session";

const user =   DB.select()
.from(users)
.where(eq(users.email, sql.placeholder("email"))).prepare()

class Controller {
   public async loginPage(ctx) {
      return Inertia(ctx).render("login");
   }

   public async loginWithPassword(ctx) {
    const check = await user.execute({ email: ctx.data.email });

    if(check.length)
    {

      const _user = check[0] as any;

      const valid = await Bun.password.verify(ctx.data.password, _user.password);

      if(valid)
      {
         const session_ = await DB.insert(sessions).values({
            id: generateUUID(),
            user_id: _user.id,
            user_agent: ctx.headers.get("user-agent"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }).returning();

          Cookie(ctx).set("session_id", session_[0].id);

          return response(ctx).redirect("/auth/home");
      }else{
         Cookie(ctx).set("error", "Password is incorrect");

         return response(ctx).redirect("/login")
      }
       
    }else{
      Cookie(ctx).set("error", "Email not found");

       return response(ctx).redirect("/login")
    }
   }

   public async loginWithGoogle(ctx) {
      return Inertia(ctx).render("login");
   }

   public async registerPage(ctx) {
      return Inertia(ctx).render("register");
   }

   public async register(ctx) {

        const check = await user.execute({ email: ctx.data.email });

         if(check.length)
         {
            Cookie(ctx).set("error", "Email already exists");

            return response(ctx).redirect("/register")
         }

      const { email, password, name, phone, createdAt, updatedAt } = ctx.data;

      if (check.length === 0) {

         const _user = await DB.insert(users)
            .values({
               id: generateUUID(),
               email,
               password : await Bun.password.hash(password),
               name,
               phone,
               createdAt,
               updatedAt,
            }).returning();

          

          const session_ = await DB.insert(sessions).values({
            id: generateUUID(),
            user_id: _user[0].id,
            user_agent: ctx.headers.get("user-agent"),
            createdAt,
            updatedAt,
          }).returning();

          Cookie(ctx).set("session_id", session_[0].id);

          return response(ctx).redirect("/auth/home");
          


             
      }

      return response(ctx).json(ctx.data);
   }

   public async home(ctx) {
    

      return Inertia(ctx).render("home");
   }

   public async logout(ctx) {
      
      
      await Session.logout(ctx);

  
      return response(ctx).redirect("/login");
   }

   public async update(ctx) {}

   public async destroy(ctx) {}
}

export default new Controller();
