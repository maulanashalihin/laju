/**
 * Database Service using Knex.js
 * This service provides a configured database connection instance using Knex.js query builder.
 * It supports multiple database connections based on different stages (development, production, etc.).
 */

import config from "../../knexfile";
require("dotenv").config();
import DBInstance from "knex";
import { Knex } from "knex";

/**
 * Extended Knex interface that includes a custom connection method
 * for switching between different database configurations
 * 
 * @interface DBType
 * @extends {Knex}
 */
interface DBType extends Knex {
   /**
    * Creates a new database connection for a specific stage
    * @param {string} stage - The environment stage (e.g., 'development', 'production')
    * @returns {DBType} A new database instance for the specified stage
    */
   connection: (stage: string) => DBType;
}

/**
 * Default database instance
 * Uses the configuration from knexfile.js based on DB_CONNECTION environment variable
 * 
 * @example
 * // Using the default connection
 * const users = await DB('users').select('*');
 * 
 * // Using a specific stage connection
 * const stagingDB = DB.connection('staging');
 * const products = await stagingDB('products').select('*');
 */
let DB = DBInstance(config[process.env.DB_CONNECTION as string]) as DBType;

/**
 * Apply SQLite PRAGMAs for better performance and correctness when using better-sqlite3
 * Runs once per knex instance.
 */
function applySQLitePragmas(instance: Knex) {
  const client = (config[process.env.DB_CONNECTION as string] || {}).client;
  if (client === 'better-sqlite3') {
    try {
      // These PRAGMAs are safe for most applications; adjust if needed
      instance.raw('PRAGMA journal_mode = WAL');
      instance.raw('PRAGMA synchronous = NORMAL');
      instance.raw('PRAGMA foreign_keys = ON');
    } catch (err) {
      // Non-fatal: continue even if PRAGMA fails
      console.warn('Failed to apply SQLite PRAGMA:', err);
    }
  }
}

// Apply PRAGMA on the default instance
applySQLitePragmas(DB);

/**
 * Method to create a new database connection for a specific stage
 * Useful when needing to connect to different databases in the same application
 * 
 * @param {string} stage - The environment stage to connect to
 * @returns {DBType} A new database instance configured for the specified stage
 */
DB.connection = (stage: string) => {
   const instance = DBInstance(config[stage]) as DBType;
   applySQLitePragmas(instance);
   return instance;
};

export default DB;
