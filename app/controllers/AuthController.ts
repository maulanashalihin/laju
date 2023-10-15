import { eq, sql } from "drizzle-orm";
import DB from "../db";
import { sessions, users } from "../db/schema";
import response from "../responses";
import Inertia from "../responses/Inertia";
import { generateUUID, getQuery } from "../services/Helper";
import Cookie from "../services/Cookie";
import Session from "../services/Session";
import { redirectParamsURL } from "../services/GoogleAuth";
import axios from "axios";

const user = DB.select()
   .from(users)
   .where(eq(users.email, sql.placeholder("email")))
   .prepare();

class Controller {
   public async loginPage(ctx) {
      return Inertia(ctx).render("login");
   }

   public async loginWithPassword(ctx) {
      const check = await user.execute({ email: ctx.data.email });

      if (check.length) {
         const _user = check[0] as any;

         const valid = await Bun.password.verify(
            ctx.data.password,
            _user.password
         );

         if (valid) {
            const session_ = await DB.insert(sessions)
               .values({
                  id: generateUUID(),
                  user_id: _user.id,
                  user_agent: ctx.headers.get("user-agent"),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
               })
               .returning();

            Cookie(ctx).set("session_id", session_[0].id);

            return response(ctx).redirect("/auth/home");
         } else {
            Cookie(ctx).set("error", "Password is incorrect");

            return response(ctx).redirect("/login");
         }
      } else {
         Cookie(ctx).set("error", "Email not found");

         return response(ctx).redirect("/login");
      }
   }

   public async loginWithGoogle(ctx) {
      const params = redirectParamsURL();

      const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

      return response(ctx).redirect(googleLoginUrl);
   }

   public async googleCallback(ctx) {
      const { code } = getQuery(ctx.url);

      let data;

      try {
         const result = await axios({
            url: `https://oauth2.googleapis.com/token`,
            method: "post",
            data: {
               client_id: process.env.GOOGLE_CLIENT_ID,
               client_secret: process.env.GOOGLE_CLIENT_SECRET,
               redirect_uri: process.env.GOOGLE_REDIRECT_URI,
               grant_type: "authorization_code",
               code,
            },
         });

         data = result.data;
      } catch (error) {
         return response(ctx).redirect("/login");
      }

      const result = await axios({
         url: "https://www.googleapis.com/oauth2/v2/userinfo",
         method: "get",
         headers: {
            Authorization: `Bearer ${data.access_token}`,
         },
      });

      let { email, name, verified_email } = result.data;

      email = email.toLowerCase();

      const check = await user.execute({ email: email });

      if (check.length) {
         const _user = check[0] as any;
         //
         const session_ = await DB.insert(sessions)
            .values({
               id: generateUUID(),
               user_id: _user.id,
               user_agent: ctx.headers.get("user-agent"),
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
            .returning();

         Cookie(ctx).set("session_id", session_[0].id);

         return response(ctx).redirect("/auth/home");
      } else {
         const _user = await DB.insert(users)
            .values({
               id: generateUUID(),
               email,
               password: await Bun.password.hash(generateUUID()),
               name,
               phone: "",
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
            .returning();

         const session_ = await DB.insert(sessions)
            .values({
               id: generateUUID(),
               user_id: _user[0].id,
               user_agent: ctx.headers.get("user-agent"),
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
            })
            .returning();

         Cookie(ctx).set("session_id", session_[0].id);

         return response(ctx).redirect("/auth/home");
      }
   }

   public async registerPage(ctx) {
      return Inertia(ctx).render("register");
   }

   public async register(ctx) {
      const check = await user.execute({ email: ctx.data.email });

      if (check.length) {
         Cookie(ctx).set("error", "Email already exists");

         return response(ctx).redirect("/register");
      }

      const { email, password, name, phone, createdAt, updatedAt } = ctx.data;

      if (check.length === 0) {
         const _user = await DB.insert(users)
            .values({
               id: generateUUID(),
               email,
               password: await Bun.password.hash(password),
               name,
               phone,
               createdAt,
               updatedAt,
            })
            .returning();

         const session_ = await DB.insert(sessions)
            .values({
               id: generateUUID(),
               user_id: _user[0].id,
               user_agent: ctx.headers.get("user-agent"),
               createdAt,
               updatedAt,
            })
            .returning();

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
