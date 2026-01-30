/**
 * Login Controller
 * Handles user authentication and login/logout
 */

import { UserRepository } from "../repositories/UserRepository";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import { loginSchema } from "../validators/AuthValidator";
import { Response, Request } from "../../type";

class LoginController {
  /**
   * Display login page
   */
  public async loginPage(request: Request, response: Response) {
    if (request.cookies.auth_id) {
      return response.redirect("/home");
    }
    return response.inertia("auth/login");
  }

  /**
   * Process login form submission
   */
  public async processLogin(request: Request, response: Response) {
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
      let user;
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
  }

  /**
   * Handle logout
   */
  public async logout(request: Request, response: Response) {
    if (request.cookies.auth_id) {
      await Authenticate.logout(request, response);
    }
  }
}

export default new LoginController();
