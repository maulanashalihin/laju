/**
 * Unit Tests for DB Service (better-sqlite3)
 * Tests core database operations using raw SQL.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import DB from "../../../app/services/DB";
import { randomUUID } from "crypto";

describe("DB Service (better-sqlite3)", () => {
	let testUserId: string;

	beforeAll(() => {
		// Ensure users table exists
		DB.run(`CREATE TABLE IF NOT EXISTS test_users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )`);
	});

	afterAll(() => {
		DB.run("DROP TABLE IF EXISTS test_users");
	});

	describe("INSERT operations", () => {
		it("should insert a new record", () => {
			const id = randomUUID();
			const result = DB.run(
				"INSERT INTO test_users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[
					id,
					"Test User",
					"test@example.com",
					"hashed_pwd",
					Date.now(),
					Date.now(),
				],
			);
			expect(result.changes).toBe(1);
			expect(result.lastInsertRowid).toBeTruthy();
			testUserId = id;
		});

		it("should fail on duplicate unique constraint", () => {
			expect(() => {
				DB.run(
					"INSERT INTO test_users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
					[
						randomUUID(),
						"Another",
						"test@example.com",
						"pwd",
						Date.now(),
						Date.now(),
					],
				);
			}).toThrow();
		});
	});

	describe("SELECT operations", () => {
		it("should get a record by id", () => {
			const user = DB.get<{ id: string; name: string; email: string }>(
				"SELECT * FROM test_users WHERE id = ?",
				[testUserId],
			);
			expect(user).toBeDefined();
			expect(user?.name).toBe("Test User");
		});

		it("should get all records", () => {
			const users = DB.all<{ id: string }>("SELECT * FROM test_users");
			expect(users.length).toBeGreaterThanOrEqual(1);
		});

		it("should return undefined for non-existent record", () => {
			const user = DB.get("SELECT * FROM test_users WHERE id = ?", [
				"nonexistent",
			]);
			expect(user).toBeUndefined();
		});
	});

	describe("UPDATE operations", () => {
		it("should update a record", () => {
			const result = DB.run("UPDATE test_users SET name = ? WHERE id = ?", [
				"Updated Name",
				testUserId,
			]);
			expect(result.changes).toBe(1);

			const user = DB.get<{ name: string }>(
				"SELECT * FROM test_users WHERE id = ?",
				[testUserId],
			);
			expect(user?.name).toBe("Updated Name");
		});

		it("should return 0 changes for non-existent record", () => {
			const result = DB.run("UPDATE test_users SET name = ? WHERE id = ?", [
				"Test",
				"nonexistent",
			]);
			expect(result.changes).toBe(0);
		});
	});

	describe("DELETE operations", () => {
		it("should delete a record", () => {
			const id = randomUUID();
			DB.run(
				"INSERT INTO test_users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[id, "To Delete", "delete@test.com", "pwd", Date.now(), Date.now()],
			);

			const result = DB.run("DELETE FROM test_users WHERE id = ?", [id]);
			expect(result.changes).toBe(1);
		});

		it("should return 0 changes for non-existent record", () => {
			const result = DB.run("DELETE FROM test_users WHERE id = ?", [
				"nonexistent",
			]);
			expect(result.changes).toBe(0);
		});
	});

	describe("TRANSACTION operations", () => {
		it("should execute transaction successfully", () => {
			const id = randomUUID();
			const result = DB.transaction(() => {
				DB.run(
					"INSERT INTO test_users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
					[
						id,
						"Transaction User",
						"transact@test.com",
						"pwd",
						Date.now(),
						Date.now(),
					],
				);
				return "done";
			});
			expect(result).toBe("done");
		});
	});

	describe("Connection management", () => {
		it("should create a separate connection for a different stage", () => {
			const testDb = DB.getConnection("test");
			expect(testDb).toBeDefined();
			const result = testDb.get<{ val: number }>("SELECT 1 as val");
			expect(result?.val).toBe(1);
		});
	});
});
