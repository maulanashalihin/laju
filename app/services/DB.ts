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
let DB = DBInstance(config[process.env.DB_CONNECTION]) as DBType;

/**
 * Method to create a new database connection for a specific stage
 * Useful when needing to connect to different databases in the same application
 * 
 * @param {string} stage - The environment stage to connect to
 * @returns {DBType} A new database instance configured for the specified stage
 */
DB.connection = (stage: string) => {
   return DBInstance(config[stage]) as DBType;
};

export default DB;
