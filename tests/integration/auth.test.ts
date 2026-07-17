/**
 * Integration Tests for Authentication Flow
 * Testing complete auth workflows using repositories and raw SQL.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import DB from "../../app/services/DB";
import { UserRepository } from "../../app/repositories/user.repository";
import { PasswordResetRepository } from "../../app/repositories/password-reset.repository";
import { SessionRepository } from "../../app/repositories/session.repository";
import Authenticate from "../../app/services/Authenticate";
import { randomUUID } from "crypto";

describe("Authentication Integration Tests", () => {
	const testUser = {
		name: "Integration Test User",
		email: "integration@test.com",
		password: "SecurePassword123",
		phone: "08123456789",
	};

	let userId: string;

	beforeEach(async () => {
		// Clean up test user using raw SQL (not kysely)
		const existing = DB.get<{ id: string }>(
			"SELECT id FROM users WHERE email = ?",
			[testUser.email],
		);
		if (existing) {
			DB.run("DELETE FROM sessions WHERE user_id = ?", [existing.id]);
			DB.run("DELETE FROM users WHERE id = ?", [existing.id]);
		}
		userId = "";
	});

	afterEach(async () => {
		// Clean up after tests
		if (userId) {
			DB.run("DELETE FROM sessions WHERE user_id = ?", [userId]);
			DB.run("DELETE FROM users WHERE id = ?", [userId]);
		}
	});

	describe("User Registration Flow", () => {
		it("should register a new user successfully", async () => {
			const hashedPassword = await Authenticate.hash(testUser.password);
			const id = randomUUID();

			DB.run(
				`INSERT INTO users (id, name, email, password, phone, is_verified, is_admin,
          membership_date, remember_me_token, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, 0, NULL, NULL, ?, ?)`,
				[
					id,
					testUser.name,
					testUser.email.toLowerCase(),
					hashedPassword,
					testUser.phone,
					Date.now(),
					Date.now(),
				],
			);
			userId = id;

			const user = DB.get<{
				id: string;
				email: string;
				name: string;
				password: string;
			}>("SELECT * FROM users WHERE id = ?", [id]);

			expect(user).toBeDefined();
			expect(user!.email).toBe(testUser.email.toLowerCase());
			expect(user!.name).toBe(testUser.name);
			expect(user!.password).not.toBe(testUser.password); // Should be hashed
		});

		it("should prevent duplicate email registration", async () => {
			const hashedPassword = await Authenticate.hash(testUser.password);
			const id = randomUUID();

			DB.run(
				"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[
					id,
					testUser.name,
					testUser.email,
					hashedPassword,
					Date.now(),
					Date.now(),
				],
			);
			userId = id;

			// Try duplicate registration
			expect(() => {
				DB.run(
					"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
					[
						randomUUID(),
						"Another User",
						testUser.email,
						hashedPassword,
						Date.now(),
						Date.now(),
					],
				);
			}).toThrow();
		});

		it("should normalize email to lowercase", async () => {
			const hashedPassword = await Authenticate.hash(testUser.password);
			const mixedCaseEmail = "Test@Example.COM";
			const id = randomUUID();

			DB.run(
				"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[
					id,
					testUser.name,
					mixedCaseEmail.toLowerCase(),
					hashedPassword,
					Date.now(),
					Date.now(),
				],
			);
			userId = id;

			const user = DB.get<{ email: string }>(
				"SELECT * FROM users WHERE id = ?",
				[id],
			);
			expect(user?.email).toBe(mixedCaseEmail.toLowerCase());
		});
	});

	describe("User Login Flow", () => {
		beforeEach(async () => {
			const hashedPassword = await Authenticate.hash(testUser.password);
			const id = randomUUID();
			DB.run(
				"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[
					id,
					testUser.name,
					testUser.email,
					hashedPassword,
					Date.now(),
					Date.now(),
				],
			);
			userId = id;
		});

		it("should login with correct credentials", async () => {
			const user = DB.get<{ id: string; email: string; password: string }>(
				"SELECT * FROM users WHERE email = ?",
				[testUser.email],
			);
			expect(user).toBeDefined();

			const isValid = await Authenticate.compare(
				testUser.password,
				user!.password,
			);
			expect(isValid).toBe(true);

			// Create session via repository
			const sessionId = `session_${Date.now()}`;
			SessionRepository.create(sessionId, user!.id, "{}", null, null);

			// Verify session exists
			const session = SessionRepository.findById(sessionId);
			expect(session).toBeDefined();
			expect(session?.user_id).toBe(user!.id);

			// Cleanup session
			SessionRepository.delete(sessionId);
		});

		it("should reject incorrect password", async () => {
			const user = DB.get<{ password: string }>(
				"SELECT * FROM users WHERE email = ?",
				[testUser.email],
			);
			const isValid = await Authenticate.compare(
				"WrongPassword123",
				user!.password,
			);
			expect(isValid).toBe(false);
		});

		it("should reject non-existent email", async () => {
			const user = DB.get<{ id: string }>(
				"SELECT * FROM users WHERE email = ?",
				["nonexistent@test.com"],
			);
			expect(user).toBeUndefined();
		});

		it("should support login by phone", async () => {
			DB.run("UPDATE users SET phone = ? WHERE id = ?", [
				testUser.phone,
				userId,
			]);

			const user = DB.get<{ id: string }>(
				"SELECT * FROM users WHERE phone = ?",
				[testUser.phone],
			);
			expect(user).toBeDefined();
			expect(user?.id).toBe(userId);
		});
	});

	describe("Session Management", () => {
		let sessionId: string;

		beforeEach(async () => {
			const hashedPassword = await Authenticate.hash(testUser.password);
			const id = randomUUID();
			DB.run(
				"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[
					id,
					testUser.name,
					testUser.email,
					hashedPassword,
					Date.now(),
					Date.now(),
				],
			);
			userId = id;

			sessionId = `session_${Date.now()}`;
			SessionRepository.create(sessionId, userId, "{}", null, null);
		});

		afterEach(async () => {
			if (sessionId) {
				SessionRepository.delete(sessionId);
			}
		});

		it("should retrieve user from session", async () => {
			// Get user_id from session
			const session = SessionRepository.findById(sessionId);
			expect(session).toBeDefined();
			expect(session?.user_id).toBe(userId);

			// Then find user
			const user = DB.get<{ id: string; email: string }>(
				"SELECT id, email FROM users WHERE id = ?",
				[session!.user_id],
			);
			expect(user).toBeDefined();
			expect(user?.id).toBe(userId);
		});

		it("should logout by deleting session", async () => {
			SessionRepository.delete(sessionId);

			const session = SessionRepository.findById(sessionId);
			expect(session).toBeUndefined();

			sessionId = ""; // Prevent double cleanup
		});

		it("should handle multiple sessions per user", async () => {
			const session2Id = `session2_${Date.now()}`;
			SessionRepository.create(session2Id, userId, "{}", null, null);

			const sessions = SessionRepository.findByUserId(userId);
			expect(sessions.length).toBeGreaterThanOrEqual(2);

			SessionRepository.delete(session2Id);
		});
	});

	describe("Password Reset Flow", () => {
		beforeEach(async () => {
			const hashedPassword = await Authenticate.hash(testUser.password);
			const id = randomUUID();
			DB.run(
				"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[
					id,
					testUser.name,
					testUser.email,
					hashedPassword,
					Date.now(),
					Date.now(),
				],
			);
			userId = id;
		});

		it("should create password reset token", async () => {
			const token = randomUUID();
			const user = DB.get<{ email: string }>(
				"SELECT * FROM users WHERE id = ?",
				[userId],
			);
			const expiresAt = new Date(
				Date.now() + 24 * 60 * 60 * 1000,
			).toISOString();

			PasswordResetRepository.create(user!.email, token, expiresAt);

			const resetToken = PasswordResetRepository.findByToken(token);
			expect(resetToken).toBeDefined();
			expect(resetToken?.email).toBe(user?.email);

			PasswordResetRepository.delete(token);
		});

		it("should reset password with valid token", async () => {
			const token = randomUUID();
			const user = DB.get<{ email: string }>(
				"SELECT * FROM users WHERE id = ?",
				[userId],
			);
			const expiresAt = new Date(
				Date.now() + 24 * 60 * 60 * 1000,
			).toISOString();

			PasswordResetRepository.create(user!.email, token, expiresAt);

			const resetToken = PasswordResetRepository.findByToken(token);
			expect(resetToken).toBeDefined();

			const newPassword = "NewSecurePassword456";
			const hashedNewPassword = await Authenticate.hash(newPassword);

			await UserRepository.updatePassword(userId, hashedNewPassword);
			PasswordResetRepository.delete(token);

			const updatedUser = DB.get<{ password: string }>(
				"SELECT * FROM users WHERE id = ?",
				[userId],
			);
			const isValid = await Authenticate.compare(
				newPassword,
				updatedUser!.password,
			);
			expect(isValid).toBe(true);
		});

		it("should reject expired token", async () => {
			const token = randomUUID();
			const user = DB.get<{ email: string }>(
				"SELECT * FROM users WHERE id = ?",
				[userId],
			);
			const expiresAt = new Date(Date.now() - 1000).toISOString(); // Already expired

			PasswordResetRepository.create(user!.email, token, expiresAt);

			const resetToken = PasswordResetRepository.findByToken(token);
			expect(resetToken).toBeUndefined();

			PasswordResetRepository.delete(token);
		});
	});
});
