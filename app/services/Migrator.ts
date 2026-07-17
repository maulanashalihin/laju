/**
 * Simple Migration Runner using better-sqlite3
 *
 * Reads migration files from the migrations/ directory, tracks applied
 * migrations in a `_migrations` table, and runs pending ones.
 */

import DB from "./DB";
import * as fs from "fs";
import * as path from "path";

export interface MigrationResult {
	name: string;
	success: boolean;
	error?: string;
}

/**
 * Run all pending migrations.
 * Seeds the `_migrations` table from `kysely_migration` on first run.
 */
export async function migrateToLatest(): Promise<MigrationResult[]> {
	ensureMigrationsTable();
	seedFromKyselyIfNeeded();

	const pending = getPendingMigrations();
	const results: MigrationResult[] = [];

	for (const name of pending) {
		try {
			const migrationPath = path.resolve(
				process.cwd(),
				"migrations",
				`${name}.ts`,
			);
			if (!fs.existsSync(migrationPath)) {
				results.push({
					name,
					success: false,
					error: `File not found: ${migrationPath}`,
				});
				continue;
			}

			// Dynamic import for ES module migration files
			const mod = await import(migrationPath);
			if (typeof mod.up !== "function") {
				results.push({
					name,
					success: false,
					error: "Migration missing up() export",
				});
				continue;
			}

			// Run migration inside a transaction
			DB.transaction(() => {
				mod.up(DB);
				markApplied(name);
			});

			results.push({ name, success: true });
			console.log(`  ✓ ${name}`);
		} catch (error: any) {
			console.error(`  ✗ ${name}: ${error.message}`);
			results.push({ name, success: false, error: error.message });
		}
	}

	if (results.length === 0) {
		console.log("  No pending migrations.");
	}

	return results;
}

/**
 * Rollback the last N migrations
 */
export async function migrateDown(
	steps: number = 1,
): Promise<MigrationResult[]> {
	ensureMigrationsTable();

	const applied = DB.all<{ name: string }>(
		"SELECT name FROM _migrations ORDER BY applied_at DESC LIMIT ?",
		[steps],
	);

	const results: MigrationResult[] = [];

	for (const row of applied) {
		try {
			const migrationPath = path.resolve(
				process.cwd(),
				"migrations",
				`${row.name}.ts`,
			);
			if (!fs.existsSync(migrationPath)) {
				results.push({
					name: row.name,
					success: false,
					error: `File not found: ${migrationPath}`,
				});
				continue;
			}

			const mod = await import(migrationPath);
			if (typeof mod.down !== "function") {
				results.push({
					name: row.name,
					success: false,
					error: "Migration missing down() export",
				});
				continue;
			}

			DB.transaction(() => {
				mod.down(DB);
				markUnapplied(row.name);
			});

			results.push({ name: row.name, success: true });
			console.log(`  ↓ ${row.name}`);
		} catch (error: any) {
			console.error(`  ✗ ${row.name}: ${error.message}`);
			results.push({ name: row.name, success: false, error: error.message });
		}
	}

	return results;
}

/**
 * Ensure the `_migrations` tracking table exists
 */
function ensureMigrationsTable(): void {
	DB.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

/**
 * Seed `_migrations` from `kysely_migration` if `_migrations` is empty
 * and `kysely_migration` table exists.
 */
function seedFromKyselyIfNeeded(): void {
	const count = DB.get<{ c: number }>("SELECT COUNT(*) as c FROM _migrations");
	if (count && count.c > 0) return;

	// Check if kysely_migration exists
	const kyselyTable = DB.get<{ name: string }>(
		"SELECT name FROM sqlite_master WHERE type='table' AND name='kysely_migration'",
	);
	if (!kyselyTable) return;

	const existingMigrations = DB.all<{ name: string; timestamp: string }>(
		"SELECT name, timestamp FROM kysely_migration ORDER BY name ASC",
	);

	for (const m of existingMigrations) {
		DB.run(
			"INSERT OR IGNORE INTO _migrations (name, applied_at) VALUES (?, ?)",
			[m.name, m.timestamp],
		);
	}

	console.log(
		`  Seeded ${existingMigrations.length} existing migrations from kysely_migration`,
	);
}

/**
 * Get list of pending migrations
 */
function getPendingMigrations(): string[] {
	const migrationsDir = path.resolve(process.cwd(), "migrations");
	if (!fs.existsSync(migrationsDir)) return [];

	const files = fs
		.readdirSync(migrationsDir)
		.filter((f) => f.endsWith(".ts") && !f.includes("Migrator"))
		.sort();

	const applied = new Set(
		DB.all<{ name: string }>("SELECT name FROM _migrations").map((r) => r.name),
	);

	return files
		.map((f) => f.replace(".ts", ""))
		.filter((name) => !applied.has(name));
}

/**
 * Mark a migration as applied
 */
function markApplied(name: string): void {
	DB.run("INSERT OR IGNORE INTO _migrations (name) VALUES (?)", [name]);
}

/**
 * Mark a migration as unapplied (for rollback)
 */
function markUnapplied(name: string): void {
	DB.run("DELETE FROM _migrations WHERE name = ?", [name]);
}

export default { migrateToLatest, migrateDown };
