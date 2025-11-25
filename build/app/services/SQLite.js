"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const knexfile_1 = __importDefault(require("../../knexfile"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const connectionType = process.env.DB_CONNECTION || 'development';
const dbConfig = knexfile_1.default[connectionType];
if (!dbConfig ||
    !dbConfig.connection ||
    typeof dbConfig.connection !== 'object' ||
    !('filename' in dbConfig.connection)) {
    throw new Error(`Invalid database configuration for connection: ${connectionType}`);
}
const connectionConfig = dbConfig.connection;
const nativeDb = new better_sqlite3_1.default(connectionConfig.filename);
nativeDb.pragma('journal_mode = WAL');
nativeDb.pragma('synchronous = NORMAL');
nativeDb.pragma('foreign_keys = ON');
const statementCache = {};
const SQLiteService = {
    get(sql, params = []) {
        try {
            const parameters = Array.isArray(params) ? params : Object.values(params);
            let stmt = statementCache[sql];
            if (!stmt) {
                stmt = nativeDb.prepare(sql);
                statementCache[sql] = stmt;
            }
            return stmt.get(...parameters);
        }
        catch (error) {
            console.error('SQLite get error:', error);
            throw error;
        }
    },
    all(sql, params = []) {
        try {
            const parameters = Array.isArray(params) ? params : Object.values(params);
            let stmt = statementCache[sql];
            if (!stmt) {
                stmt = nativeDb.prepare(sql);
                statementCache[sql] = stmt;
            }
            return stmt.all(...parameters);
        }
        catch (error) {
            console.error('SQLite all error:', error);
            throw error;
        }
    },
    run(sql, params = []) {
        try {
            const parameters = Array.isArray(params) ? params : Object.values(params);
            let stmt = statementCache[sql];
            if (!stmt) {
                stmt = nativeDb.prepare(sql);
                statementCache[sql] = stmt;
            }
            return stmt.run(...parameters);
        }
        catch (error) {
            console.error('SQLite run error:', error);
            throw error;
        }
    },
    transaction(fn) {
        const transaction = nativeDb.transaction(() => {
            return fn(SQLiteService);
        });
        return transaction();
    },
    getDatabase() {
        return nativeDb;
    },
};
exports.default = SQLiteService;
//# sourceMappingURL=SQLite.js.map