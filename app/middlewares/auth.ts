import SQLite from "../services/SQLite"; 
import { Request, Response } from "../../type";
import type { User } from "../../type";

export default async (request: Request, response: Response) => {

   const redirectToLogin = () => response.cookie("auth_id", "", 0).redirect("/login");

   if (!request.cookies.auth_id) {
      return redirectToLogin();
   }

   try {
      const user = await SQLite.get(`
               SELECT u.id, u.name, u.email, u.phone, u.avatar, u.is_admin
               FROM sessions s
               JOIN users u ON s.user_id = u.id
               WHERE s.id = ? AND s.expires_at > datetime('now')
            `, [request.cookies.auth_id]) as User;

      if (!user) {
         return redirectToLogin();
      }

      user.is_admin = Boolean(user.is_admin);
      
      user.is_verified = Boolean(user.is_verified);

      request.user = user; 

   } catch (error) {
      console.error("Auth middleware error:", error);
      return redirectToLogin();
   }
};