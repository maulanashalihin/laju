/**
 * Unit Tests for Repositories
 * Tests SessionRepository, PasswordResetRepository, UserRepository, AssetRepository.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SessionRepository } from "../../../app/repositories/session.repository";
import { PasswordResetRepository } from "../../../app/repositories/password-reset.repository";
import { UserRepository } from "../../../app/repositories/user.repository";
import { AssetRepository } from "../../../app/repositories/asset.repository";
import DB from "../../../app/services/DB";
import { randomUUID } from "crypto";

describe("Repositories", () => {
	let userId: string;

	// Clean up before and after
	beforeEach(async () => {
		userId = randomUUID();
	});

	afterEach(async () => {
		if (userId) {
			DB.run("DELETE FROM sessions WHERE user_id = ?", [userId]);
			DB.run("DELETE FROM users WHERE id = ?", [userId]);
		}
	});

	describe("SessionRepository", () => {
		const sessionId = `test-session-${Date.now()}`;

		afterEach(() => {
			SessionRepository.delete(sessionId);
		});

		it("should create and find a session", () => {
			SessionRepository.create(
				sessionId,
				"user-1",
				'{"role":"user"}',
				null,
				null,
			);

			const row = SessionRepository.findById(sessionId);
			expect(row).toBeDefined();
			expect(row?.user_id).toBe("user-1");
			expect(row?.data).toBe('{"role":"user"}');
		});

		it("should update session data", () => {
			SessionRepository.create(sessionId, "user-1", "{}", null, null);
			SessionRepository.update(sessionId, '{"role":"admin"}', null);

			const row = SessionRepository.findById(sessionId);
			expect(row?.data).toBe('{"role":"admin"}');
		});

		it("should find sessions by user ID", () => {
			SessionRepository.create(sessionId, "user-1", "{}", null, null);
			const sessions = SessionRepository.findByUserId("user-1");
			expect(sessions.length).toBeGreaterThanOrEqual(1);
		});

		it("should delete a session", () => {
			SessionRepository.create(sessionId, "user-1", "{}", null, null);
			SessionRepository.delete(sessionId);
			expect(SessionRepository.findById(sessionId)).toBeUndefined();
		});
	});

	describe("PasswordResetRepository", () => {
		const token = randomUUID();

		afterEach(() => {
			PasswordResetRepository.delete(token);
		});

		it("should create and find a valid token", () => {
			PasswordResetRepository.create(
				"test@example.com",
				token,
				new Date(Date.now() + 3600000).toISOString(),
			);

			const row = PasswordResetRepository.findByToken(token);
			expect(row).toBeDefined();
			expect(row?.email).toBe("test@example.com");
		});

		it("should return undefined for expired token", () => {
			PasswordResetRepository.create(
				"test@example.com",
				token,
				new Date(Date.now() - 1000).toISOString(),
			);

			const row = PasswordResetRepository.findByToken(token);
			expect(row).toBeUndefined();
		});

		it("should delete a token", () => {
			PasswordResetRepository.create(
				"test@example.com",
				token,
				new Date(Date.now() + 3600000).toISOString(),
			);
			PasswordResetRepository.delete(token);
			expect(PasswordResetRepository.findByToken(token)).toBeUndefined();
		});
	});

	describe("UserRepository", () => {
		it("should create a user", async () => {
			const user = await UserRepository.create({
				id: userId,
				email: "repo-test@example.com",
				password: "hashed-pwd",
				name: "Repo Test",
			});

			expect(user).toBeDefined();
			expect(user.email).toBe("repo-test@example.com");
			expect(user.name).toBe("Repo Test");
		});

		it("should find user by email", async () => {
			await UserRepository.create({
				id: userId,
				email: "find-by-email@example.com",
				password: "pwd",
				name: "Find Test",
			});

			const user = await UserRepository.findByEmail(
				"find-by-email@example.com",
			);
			expect(user).toBeDefined();
			expect(user?.name).toBe("Find Test");
		});

		it("should find user by id", async () => {
			await UserRepository.create({
				id: userId,
				email: "find-by-id@example.com",
				password: "pwd",
				name: "ID Test",
			});

			const user = await UserRepository.findById(userId);
			expect(user).toBeDefined();
			expect(user?.email).toBe("find-by-id@example.com");
		});

		it("should check email exists", async () => {
			await UserRepository.create({
				id: userId,
				email: "exists-test@example.com",
				password: "pwd",
				name: "Exists",
			});

			const exists = await UserRepository.emailExists(
				"exists-test@example.com",
			);
			expect(exists).toBe(true);

			const notExists = await UserRepository.emailExists(
				"not-exists@example.com",
			);
			expect(notExists).toBe(false);
		});

		it("should update user profile", async () => {
			await UserRepository.create({
				id: userId,
				email: "profile-update@example.com",
				password: "pwd",
				name: "Original",
			});

			await UserRepository.updateProfile(userId, { name: "Updated" });

			const user = await UserRepository.findById(userId);
			expect(user?.name).toBe("Updated");
		});

		it("should update password", async () => {
			await UserRepository.create({
				id: userId,
				email: "pwd-update@example.com",
				password: "old-pwd",
				name: "PWD",
			});

			await UserRepository.updatePassword(userId, "new-pwd");

			const user = await UserRepository.findById(userId);
			expect(user?.password).toBe("new-pwd");
		});

		it("should delete user", async () => {
			const id = randomUUID();
			await UserRepository.create({
				id,
				email: "delete-test@example.com",
				password: "pwd",
				name: "Delete",
			});

			await UserRepository.delete(id);
			const user = await UserRepository.findById(id);
			expect(user).toBeUndefined();
		});
	});

	describe("AssetRepository", () => {
		const assetId = randomUUID();

		afterEach(() => {
			AssetRepository.delete(assetId).catch(() => {});
		});

		it("should create and find an asset", async () => {
			await AssetRepository.create({
				id: assetId,
				name: "test.png",
				type: "image",
				url: "/storage/test.png",
				mime_type: "image/png",
				size: 1024,
				storage_key: null,
				user_id: null,
			});

			const asset = await AssetRepository.findById(assetId);
			expect(asset).toBeDefined();
			expect(asset?.name).toBe("test.png");
			expect(asset?.type).toBe("image");
		});

		it("should find assets by type", async () => {
			await AssetRepository.create({
				id: assetId,
				name: "test.png",
				type: "image",
				url: "/storage/test.png",
				mime_type: "image/png",
				size: 1024,
				storage_key: null,
				user_id: null,
			});

			const assets = await AssetRepository.findByType("image");
			expect(assets.length).toBeGreaterThanOrEqual(1);
		});

		it("should update an asset", async () => {
			await AssetRepository.create({
				id: assetId,
				name: "original.png",
				type: "image",
				url: "/storage/original.png",
				mime_type: "image/png",
				size: 1024,
				storage_key: null,
				user_id: null,
			});

			await AssetRepository.update(assetId, { name: "updated.png" });

			const asset = await AssetRepository.findById(assetId);
			expect(asset?.name).toBe("updated.png");
		});

		it("should delete an asset", async () => {
			const id = randomUUID();
			await AssetRepository.create({
				id,
				name: "delete.png",
				type: "image",
				url: "/storage/delete.png",
				mime_type: "image/png",
				size: 100,
				storage_key: null,
				user_id: null,
			});

			await AssetRepository.delete(id);
			const asset = await AssetRepository.findById(id);
			expect(asset).toBeUndefined();
		});
	});
});
