 import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import { redirectParamsURL } from "../services/GoogleAuth";
import axios from "axios"; 
import dayjs from "dayjs";
import Mailer from "../services/Mailer";
import { Response, Request } from "../../type"; 
import { randomUUID } from "crypto";

class AuthController {
   public async registerPage(request : Request, response: Response) {
      if (request.cookies.auth_id) {
         return response.redirect("/home");
      }

      return response.inertia("auth/register");
   }

   public async homePage(request : Request, response: Response) {
      const page = parseInt(request.query.page as string) || 1;
      const search = request.query.search as string || "";
      const filter = request.query.filter as string || "all";
      
      let query = DB.from("users").select("*");
      
      // Apply search
      if (search) {
         query = query.where(function() {
            this.where('name', 'like', `%${search}%`)
                .orWhere('email', 'like', `%${search}%`)
                .orWhere('phone', 'like', `%${search}%`);
         });
      }
      
      // Apply filters
      if (filter === 'verified') {
         query = query.where('is_verified', true);
      } else if (filter === 'unverified') {
         query = query.where('is_verified', false);
      }
      
      // Get total count
      const countQuery = query.clone();
      const total = await countQuery.count('* as count').first();
      
      // Get paginated results
      const users = await query
         .orderBy('created_at', 'desc')
         .offset((page - 1) * 10)
         .limit(10);
      
      return response.inertia("home", { 
         users, 
         total:   0,
         page,
         search,
         filter
      });
   }

   public async deleteUsers(request : Request, response: Response) {
      const { ids } = request.body;
      
      if (!Array.isArray(ids)) {
         return response.status(400).json({ error: 'Invalid request format' });
      }
      
      // Only allow admin to delete users
      if (!request.user.is_admin) {
         return response.status(403).json({ error: 'Unauthorized' });
      }
      
      await DB.from("users")
         .whereIn('id', ids)
         .delete();
      
      return response.redirect("/home");
   }

   public async profilePage(request : Request, response: Response) { 
      return response.inertia("profile");
   }

   public async changeProfile(request : Request, response: Response) {
      const data = await request.json();

      await DB.from("users").where("id", request.user.id).update({
         name: data.name,
         email: data.email.toLowerCase(),
         phone: data.phone,
      });

      return response.json({ message: "Your profile has been updated" });
   }

   public async changePassword(request : Request, response: Response) {
      const data = await request.json();

      const user = await DB.from("users")
         .where("id", request.user.id)
         .first();

      const password_match = await Authenticate.compare(
         data.current_password,
         user.password
      );

      if (password_match) {
         await DB.from("users")
            .where("id", request.user.id)
            .update({
               password: await Authenticate.hash(data.new_password),
            });
      } else {
         return response
            .status(400)
            .json({ message: "Password lama tidak cocok" });
      }
   }

   public async forgotPasswordPage(request : Request, response: Response) {
      return response.inertia("auth/forgot-password");
   }
   public async resetPasswordPage(request : Request, response: Response) {
      const id = request.params.id;

      const token = await DB.from("password_reset_tokens")
         .where("token", id)
         .where("expires_at", ">", new Date())
         .first();

      if (!token) {
         return response.status(404).send("Link tidak valid atau sudah kadaluarsa");
      }

      return response.inertia("auth/reset-password", { id: request.params.id });
   }

   public async resetPassword(request : Request, response: Response) {
      const { id, password } = await request.json();

      const token = await DB.from("password_reset_tokens")
         .where("token", id)
         .where("expires_at", ">", new Date())
         .first();

      if (!token) {
         return response.status(404).send("Link tidak valid atau sudah kadaluarsa");
      }

      const user = await DB.from("users")
         .where("email", token.email)
         .first();

      await DB.from("users")
         .where("id", user.id)
         .update({ password: await Authenticate.hash(password) });

      // Delete the used token
      await DB.from("password_reset_tokens")
         .where("token", id)
         .delete();

      return Authenticate.process(user, request, response);
   }

