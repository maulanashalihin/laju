/**
 * Session type and data interfaces
 */

/**
 * Data stored in session as JSON payload
 */
export interface SessionData {
	user_id: string;
	name: string;
	email: string;
	avatar: string;
	email_verified: boolean;
	role: string;
	is_admin: boolean;
	csrf_token?: string;
	csrf_expiry?: number;
	ip?: string;
	user_agent?: string;
}

/**
 * Default/empty session data
 */
export function emptySessionData(): SessionData {
	return {
		user_id: "",
		name: "",
		email: "",
		avatar: "",
		email_verified: false,
		role: "user",
		is_admin: false,
	};
}
