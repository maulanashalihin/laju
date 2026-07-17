/**
 * Session Store
 *
 * Manages HTTP sessions with database persistence.
 * User data is stored as JSON in the sessions.data column.
 * This enables session-based auth WITHOUT querying the users table.
 *
 * Mirrors laju-go's app/session/session.go architecture.
 */

import { randomUUID } from "crypto";
import type { Request, Response } from "../../type";
import SessionRepository from "../repositories/session.repository";
import type { SessionData } from "./session";
import { emptySessionData } from "./session";

// ---------------------------------------------------------------------------
// In-memory session cache
// ---------------------------------------------------------------------------

interface CacheEntry {
	data: SessionData;
	expiresAt: number;
}

const sessionCache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL
const SESSION_TTL_MS = 60 * 24 * 60 * 60 * 1000; // 60 days session TTL
const SESSION_COOKIE = "auth_id";

// ---------------------------------------------------------------------------
// Cookie helpers (HyperExpress cookie API)
// ---------------------------------------------------------------------------

function setCookie(
	res: Response,
	name: string,
	value: string,
	maxAgeMs: number,
): void {
	// HyperExpress: cookie(name, value, maxAge)
	(res as any).cookie(name, value, maxAgeMs);
}

function clearCookie(res: Response, name: string): void {
	(res as any).cookie(name, "", 0);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const SessionStore = {
	/**
	 * Get a session from the request.
	 * Returns the session data, or empty data if no valid session exists.
	 */
	get(req: Request): SessionData {
		const sessionId = req.cookies?.[SESSION_COOKIE];
		if (!sessionId) {
			return emptySessionData();
		}

		// 1. Try in-memory cache first
		const cached = sessionCache.get(sessionId);
		if (cached && cached.expiresAt > Date.now()) {
			return { ...cached.data };
		}
		if (cached) {
			sessionCache.delete(sessionId); // expired cache
		}

		// 2. Try database
		try {
			const row = SessionRepository.findById(sessionId);
			if (!row) {
				return emptySessionData();
			}

			// Check expiry
			if (row.expires_at && new Date(row.expires_at) < new Date()) {
				SessionRepository.delete(sessionId);
				return emptySessionData();
			}

			// Parse data JSON
			const data = JSON.parse(row.data || "{}") as SessionData;

			// Cache it
			sessionCache.set(sessionId, {
				data: { ...data },
				expiresAt: Date.now() + CACHE_TTL_MS,
			});

			return data;
		} catch {
			return emptySessionData();
		}
	},

	/**
	 * Create an authenticated session.
	 * Regenerates session ID to prevent fixation.
	 */
	create(res: Response, data: SessionData): string {
		const sessionId = randomUUID();
		const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

		// Store in DB with data as JSON
		SessionRepository.create(
			sessionId,
			data.user_id,
			JSON.stringify(data),
			expiresAt,
			"", // user_agent can be added later
		);

		// Cache it
		sessionCache.set(sessionId, {
			data: { ...data },
			expiresAt: Date.now() + CACHE_TTL_MS,
		});

		// Set cookie
		setCookie(res, SESSION_COOKIE, sessionId, SESSION_TTL_MS);

		return sessionId;
	},

	/**
	 * Update the current session's data.
	 */
	save(req: Request, data: SessionData): void {
		const sessionId = req.cookies?.[SESSION_COOKIE];
		if (!sessionId) return;

		const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

		SessionRepository.update(sessionId, JSON.stringify(data), expiresAt);

		// Update cache
		sessionCache.set(sessionId, {
			data: { ...data },
			expiresAt: Date.now() + CACHE_TTL_MS,
		});
	},

	/**
	 * Destroy the session (logout).
	 */
	destroy(req: Request, res: Response): void {
		const sessionId = req.cookies?.[SESSION_COOKIE];

		if (sessionId) {
			SessionRepository.delete(sessionId);
			sessionCache.delete(sessionId);
		}

		clearCookie(res, SESSION_COOKIE);
	},

	/**
	 * Flash message support (short-lived cookie)
	 */
	flash(res: Response, key: string, message: string): void {
		setCookie(res, key, message, 5000); // 5 seconds
	},

	/**
	 * Get and clear a flash message
	 */
	getFlash(req: Request): Record<string, string> {
		const types = ["error", "success", "info", "warning"];
		const messages: Record<string, string> = {};
		const cookies = req.cookies || {};

		for (const type of types) {
			if (cookies[type]) {
				messages[type] = cookies[type];
			}
		}

		return messages;
	},

	/**
	 * Safe redirect to a relative URL.
	 * Only allows paths starting with "/" to prevent open redirect.
	 */
	redirect(res: Response, url: string): void {
		if (!url.startsWith("/")) {
			url = "/login";
		}
		res.status(303).setHeader("Location", url).send();
	},
};

export default SessionStore;
