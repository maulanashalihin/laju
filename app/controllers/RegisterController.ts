/**
 * Register Controller
 * Handles user registration
 */

import { UserRepository } from "../repositories/UserRepository";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import { registerSchema } from "../validators/AuthValidator";
import { Response, Request } from "../../type";
import { randomUUID } from "crypto";

class RegisterController {
  /**
   * Display registration page
   */
  public async registerPage(request: Request, response: Response) {
    if (request.cookies.auth_id) {
      return response.redirect("/home");
    }
    return response.inertia("auth/register");
  }

  /**
   * Process registration form submission
   */
  public async processRegister(request: Request, response: Response) {
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
  }
}

export default new RegisterController();
