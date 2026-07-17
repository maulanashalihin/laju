/**
 * App Handler
 * Handles application pages (dashboard, profile, user management)
 */

import { UserRepository } from "../repositories/user.repository";
import Validator from "../services/Validator";
import {
	updateProfileSchema,
	deleteUsersSchema,
} from "../validators/profile.validator";
import type { Response, Request } from "../../type";
import inertia from "../services/inertia";

export const AppHandler = {
	/**
	 * Display home page (user dashboard)
	 * GET /home
	 */
	async homePage(request: Request, response: Response) {
		return inertia.render(request, response, "home");
	},

	/**
	 * Display profile page
	 * GET /profile
	 */
	async profilePage(request: Request, response: Response) {
		return inertia.render(request, response, "profile", { user: request.user });
	},

	/**
	 * Update user profile
	 * POST /change-profile
	 */
	async changeProfile(request: Request, response: Response) {
		if (!request.user) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const body = await request.json();
		const validationResult = Validator.validate(updateProfileSchema, body);

		if (!validationResult.success) {
			const errors = validationResult.errors || {};
			const firstError = Object.values(errors)[0]?.[0] || "Validation error";
			inertia.flash(response, "error", firstError);
			return inertia.redirect(response, "/profile");
		}

		const { name, email, phone, avatar } = validationResult.data!;

		await UserRepository.updateProfile(request.user.id, {
			name,
			email,
			phone: phone || null,
			avatar: avatar || null,
		});

		inertia.flash(response, "success", "Profile updated successfully");
		return inertia.redirect(response, "/profile");
	},

	/**
	 * Delete multiple users (admin only)
	 * DELETE /users
	 */
	async deleteUsers(request: Request, response: Response) {
		if (!request.user) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const body = await request.json();
		const validationResult = Validator.validate(deleteUsersSchema, body);

		if (!validationResult.success) {
			return response.status(422).json({
				success: false,
				message: "Validation failed",
				errors: validationResult.errors,
			});
		}

		if (!request.user.is_admin) {
			return response.status(403).json({ error: "Forbidden" });
		}

		const { ids } = validationResult.data!;
		await UserRepository.deleteMany(ids);

		return inertia.redirect(response, "/home");
	},
};

export default AppHandler;
