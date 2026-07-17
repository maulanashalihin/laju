/**
 * Unit Tests for Session Store
 * Tests session creation, retrieval, destruction, and flash messages.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SessionStore } from "../../../app/session/store";
import { SessionRepository } from "../../../app/repositories/session.repository";
import type { SessionData } from "../../../app/session/session";

// Mock request helper that avoids type conflicts
function makeReq(cookies: Record<string, string> = {}) {
	return { cookies } as any;
}
function makeRes() {
	const store: Record<string, string> = {};
	return {
		cookie: (name: string, value: string, _maxAge?: number) => {
			store[name] = value;
		},
		getCookie: (name: string) => store[name],
		_cookies: store,
		status: () => ({ setHeader: () => ({ send: () => {} }) }),
		setHeader: () => {},
		send: () => {},
	} as any;
}

describe("SessionStore", () => {
	const testData: SessionData = {
		user_id: "test-user-id",
		name: "Test User",
		email: "test@example.com",
		avatar: "",
		email_verified: true,
		role: "user",
		is_admin: false,
	};

	let req: any;
	let res: any;

	beforeEach(() => {
		req = makeReq();
		res = makeRes();
	});

	afterEach(() => {
		if (res._cookies.auth_id) {
			try {
				SessionRepository.delete(res._cookies.auth_id);
			} catch (e) {
				console.error("cleanup error:", e);
			}
		}
	});

	describe("get()", () => {
		it("should return empty session data when no cookie", () => {
			const session = SessionStore.get(req);
			expect(session.user_id).toBe("");
			expect(session.email).toBe("");
		});

		it("should return session data for valid session", () => {
			const sessionId = SessionStore.create(res, testData);
			req.cookies = { auth_id: sessionId };

			const session = SessionStore.get(req);
			expect(session.user_id).toBe(testData.user_id);
			expect(session.name).toBe(testData.name);
			expect(session.email).toBe(testData.email);
		});

		it("should return empty data for invalid session ID", () => {
			req.cookies = { auth_id: "non-existent" };
			const session = SessionStore.get(req);
			expect(session.user_id).toBe("");
		});
	});

	describe("create()", () => {
		it("should create a new session and set cookie", () => {
			const sessionId = SessionStore.create(res, testData);

			expect(sessionId).toBeTruthy();
			expect(typeof sessionId).toBe("string");
			expect(res._cookies.auth_id).toBe(sessionId);

			const row = SessionRepository.findById(sessionId);
			expect(row).toBeDefined();
			expect(row?.user_id).toBe("test-user-id");
		});

		it("should store session data as JSON", () => {
			const sessionId = SessionStore.create(res, testData);
			const row = SessionRepository.findById(sessionId);

			expect(row).toBeDefined();
			expect(row).toBeDefined();
			const data = JSON.parse(row!.data || "{}") as SessionData;
			expect(data.email).toBe("test@example.com");
			expect(data.name).toBe("Test User");
		});
	});

	describe("save()", () => {
		it("should update session data", () => {
			const sessionId = SessionStore.create(res, testData);
			req.cookies = { auth_id: sessionId };

			const updated: SessionData = { ...testData, name: "Updated" };
			SessionStore.save(req, updated);

			const row = SessionRepository.findById(sessionId);
			expect(row).toBeDefined();
			expect(row).toBeDefined();
			const data = JSON.parse(row!.data || "{}") as SessionData;
			expect(data.name).toBe("Updated");
		});
	});

	describe("destroy()", () => {
		it("should delete session and clear cookie", () => {
			const sessionId = SessionStore.create(res, testData);
			req.cookies = { auth_id: sessionId };
			res._cookies.auth_id = sessionId;

			SessionStore.destroy(req, res);

			expect(SessionRepository.findById(sessionId)).toBeUndefined();
			expect(res._cookies.auth_id).toBe("");
		});
	});

	describe("flash() / getFlash()", () => {
		it("should set and retrieve flash messages", () => {
			SessionStore.flash(res, "error", "Test error");
			SessionStore.flash(res, "success", "Test success");

			req.cookies = { error: "Test error", success: "Test success" };

			const messages = SessionStore.getFlash(req);
			expect(messages.error).toBe("Test error");
			expect(messages.success).toBe("Test success");
		});

		it("should return empty object when no flash messages", () => {
			const messages = SessionStore.getFlash(req);
			expect(Object.keys(messages).length).toBe(0);
		});
	});

	describe("redirect()", () => {
		it("should send a 303 redirect", () => {
			let status = 0;
			let location = "";
			const mockRes = {
				status: (s: number) => {
					status = s;
					return mockRes;
				},
				setHeader: (_k: string, v: string) => {
					if (_k === "Location") location = v;
					return mockRes;
				},
				send: () => mockRes,
			} as any;

			SessionStore.redirect(mockRes, "/home");
			expect(status).toBe(303);
			expect(location).toBe("/home");
		});

		it("should not allow open redirect", () => {
			let location = "";
			const mockRes = {
				status: () => mockRes,
				setHeader: (_k: string, v: string) => {
					if (_k === "Location") location = v;
					return mockRes;
				},
				send: () => mockRes,
			} as any;

			SessionStore.redirect(mockRes, "https://evil.com");
			expect(location).toBe("/login");
		});
	});
});
