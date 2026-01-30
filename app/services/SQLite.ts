/**
 * Native SQLite Service using better-sqlite3
 * This service provides direct access to the better-sqlite3 database connection
 * for optimal performance without an ORM or query builder layer.
 */
import "dotenv/config";
import Database from "better-sqlite3";
import type * as BetterSqlite3 from "better-sqlite3";

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

// Use a default connection if DB_CONNECTION is not set
const connectionType = process.env.DB_CONNECTION || "development";
const config = dbConfig[connectionType];

if (!config) {
  throw new Error(`Invalid database configuration for connection: ${connectionType}`);
}

const nativeDb = new Database(config.filename);

// Set pragmas for better performance
nativeDb.pragma("journal_mode = WAL");
nativeDb.pragma("synchronous = NORMAL");
nativeDb.pragma("foreign_keys = ON");
nativeDb.pragma("busy_timeout = 5000"); // Wait 5s before throwing SQLITE_BUSY error

// Statement cache to reuse prepared statements
const statementCache: Record<string, BetterSqlite3.Statement> = {};

/**
 * SQLite Service interface
 */
interface SQLiteServiceType {
  get<T = Record<string, unknown>>(sql: string, params?: unknown[]): T | undefined;
  all<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[];
  run(sql: string, params?: unknown[]): BetterSqlite3.RunResult;
  transaction<T>(fn: (db: SQLiteServiceType) => T): T;
  getDatabase(): BetterSqlite3.Database;
}

/**
 * SQLite Service with optimized prepared statements
 */
const SQLiteService: SQLiteServiceType = {
  /**
   * Get a single row from the database
   * @param sql SQL query with ? placeholders
   * @param params Parameters to bind to the query
   * @returns The first row or undefined if not found
   */
  get<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T | undefined {
    try {
      // Convert object params to array if needed
      const parameters = Array.isArray(params) ? params : Object.values(params);

      // Get or create prepared statement
      let stmt = statementCache[sql];
      if (!stmt) {
        stmt = nativeDb.prepare(sql);
        statementCache[sql] = stmt;
      }

      // Execute the statement and return the first row
      return stmt.get(...parameters) as T | undefined;
    } catch (error) {
      console.error("SQLite get error:", error);
      throw error;
    }
  },

  /**
   * Get all rows from the database
   * @param sql SQL query with ? placeholders
   * @param params Parameters to bind to the query
   * @returns Array of rows
   */
  all<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T[] {
    try {
      // Convert object params to array if needed
      const parameters = Array.isArray(params) ? params : Object.values(params);

      // Get or create prepared statement
      let stmt = statementCache[sql];
      if (!stmt) {
        stmt = nativeDb.prepare(sql);
        statementCache[sql] = stmt;
      }

      // Execute the statement and return all rows
      return stmt.all(...parameters) as T[];
    } catch (error) {
      console.error("SQLite all error:", error);
      throw error;
    }
  },

  /**
   * Execute a query that modifies the database
   * @param sql SQL query with ? placeholders
   * @param params Parameters to bind to the query
   * @returns Result of the run operation
   */
  run(sql: string, params: unknown[] = []): BetterSqlite3.RunResult {
    try {
      // Convert object params to array if needed
      const parameters = Array.isArray(params) ? params : Object.values(params);

      // Get or create prepared statement
      let stmt = statementCache[sql];
      if (!stmt) {
        stmt = nativeDb.prepare(sql);
        statementCache[sql] = stmt;
      }

      // Execute the statement
      return stmt.run(...parameters);
    } catch (error) {
      console.error("SQLite run error:", error);
      throw error;
    }
  },

  /**
   * Execute a transaction with multiple statements
   * @param fn Function containing the transaction logic
   * @returns Result of the transaction
   */
  transaction<T>(fn: (db: typeof SQLiteService) => T): T {
    const transaction = nativeDb.transaction(() => {
      return fn(SQLiteService);
    });

    return transaction();
  },

  /**
   * Get the raw database instance
   * @returns The better-sqlite3 database instance
   */
  getDatabase(): BetterSqlite3.Database {
    return nativeDb;
  },
};

export default SQLiteService;
