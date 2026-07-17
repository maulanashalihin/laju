/**
 * Auth Handler
 * Handles authentication-related HTTP requests (login, register, logout, OAuth, password reset)
 *
 * Follows Handler → Service → Repository rule.
 * NO direct DB calls from handlers.
 */

import { UserRepository } from "../repositories/user.repository";
import { PasswordResetRepository } from "../repositories/password-reset.repository";
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
import { redirectParamsURL } from "../services/GoogleAuth";
import inertia from "../services/inertia";
import type { Response, Request, User } from "../../type";
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
			response.redirect("/home"); // native HyperExpress = 302
			return;
		}
		return inertia.render(request, response, "auth/login");
	},

	/**
	 * Process login form submission
	 * POST /login
	 */
	async processLogin(request: Request, response: Response) {
		try {
			const body = await request.json();

			const validationResult = Validator.validate(loginSchema, body);
			if (!validationResult.success) {
				const errors = validationResult.errors || {};
				const firstError = Object.values(errors)[0]?.[0] || "Validation error";
				inertia.flash(response, "error", firstError);
				return inertia.redirect(response, "/login");
			}

			const { email, password, phone } = validationResult.data!;

			let user: User | undefined;
			if (email && email.includes("@")) {
				user = await UserRepository.findByEmail(email.toLowerCase());
			} else if (phone) {
				user = await UserRepository.findByPhone(phone);
			}

			if (!user) {
				inertia.flash(response, "error", "Email/Phone not registered");
				return inertia.redirect(response, "/login");
			}

			const passwordMatch = await Authenticate.compare(password, user.password);
			if (!passwordMatch) {
				inertia.flash(response, "error", "Incorrect password");
				return inertia.redirect(response, "/login");
			}

			return Authenticate.process(user, request, response);
		} catch (error) {
			console.error("Login error:", error);
			inertia.flash(
				response,
				"error",
				"An error occurred during login. Please try again later.",
			);
			return inertia.redirect(response, "/login");
		}
	},

	/**
	 * Display registration page
	 * GET /register
	 */
	async registerPage(request: Request, response: Response) {
		if (request.cookies.auth_id) {
			response.redirect("/home"); // native HyperExpress = 302
			return;
		}
		return inertia.render(request, response, "auth/register");
	},

	/**
	 * Process registration form submission
	 * POST /register
	 */
	async processRegister(request: Request, response: Response) {
		try {
			const body = await request.json();

			const validationResult = Validator.validate(registerSchema, body);
			if (!validationResult.success) {
				const errors = validationResult.errors || {};
				const firstError = Object.values(errors)[0]?.[0] || "Validation error";
				inertia.flash(response, "error", firstError);
				return inertia.redirect(response, "/register");
			}

			const { email, password, name } = validationResult.data!;

			const existingUser = await UserRepository.emailExists(email);
			if (existingUser) {
				inertia.flash(
					response,
					"error",
					"Email already registered. Please use another email or login.",
				);
				return inertia.redirect(response, "/register");
			}

			const user = await UserRepository.create({
				id: randomUUID(),
				email: email.toLowerCase(),
				password: await Authenticate.hash(password),
				name,
			});

			return Authenticate.process(user, request, response);
		} catch (error: any) {
			console.error("Registration error:", error);

			if (error.code === "SQLITE_CONSTRAINT") {
				inertia.flash(
					response,
					"error",
					"Email already registered. Please use another email or login.",
				);
				return inertia.redirect(response, "/register");
			}

			inertia.flash(
				response,
				"error",
				"An error occurred during registration. Please try again later.",
			);
			return inertia.redirect(response, "/register");
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
	async googleRedirect(_request: Request, response: Response) {
		const params = redirectParamsURL();
		const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
		// External redirect → full page navigation via 302
		response.status(302).setHeader("Location", googleLoginUrl).send();
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

		let user = await UserRepository.findByEmail(email);

		if (user) {
			return Authenticate.process(user, request, response);
		} else {
			const userData: import("../../app/repositories/user.repository").CreateUserData =
				{
					id: randomUUID(),
					email: email,
					password: await Authenticate.hash(email),
					name: name || null,
					phone: null,
					avatar: null,
					is_verified: verified_email ? 1 : 0,
					is_admin: 0,
				};

			user = await UserRepository.create(userData);
			return Authenticate.process(user, request, response);
		}
	},

	/**
	 * Display forgot password page
	 * GET /forgot-password
	 */
	async forgotPasswordPage(request: Request, response: Response) {
		return inertia.render(request, response, "auth/forgot-password");
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
			inertia.flash(response, "error", firstError);
			return inertia.redirect(response, "/forgot-password");
		}

		const { email, phone } = validationResult.data!;

		let user: User | undefined;

		if (email && email.includes("@")) {
			user = await UserRepository.findByEmail(email);
		} else if (phone) {
			user = await UserRepository.findByPhone(phone);
		}

		if (!user) {
			inertia.flash(response, "error", "Email or phone not registered");
			return inertia.redirect(response, "/forgot-password");
		}

		const token = randomUUID();

		PasswordResetRepository.create(
			user.email,
			token,
			dayjs().add(24, "hours").toISOString(),
		);

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
		} catch (error) {
			console.error("Email send error:", error);
		}

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
		} catch (error) {
			console.error("SMS send error:", error);
		}

		inertia.flash(response, "success", "Password reset link has been sent");
		return inertia.redirect(response, "/forgot-password");
	},

	/**
	 * Display reset password page
	 * GET /reset-password/:id
	 */
	async resetPasswordPage(request: Request, response: Response) {
		const id = request.params.id;

		const token = PasswordResetRepository.findByToken(id);

		if (!token) {
			return response
				.status(404)
				.send("Link tidak valid atau sudah kadaluarsa");
		}

		return inertia.render(request, response, "auth/reset-password", {
			id: request.params.id,
		});
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

		const token = PasswordResetRepository.findByToken(id);

		if (!token) {
			return response
				.status(404)
				.send("Link tidak valid atau sudah kadaluarsa");
		}

		const user = await UserRepository.findByEmail(token.email);

		if (!user) {
			return response.status(404).send("User tidak ditemukan");
		}

		await UserRepository.updatePassword(
			user.id,
			await Authenticate.hash(password),
		);
		PasswordResetRepository.delete(token.token);

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

		const user = await UserRepository.findById(request.user.id);

		if (!user) {
			return response.status(404).json({ error: "User not found" });
		}

		const passwordMatch = await Authenticate.compare(
			validated.current_password,
			user.password,
		);

		if (passwordMatch) {
			await UserRepository.updatePassword(
				user.id,
				await Authenticate.hash(validated.new_password),
			);

			return response.json({ message: "Password berhasil diubah" });
		} else {
			return response
				.status(400)
				.json({ message: "Password lama tidak cocok" });
		}
	},
};

export default AuthHandler;
