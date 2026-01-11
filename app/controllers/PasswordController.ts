import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import { MailTo } from "../services/Resend";
import { Response, Request } from "../../type";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import axios from "axios";

class PasswordController {
   public async forgotPasswordPage(request: Request, response: Response) {
      return response.inertia("auth/forgot-password");
   }

   public async resetPasswordPage(request: Request, response: Response) {
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

   public async resetPassword(request: Request, response: Response) {
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

      await DB.from("password_reset_tokens")
         .where("token", id)
         .delete();

      return Authenticate.process(user, request, response);
   }

   public async sendResetPassword(request: Request, response: Response) {
      const { email, phone } = await request.json();

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

      await DB.from("password_reset_tokens").insert({
         email: user.email,
         token: token,
         expires_at: dayjs().add(24, "hours").toDate(),
      });

      try {
         await MailTo({
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
               api_key: process.env.DRIPSENDER_API_KEY,
               phone: user.phone,
               text: `You have requested a password reset. If this was you, please click the following link:
      
${process.env.APP_URL}/reset-password/${token}
          
If you did not request a password reset, please ignore this message.

This link will expire in 24 hours.
                `,
            });
      } catch (error) {}

      return response.send("OK");
   }

   public async changePassword(request: Request, response: Response) {
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
         return response.json({ message: "Password berhasil diubah" });
      } else {
         return response
            .status(400)
            .json({ message: "Password lama tidak cocok" });
      }
   }
}

export default new PasswordController();
