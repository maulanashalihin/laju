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
               SELECT u.*
               FROM sessions s
               JOIN users u ON s.user_id = u.id
               WHERE s.id = ? AND s.expires_at > datetime('now')
            `, [request.cookies.auth_id]) as User | undefined;

      if (!user) {
         return redirectToLogin();
      }

      request.user = user; 

   } catch (error) {
      console.error("Auth middleware error:", error);
      return redirectToLogin();
   }
};
