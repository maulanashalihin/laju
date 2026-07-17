/**
 * Password Reset Token Repository
 */

import DB from "../services/DB";

export interface PasswordResetTokenRow {
	id: number;
	email: string;
	token: string;
	created_at: string;
	expires_at: string;
}

export const PasswordResetRepository = {
	/**
	 * Find a valid token
	 */
	findByToken(token: string): PasswordResetTokenRow | undefined {
		// Compare expires_at as ISO string — SQLite datetime('now') returns different format
		const now = new Date().toISOString();
		return DB.get<PasswordResetTokenRow>(
			"SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > ?",
			[token, now],
		);
	},

	/**
	 * Create a reset token
	 */
	create(email: string, token: string, expiresAt: string): void {
		DB.run(
			"INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)",
			[email, token, expiresAt],
		);
	},

	/**
	 * Delete a token
	 */
	delete(token: string): void {
		DB.run("DELETE FROM password_reset_tokens WHERE token = ?", [token]);
	},

	/**
	 * Delete expired tokens
	 */
	deleteExpired(): void {
		DB.run(
			"DELETE FROM password_reset_tokens WHERE expires_at < datetime('now')",
		);
	},
};

export default PasswordResetRepository;
