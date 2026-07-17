/**
 * Auth Middleware
 *
 * Reads user data from session store — NO users table query.
 * Mirrors laju-go's app/middlewares/auth.go pattern.
 */

import { SessionStore } from "../session/store";
import type { Request, Response } from "../../type";

/**
 * AuthRequired — redirects unauthenticated users to /login.
 * Sets request.user from session data.
 */
export async function authRequired(req: Request, res: Response): Promise<void> {
	// Skip OPTIONS (CORS preflight)
	if (req.method === "OPTIONS") {
		return;
	}

	const session = SessionStore.get(req);

	if (!session.user_id) {
		// Redirect to login
		if (req.header("X-Inertia") === "true") {
			res.setHeader("X-Inertia-Location", "/login");
			res.status(409).send();
			return;
		}
		clearCookie(res, "auth_id");
		safeRedirect(res, "/login");
		return;
	}

	// Set user from session data (NO users table query!)
	req.user = {
		id: session.user_id,
		name: session.name || null,
		email: session.email,
		phone: null, // Not stored in session — query if needed
		avatar: session.avatar || null,
		is_admin: session.is_admin ? 1 : 0,
		is_verified: session.email_verified ? 1 : 0,
	};

	req.share = req.share || {};
	req.share.auth = {
		user: req.user,
	};
}

/**
 * Guest — redirects authenticated users to /home.
 */
export async function guest(req: Request, res: Response): Promise<void> {
	const session = SessionStore.get(req);

	if (session.user_id) {
		safeRedirect(res, "/home");
		return;
	}
}

/**
 * AdminRequired — checks admin role from session.
 */
export async function adminRequired(
	req: Request,
	res: Response,
): Promise<void> {
	const session = SessionStore.get(req);

	if (!session.user_id) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	if (!session.is_admin) {
		res.status(403).json({ error: "Admin access required" });
		return;
	}
}

/**
 * Safe redirect that validates the URL to prevent open redirect vulnerabilities.
 */
function safeRedirect(res: Response, url: string): void {
	// Only allow relative URLs (starting with /) to prevent open redirect
	if (!url.startsWith("/")) {
		url = "/login";
	}
	res.status(303).setHeader("Location", url).send();
}

function clearCookie(res: Response, name: string): void {
	(res as any).cookie(name, "", 0);
}

export default authRequired;
