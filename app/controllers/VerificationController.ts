import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import { MailTo } from "../services/Resend";
import { Response, Request } from "../../type";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

class VerificationController {
   public async verify(request: Request, response: Response) {
      if (!request.user) {
         return response.redirect("/login");
      }

      const token = randomUUID();

      await DB.from("email_verification_tokens")
         .where("user_id", request.user.id)
         .delete();

      await DB.from("email_verification_tokens").insert({
         user_id: request.user.id,
         token: token,
         expires_at: dayjs().add(24, "hours").toDate(),
      });

      try {
         await MailTo({
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

   public async verifyPage(request: Request, response: Response) {
      if (!request.user) {
         return response.redirect("/login");
      }

      const { id } = request.params;

      const verificationToken = await DB.from("email_verification_tokens")
         .where({
            user_id: request.user.id,
            token: id,
         })
         .where("expires_at", ">", new Date())
         .first();

      if (verificationToken) {
         await DB.from("users")
            .where("id", request.user.id)
            .update({ is_verified: true });

         await DB.from("email_verification_tokens")
            .where("id", verificationToken.id)
            .delete();

         await Authenticate.invalidateUserSessions(request.user.id);
      }

      return response.redirect("/home?verified=true");
   }
}

export default new VerificationController();
