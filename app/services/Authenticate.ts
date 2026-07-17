/**
 * Authentication Service
 * Handles user authentication operations including password hashing,
 * session management, and login/logout functionality.
 *
 * Mirrors laju-go's app/services/auth.go pattern.
 * Sessions store user data as JSON — no users table query needed for auth.
 */

import { SessionStore } from "../session/store";
import type { SessionData } from "../session/session";
import type { Request, Response, User } from "../../type";
import { pbkdf2Sync, randomBytes } from "crypto";

// PBKDF2 configuration
const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = "sha512";
const SALT_SIZE = 16;

export const Authenticate = {
	/**
	 * Hash a password using PBKDF2
	 */
	async hash(password: string): Promise<string> {
		const salt = randomBytes(SALT_SIZE).toString("hex");
		const hash = pbkdf2Sync(
			password,
			salt,
			ITERATIONS,
			KEYLEN,
			DIGEST,
		).toString("hex");
		return `${salt}:${hash}`;
	},

	/**
	 * Compare a password with a stored hash
	 */
	async compare(password: string, storedHash: string): Promise<boolean> {
		const [salt, hash] = storedHash.split(":");
		const newHash = pbkdf2Sync(
			password,
			salt,
			ITERATIONS,
			KEYLEN,
			DIGEST,
		).toString("hex");
		return hash === newHash;
	},

	/**
	 * Process user login — create a session with user data as JSON.
	 * No additional query to users table needed after this.
	 */
	async process(
		user: User,
		_request: Request,
		response: Response,
		redirectPath: string = "/home",
	) {
		const sessionData: SessionData = {
			user_id: user.id,
			name: user.name || "",
			email: user.email,
			avatar: user.avatar || "",
			email_verified: user.is_verified === 1,
			role: user.is_admin ? "admin" : "user",
			is_admin: user.is_admin === 1,
		};

		SessionStore.create(response, sessionData);
		SessionStore.redirect(response, redirectPath);
	},

	/**
	 * Logout — destroy the session
	 */
	async logout(request: Request, response: Response) {
		SessionStore.destroy(request, response);
		SessionStore.redirect(response, "/login");
	},
};

export default Authenticate;