   public async sendResetPassword(request : Request, response: Response) {
      let { email, phone } = await request.json();
 
      let user;

      if (email && email.includes("@")) {
         user = await DB.from("users").where("email", email).first();
      } else if (phone) {
         user = await DB.from("users").where("phone", phone).first();
      }

      if (!user) {
         return response.status(404).send("Email tidak terdaftar");
      }

      const token = randomUUID();
      
      // Store token in database with 24-hour expiration
      await DB.from("password_reset_tokens").insert({
         email: user.email,
         token: token,
         expires_at: dayjs().add(24, 'hours').toDate()
      });

      try {
         await Mailer.sendMail({
            from: process.env.USER_MAILER,
            to: email,
            subject: "Reset Password",
            text: `You have requested a password reset. If this was you, please click the following link:
      
        ${process.env.APP_URL}/reset-password/${token}
        
        If you did not request a password reset, please ignore this email.
        
        This link will expire in 24 hours.
              `,
         });
      } catch (error) {}

      try {
         if (user.phone)
            await axios.post("https://api.dripsender.id/send", {
               api_key: "DRIPSENDER_API_KEY",
               phone: user.phone,
               text: `You have requested a password reset. If this was you, please click the following link:
      
${process.env.APP_URL}/reset-password/${token}
          
If you did not request a password reset, please ignore this message.

This link will expire in 24 hours.
                `,
            });
      } catch (error) {}

      return response.send("OK")
   }

   public async loginPage(request : Request, response: Response) {
      return response.inertia("auth/login");
   }

   public async redirect(request : Request, response) {
      const params = redirectParamsURL();

      const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

      return response.redirect(googleLoginUrl);
   }

   public async googleCallback(request : Request, response: Response) {
      const { code } = request.query;

      const { data } = await axios({
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

      const result = await axios({
         url: "https://www.googleapis.com/oauth2/v2/userinfo",
         method: "get",
         headers: {
            Authorization: `Bearer ${data.access_token}`,
         },
      });

      let { email, name, verified_email } = result.data;

      email = email.toLowerCase();

      const check = await DB.from("users").where("email", email).first();

      if (check) {
         //
         return Authenticate.process(check, request, response);
      } else {
         const user = {
            id: randomUUID(),
            email: email,
            password: await Authenticate.hash(email),
            name: name,
            is_verified: verified_email,
            created_at: dayjs().valueOf(),
            updated_at: dayjs().valueOf(),
         };

         await DB.table("users").insert(user);

         return Authenticate.process(user, request, response);
      }
   }

   public async processLogin(request : Request, response: Response) {
      let body = await request.json();

      let { email, password, phone } = body;

      let user;

      if (email && email.includes("@")) {
         user = await DB.from("users").where("email", email).first();
      } else if (phone) {
         user = await DB.from("users").where("phone", phone).first();
      }

      if (user) {
         const password_match = await Authenticate.compare(
            password,
            user.password
         );

         if (password_match) {
            return Authenticate.process(user, request, response);
         } else {
            return response
                .cookie("error", "Maaf, Password salah",3000) 
               .redirect("/login");
         }
      } else {
         return response 
            .cookie("error", "Email/No.HP tidak terdaftar",3000)
            .redirect("/login");
      }
   }

   public async processRegister(request : Request, response: Response) {
      let { email, password, name } = await request.json();

      email = email.toLowerCase();

      try {
         const user = {
            email: email,
            id: randomUUID(),
            name,
            password: await Authenticate.hash(password),
         };

         const id = await DB.table("users").insert(user);

         return Authenticate.process(user, request, response);
      } catch (error) {
         console.log(error);
         return response
            .cookie("error", "Maaf, Email sudah terdaftar",3000)
            .redirect("/register");
      }
   }

   public async verify(request : Request, response: Response) {
      const token = randomUUID();

      // Delete any existing verification tokens for this user
      await DB.from("email_verification_tokens")
         .where("user_id", request.user.id)
         .delete();

      // Create new verification token
      await DB.from("email_verification_tokens").insert({
         user_id: request.user.id,
         token: token,
         expires_at: dayjs().add(24, 'hours').toDate()
      });

      try {
         await Mailer.sendMail({
            from: process.env.USER_MAILER,
            to: request.user.email,
            subject: "Verifikasi Akun",
            text: `Klik link berikut untuk verifikasi email anda:
${process.env.APP_URL}/verify/${token}

Link ini akan kadaluarsa dalam 24 jam.`,
         });
      } catch (error) {
         console.log(error);
         return response.redirect("/home");
      }

      return response.redirect("/home");
   }

   public async verifyPage(request : Request, response: Response) {
      const { id } = request.params;

      const verificationToken = await DB.from("email_verification_tokens")
         .where({
            user_id: request.user.id,
            token: id
         })
         .where("expires_at", ">", new Date())
         .first();

      if (verificationToken) {
         await DB.from("users")
            .where("id", request.user.id)
            .update({ is_verified: true });

         // Delete the used token
         await DB.from("email_verification_tokens")
            .where("id", verificationToken.id)
            .delete();
      }

      return response.redirect("/home?verified=true");
   }

   public async logout(request : Request, response: Response) {
      if (request.cookies.auth_id) {
         await Authenticate.logout(request, response);
      }
   }
}

export default new AuthController();
