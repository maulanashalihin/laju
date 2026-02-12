import DB from "../services/DB";
import Authenticate from "../services/Authenticate";
import { redirectParamsURL } from "../services/GoogleAuth";
import { Response, Request } from "../../type";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import axios from "axios";

export const OAuthController = {
  async redirect(request: Request, response: Response) {
    const params = redirectParamsURL();
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return response.redirect(googleLoginUrl);
  },

  async googleCallback(request: Request, response: Response) {
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

    const check = await DB.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();

    if (check) {
      return Authenticate.process(check, request, response);
    } else {
      const now = dayjs().valueOf();
      const user = {
        id: randomUUID(),
        email: email,
        password: await Authenticate.hash(email),
        name: name || null,
        phone: null,
        avatar: null,
        is_verified: verified_email ? 1 : 0,
        is_admin: 0,
        membership_date: null,
        remember_me_token: null,
        created_at: now,
        updated_at: now,
      };

      await DB.insertInto("users").values(user).execute();

      return Authenticate.process(user, request, response);
    }
  },
};

export default OAuthController;
