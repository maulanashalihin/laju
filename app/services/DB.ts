/**
 * Database Service using Kysely
 * This service provides a configured database connection instance using Kysely query builder.
 * It supports multiple database connections based on different stages (development, production, etc.).
 */

import "dotenv/config";
import { Kysely, sql } from "kysely";
import { GenericSqliteDialect } from "kysely-generic-sqlite";
import type { IGenericSqlite } from "kysely-generic-sqlite";
import Database from "better-sqlite3";
import type { DB as DatabaseTypes } from "../../type/db-types";

// Database configuration
const dbConfig: Record<string, { filename: string }> = {
  development: {
    filename: "./data/dev.sqlite3",
  },
  production: {
    filename: "./data/production.sqlite3",
  },
  test: {
    filename: "./data/test.sqlite3",
  },
};

/**
 * Create SQLite executor for Kysely generic dialect
 */
function createSqliteExecutor(db: Database.Database): IGenericSqlite<Database.Database> {
  const getStmt = (sql: string) => db.prepare(sql);

  return {
    db,
    query: (_isSelect: boolean, sql: string, parameters?: unknown[] | readonly unknown[]) => {
      const stmt = getStmt(sql);
      const params = parameters ?? [];
      if (stmt.reader) {
        return { rows: stmt.all(params) as Record<string, unknown>[] };
      }
      const { changes, lastInsertRowid } = stmt.run(params);
      return {
        rows: [],
        numAffectedRows: BigInt(changes ?? 0),
        insertId: BigInt(lastInsertRowid ?? 0),
      };
    },
    close: () => db.close(),
    iterator: (isSelect: boolean, sql: string, parameters?: unknown[] | readonly unknown[]) => {
      if (!isSelect) {
        throw new Error("Only support select in stream()");
      }
      const params = parameters ?? [];
      return getStmt(sql).iterate(params) as any;
    },
  };
}

/**
 * Apply SQLite PRAGMAs for better performance and correctness
 */
function applySQLitePragmas(db: Database.Database) {
  try {
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = NORMAL");
    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 5000"); // Wait 5s before throwing SQLITE_BUSY error
  } catch (err) {
    console.warn("Failed to apply SQLite PRAGMA:", err);
  }
}

/**
 * Create a new Kysely database instance
 */
function createKyselyInstance(stage: string): Kysely<DatabaseTypes> {
  const config = dbConfig[stage];
  if (!config) {
    throw new Error(`Unknown database connection: ${stage}`);
  }

  const nativeDb = new Database(config.filename);
  applySQLitePragmas(nativeDb);

  const dialect = new GenericSqliteDialect(() => createSqliteExecutor(nativeDb));

  return new Kysely<DatabaseTypes>({
    dialect,
  });
}

/**
 * Extended Kysely interface with helper methods
 */
interface DBType extends Kysely<DatabaseTypes> {
  /**
   * Creates a new database connection for a specific stage
   * @param {string} stage - The environment stage (e.g., 'development', 'production')
   * @returns {DBType} A new database instance for the specified stage
   */
  getConnection: (stage: string) => DBType;

  /**
   * Get raw better-sqlite3 database instance
   * @returns {Database.Database} The native database instance
   */
  getNativeDb: () => Database.Database;
}

/**
 * Default database instance
 * Uses the configuration based on DB_CONNECTION environment variable
 *
 * @example
 * // Using the default connection
 * const users = await DB.selectFrom('users').selectAll().execute();
 *
 * // Using a specific stage connection
 * const stagingDB = DB.getConnection('staging');
 * const products = await stagingDB.selectFrom('products').selectAll().execute();
 */
const currentStage = process.env.DB_CONNECTION || "development";
let nativeDbInstance: Database.Database;

function initNativeDb(stage: string): Database.Database {
  const config = dbConfig[stage];
  if (!config) {
    throw new Error(`Unknown database connection: ${stage}`);
  }
  nativeDbInstance = new Database(config.filename);
  applySQLitePragmas(nativeDbInstance);
  return nativeDbInstance;
}

nativeDbInstance = initNativeDb(currentStage);

const dialect = new GenericSqliteDialect(() => createSqliteExecutor(nativeDbInstance));

// Create base Kysely instance
const baseDB = new Kysely<DatabaseTypes>({
  dialect,
});

// Extend with custom methods
const DB = Object.assign(baseDB, {
  /**
   * Method to create a new database connection for a specific stage
   * Useful when needing to connect to different databases in the same application
   *
   * @param {string} stage - The environment stage to connect to
   * @returns {DBType} A new database instance configured for the specified stage
   */
  getConnection(stage: string): DBType {
    const newDb = createKyselyInstance(stage);
    return Object.assign(newDb, {
      getConnection: this.getConnection,
      getNativeDb: () => {
        const config = dbConfig[stage];
        if (!config) {
          throw new Error(`Unknown database connection: ${stage}`);
        }
        const db = new Database(config.filename);
        applySQLitePragmas(db);
        return db;
      },
    }) as DBType;
  },

  /**
   * Get the native better-sqlite3 database instance
   * @returns {Database.Database} The native database instance
   */
  getNativeDb() {
    return nativeDbInstance;
  },
}) as DBType;

export default DB;

// Helper functions for common operations

/**
 * Get current timestamp in milliseconds
 */
export function now(): number {
  return Date.now();
}

/**
 * Raw SQL helper
 */
export { sql };
