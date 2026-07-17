/**
 * Session Repository
 * Handles all database operations for sessions table.
 * Mirrors queries/session.sql in laju-go.
 */

import DB from "../services/DB";

export interface SessionRow {
	id: string;
	user_id: string;
	user_agent: string | null;
	expires_at: string | null;
	data: string;
	created_at: number | null;
	updated_at: number | null;
}

export const SessionRepository = {
	/**
	 * Find session by ID
	 */
	findById(id: string): SessionRow | undefined {
		return DB.get<SessionRow>(
			"SELECT id, user_id, user_agent, expires_at, data, created_at, updated_at FROM sessions WHERE id = ?",
			[id],
		);
	},

	/**
	 * Find sessions by user ID
	 */
	findByUserId(userId: string): SessionRow[] {
		return DB.all<SessionRow>(
			"SELECT id, user_id, user_agent, expires_at, data, created_at, updated_at FROM sessions WHERE user_id = ?",
			[userId],
		);
	},

	/**
	 * Create a new session
	 */
	create(
		id: string,
		userId: string,
		data: string,
		expiresAt: string | null,
		userAgent: string | null,
	): void {
		const now = Date.now();
		DB.run(
			"INSERT INTO sessions (id, user_id, data, expires_at, user_agent, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[id, userId, data, expiresAt, userAgent, now, now],
		);
	},

	/**
	 * Update session data and expiry
	 */
	update(id: string, data: string, expiresAt: string | null): void {
		DB.run(
			"UPDATE sessions SET data = ?, expires_at = ?, updated_at = ? WHERE id = ?",
			[data, expiresAt, Date.now(), id],
		);
	},

	/**
	 * Delete a session by ID
	 */
	delete(id: string): void {
		DB.run("DELETE FROM sessions WHERE id = ?", [id]);
	},

	/**
	 * Delete all sessions for a user
	 */
	deleteByUserId(userId: string): void {
		DB.run("DELETE FROM sessions WHERE user_id = ?", [userId]);
	},

	/**
	 * Delete expired sessions
	 */
	deleteExpired(): void {
		DB.run("DELETE FROM sessions WHERE expires_at < datetime('now')");
	},
};

export default SessionRepository;
