/**
 * Auth Handler
 * Handles authentication-related HTTP requests (login, register, logout, OAuth, password reset)
 */

import { UserRepository } from "../repositories/user.repository";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validators/auth.validator";
import { MailTo } from "../services/Resend";
import DB from "../services/DB";
import { redirectParamsURL } from "../services/GoogleAuth";
import { Response, Request, User } from "../../type";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import axios from "axios";

export const AuthHandler = {
  /**
   * Display login page
   * GET /login
   */
  async loginPage(request: Request, response: Response) {
    if (request.cookies.auth_id) {
      return response.redirect("/home");
    }
    return response.inertia("auth/login");
  },

  /**
   * Process login form submission
   * POST /login
   */
  async processLogin(request: Request, response: Response) {
    try {
      const body = await request.json();

      // Validate input
      const validationResult = Validator.validate(loginSchema, body);
      if (!validationResult.success) {
        const errors = validationResult.errors || {};
        const firstError = Object.values(errors)[0]?.[0] || "Validation error";
        return response.flash("error", firstError).redirect("/login");
      }

      const { email, password, phone } = validationResult.data!;

      // Find user by email or phone
      let user: User | undefined;
      if (email && email.includes("@")) {
        user = await UserRepository.findByEmail(email.toLowerCase());
      } else if (phone) {
        user = await UserRepository.findByPhone(phone);
      }

      // Check if user exists and password matches
      if (!user) {
        return response.flash("error", "Email/Phone not registered").redirect("/login");
      }

      const passwordMatch = await Authenticate.compare(password, user.password);
      if (!passwordMatch) {
        return response.flash("error", "Incorrect password").redirect("/login");
      }

      // Login successful
      return Authenticate.process(user, request, response);
    } catch (error) {
      console.error("Login error:", error);
      return response
        .flash("error", "An error occurred during login. Please try again later.")
        .redirect("/login");
    }
  },

  /**
   * Display registration page
   * GET /register
   */
  async registerPage(request: Request, response: Response) {
    if (request.cookies.auth_id) {
      return response.redirect("/home");
    }
    return response.inertia("auth/register");
  },

  /**
   * Process registration form submission
   * POST /register
   */
  async processRegister(request: Request, response: Response) {
    try {
      const body = await request.json();

      // Validate input
      const validationResult = Validator.validate(registerSchema, body);
      if (!validationResult.success) {
        const errors = validationResult.errors || {};
        const firstError = Object.values(errors)[0]?.[0] || "Validation error";
        return response.flash("error", firstError).redirect("/register");
      }

      const { email, password, name } = validationResult.data!;

      // Check if email already exists
      const existingUser = await UserRepository.emailExists(email);
      if (existingUser) {
        return response
          .flash("error", "Email already registered. Please use another email or login.")
          .redirect("/register");
      }

      // Create new user
      const user = await UserRepository.create({
        id: randomUUID(),
        email: email.toLowerCase(),
        password: await Authenticate.hash(password),
        name,
      });

      // Auto-login after registration
      return Authenticate.process(user, request, response);
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle duplicate email error
      if (error.code === "SQLITE_CONSTRAINT") {
        return response
          .flash("error", "Email already registered. Please use another email or login.")
          .redirect("/register");
      }

      return response
        .flash("error", "An error occurred during registration. Please try again later.")
        .redirect("/register");
    }
  },

  /**
   * Handle logout
   * POST /logout
   */
  async logout(request: Request, response: Response) {
    if (request.cookies.auth_id) {
      await Authenticate.logout(request, response);
    }
  },

  /**
   * Google OAuth redirect
   * GET /google/redirect
   */
  async googleRedirect(request: Request, response: Response) {
    const params = redirectParamsURL();
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return response.redirect(googleLoginUrl);
  },

  /**
   * Google OAuth callback
   * GET /google/callback
   */
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

  /**
   * Display forgot password page
   * GET /forgot-password
   */
  async forgotPasswordPage(request: Request, response: Response) {
    return response.inertia("auth/forgot-password");
  },

  /**
   * Send reset password link
   * POST /forgot-password
   */
  async sendResetPassword(request: Request, response: Response) {
    const body = await request.json();

    const validationResult = Validator.validate(forgotPasswordSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || "Validation error";
      return response.flash("error", firstError).redirect("/forgot-password", 303);
    }

    const { email, phone } = validationResult.data!;

    let user;

    if (email && email.includes("@")) {
      user = await DB.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
    } else if (phone) {
      user = await DB.selectFrom("users").selectAll().where("phone", "=", phone).executeTakeFirst();
    }

    if (!user) {
      return response.flash("error", "Email or phone not registered").redirect("/forgot-password", 303);
    }

    const token = randomUUID();

    await DB.insertInto("password_reset_tokens").values({
      email: user.email,
      token: token,
      expires_at: dayjs().add(24, "hours").toISOString(),
    }).execute();

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
  },

  /**
   * Display reset password page
   * GET /reset-password/:id
   */
  async resetPasswordPage(request: Request, response: Response) {
    const id = request.params.id;

    const token = await DB.selectFrom("password_reset_tokens")
      .selectAll()
      .where("token", "=", id)
      .where("expires_at", ">", dayjs().toISOString())
      .executeTakeFirst();

    if (!token) {
      return response.status(404).send("Link tidak valid atau sudah kadaluarsa");
    }

    return response.inertia("auth/reset-password", { id: request.params.id });
  },

  /**
   * Process password reset
   * POST /reset-password
   */
  async resetPassword(request: Request, response: Response) {
    const body = await request.json();

    const validationResult = Validator.validate(resetPasswordSchema, body);

    if (!validationResult.success) {
      return response.status(422).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.errors,
      });
    }

    const { id, password } = validationResult.data!;

    const token = await DB.selectFrom("password_reset_tokens")
      .selectAll()
      .where("token", "=", id)
      .where("expires_at", ">", dayjs().toISOString())
      .executeTakeFirst();

    if (!token) {
      return response.status(404).send("Link tidak valid atau sudah kadaluarsa");
    }

    const user = await DB.selectFrom("users").selectAll().where("email", "=", token.email).executeTakeFirst();

    if (!user) {
      return response.status(404).send("User tidak ditemukan");
    }

    await DB.updateTable("users")
      .set({
        password: await Authenticate.hash(password),
        updated_at: Date.now(),
      })
      .where("id", "=", user.id)
      .execute();

    await DB.deleteFrom("password_reset_tokens").where("token", "=", id).execute();

    return Authenticate.process(user, request, response);
  },

  /**
   * Change password (authenticated users)
   * POST /change-password
   */
  async changePassword(request: Request, response: Response) {
    if (!request.user) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const body = await request.json();

    const validationResult = Validator.validate(changePasswordSchema, body);

    if (!validationResult.success) {
      return response.status(422).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.errors,
      });
    }

    const validated = validationResult.data!;

    const user = await DB.selectFrom("users").selectAll().where("id", "=", request.user.id).executeTakeFirst();

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    const password_match = await Authenticate.compare(validated.current_password, user.password);

    if (password_match) {
      await DB.updateTable("users")
        .set({
          password: await Authenticate.hash(validated.new_password),
          updated_at: Date.now(),
        })
        .where("id", "=", request.user.id)
        .execute();

      return response.json({ message: "Password berhasil diubah" });
    } else {
      return response.status(400).json({ message: "Password lama tidak cocok" });
    }
  },
};

export default AuthHandler;
