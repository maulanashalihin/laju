/**
 * Profile Controller
 * Handles user profile management
 */

import { UserRepository } from "../repositories/UserRepository";
import Validator from "../services/Validator";
import { updateProfileSchema, deleteUsersSchema } from "../validators/ProfileValidator";
import { Response, Request } from "../../type";

export const ProfileController = {
  /**
   * Display profile page
   */
  async profilePage(request: Request, response: Response) {
    return response.inertia("profile", { user: request.user });
  },

  /**
   * Update user profile
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
      return response.flash("error", firstError).redirect("/profile", 303);
    }

    const { name, email, phone, avatar } = validationResult.data!;

    await UserRepository.updateProfile(request.user.id, {
      name,
      email,
      phone: phone || null,
      avatar: avatar || null,
    });

    return response.flash("success", "Profile updated successfully").redirect("/profile", 303);
  },

  /**
   * Display home page
   */
  async homePage(request: Request, response: Response) {
    return response.inertia("home");
  },

  /**
   * Delete multiple users (admin only)
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

    return response.redirect("/home");
  },
};

export default ProfileController;
