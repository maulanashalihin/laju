import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import { forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../validators/AuthValidator";
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
      const body = await request.json();
      
      const validationResult = Validator.validate(resetPasswordSchema, body);
      
      if (!validationResult.success) {
         return response.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.errors,
         });
      }
      
      const { id, password } = validationResult.data!;

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
      const body = await request.json();
      
      const validationResult = Validator.validate(forgotPasswordSchema, body);
      
      if (!validationResult.success) {
         const errors = validationResult.errors || {};
         const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
         return response.flash("error", firstError).redirect("/forgot-password", 303);
      }
      
      const { email, phone } = validationResult.data!;

      let user;

      if (email && email.includes("@")) {
         user = await DB.from("users").where("email", email).first();
      } else if (phone) {
         user = await DB.from("users").where("phone", phone).first();
      }

      if (!user) {
         return response.flash("error", "Email or phone not registered").redirect("/forgot-password", 303);
      }

      const token = randomUUID();

      await DB.from("password_reset_tokens").insert({
         email: user.email,
         token: token,
         expires_at: dayjs().add(24, "hours").toDate(),
      });

      try {
         await MailTo({
            to: user.email,
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

      return response.flash("success", "Password reset link has been sent").redirect("/forgot-password", 303);
   }

   public async changePassword(request: Request, response: Response) {
      if (!request.user) {
         return response.status(401).json({ error: 'Unauthorized' });
      }

      const body = await request.json();

      const validationResult = Validator.validate(changePasswordSchema, body);
      
      if (!validationResult.success) {
         return response.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.errors,
         });
      }
      
      const validated = validationResult.data!;

      const user = await DB.from("users")
         .where("id", request.user.id)
         .first();

      const password_match = await Authenticate.compare(
         validated.current_password,
         user.password
      );

      if (password_match) {
         await DB.from("users")
            .where("id", request.user.id)
            .update({
               password: await Authenticate.hash(validated.new_password),
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
