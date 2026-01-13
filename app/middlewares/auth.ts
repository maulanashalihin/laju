import SQLite from "../services/SQLite";
import Cache from "../services/CacheService";
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
   const redirectToLogin = () => response.cookie("auth_id", "", 0).redirect("/login");

   if (!request.cookies.auth_id) {
      return redirectToLogin();
   }

   try {
      const user = await Cache.remember(
         `session:${request.cookies.auth_id}`,
         60 * 24 * 60, // 60 days in minutes
         async () => {
            return SQLite.get(`
               SELECT u.id, u.name, u.email, u.phone, u.is_admin, u.is_verified 
               FROM sessions s
               JOIN users u ON s.user_id = u.id
               WHERE s.id = ? AND s.expires_at > datetime('now')
            `, [request.cookies.auth_id]);
         }
      );

      if (!user) {
         return redirectToLogin();
      }

      user.is_admin = Boolean(user.is_admin);
      user.is_verified = Boolean(user.is_verified);

      request.user = user;
      request.share = { user: request.user };
   } catch (error) {
      console.error("Auth middleware error:", error);
      return redirectToLogin();
   }
};