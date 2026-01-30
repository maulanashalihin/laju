/**
 * Kysely Migration Service
 * Handles database migrations using Kysely schema builder
 */

import { Kysely, Migrator as KyselyMigrator } from "kysely";
import * as fs from "fs/promises";
import * as path from "path";
import type { DB as DatabaseTypes } from "../../type/db-types";

/**
 * Custom migration provider that loads migrations from the migrations directory
 */
class CustomMigrationProvider {
  async getMigrations(): Promise<Record<string, { up: (db: Kysely<any>) => Promise<void>; down: (db: Kysely<any>) => Promise<void> }>> {
    const migrations: Record<string, { up: (db: Kysely<any>) => Promise<void>; down: (db: Kysely<any>) => Promise<void> }> = {};

    const migrationsDir = path.resolve(process.cwd(), "migrations");

    try {
      const files = await fs.readdir(migrationsDir);
      const tsFiles = files.filter((file) => file.endsWith(".ts") && !file.includes("Migrator"));

      for (const file of tsFiles.sort()) {
        const filePath = path.join(migrationsDir, file);
        const migrationName = file.replace(".ts", "");

        // Dynamic import for ES modules
        const module = await import(filePath);

        migrations[migrationName] = {
          up: module.up,
          down: module.down,
        };
      }
    } catch (error) {
      console.error("Error loading migrations:", error);
    }

    return migrations;
  }
}

/**
 * Migration Service
 */
class Migrator {
  private migrator: KyselyMigrator;

  constructor(db: Kysely<DatabaseTypes>) {
    this.migrator = new KyselyMigrator({
      db,
      provider: new CustomMigrationProvider(),
    });
  }

  /**
   * Run all pending migrations
   */
  async migrateToLatest(): Promise<{ success: boolean; error?: Error; results?: any[] }> {
    const { error, results } = await this.migrator.migrateToLatest();

    if (error) {
      console.error("Migration failed:", error);
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }

    if (results && results.length > 0) {
      console.log("Migrations executed:");
      results.forEach((result) => {
        if (result.status === "Success") {
          console.log(`  ✓ ${result.migrationName}`);
        } else if (result.status === "Error") {
          console.error(`  ✗ ${result.migrationName}: ${result.status}`);
        } else {
          console.log(`  • ${result.migrationName}: ${result.status}`);
        }
      });
    } else {
      console.log("No migrations to run. Database is up to date.");
    }

    return { success: true, results };
  }

  /**
   * Migrate down (undo migrations)
   */
  async migrateDown(steps: number = 1): Promise<{ success: boolean; error?: Error; results?: any[] }> {
    const { error, results } = await this.migrator.migrateDown();

    if (error) {
      console.error("Migration rollback failed:", error);
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }

    if (results) {
      console.log("Migrations rolled back:");
      results.forEach((result) => {
        console.log(`  ↓ ${result.migrationName}`);
      });
    }

    return { success: true, results };
  }

  /**
   * Migrate to specific migration (up or down)
   * @param targetMigration - Target migration name (e.g., "20230514062913_sessions")
   */
  async migrateTo(targetMigration: string): Promise<{ success: boolean; error?: Error; results?: any[] }> {
    const { error, results } = await this.migrator.migrateTo(targetMigration);

    if (error) {
      console.error("Migration failed:", error);
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }

    if (results) {
      console.log("Migrations executed:");
      results.forEach((result) => {
        const direction = result.direction === "Down" ? "↓" : "✓";
        console.log(`  ${direction} ${result.migrationName}`);
      });
    }

    return { success: true, results };
  }

  /**
   * Get migration status
   */
  async getMigrations(): Promise<{ migrations: any[]; error?: Error }> {
    const migrations = await this.migrator.getMigrations();

    return { migrations: Array.from(migrations) };
  }
}

export default Migrator;
export { CustomMigrationProvider };
