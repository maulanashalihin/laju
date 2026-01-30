import DB from "../services/DB";
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

    await DB.deleteFrom("email_verification_tokens").where("user_id", "=", request.user.id).execute();

    await DB.insertInto("email_verification_tokens").values({
      user_id: request.user.id,
      token: token,
      expires_at: dayjs().add(24, "hours").toISOString(),
    }).execute();

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

    const verificationToken = await DB.selectFrom("email_verification_tokens")
      .selectAll()
      .where("user_id", "=", request.user.id)
      .where("token", "=", id)
      .where("expires_at", ">", dayjs().toISOString())
      .executeTakeFirst();

    if (verificationToken) {
      await DB.updateTable("users")
        .set({ is_verified: 1 })
        .where("id", "=", request.user.id)
        .execute();

      await DB.deleteFrom("email_verification_tokens").where("id", "=", verificationToken.id).execute();
    }

    return response.redirect("/home?verified=true");
  }
}

export default new VerificationController();
