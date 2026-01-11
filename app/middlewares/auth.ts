 
import SQLite from "../services/SQLite";
import { Request, Response } from "../../type";

export default async (request : Request,response : Response) => {
     
   if(request.cookies.auth_id)
   { 
       const user = SQLite.get(`
            SELECT u.id, u.name, u.email, u.phone, u.is_admin, u.is_verified 
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
       `, [request.cookies.auth_id]);

       if(user)
       {
           // Convert SQLite 0/1 to boolean
           user.is_admin = !!user.is_admin;
           user.is_verified = !!user.is_verified;

           request.user = user;

           request.share = {
               "user" : request.user,
           }
       }else{ 
           return response.cookie("auth_id","",0).redirect("/login");
       }
      
   }
   else
   { 
       return response.cookie("auth_id","",0).redirect("/login");
   }
}