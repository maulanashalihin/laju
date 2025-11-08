"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knexfile_1 = __importDefault(require("../../knexfile"));
require("dotenv").config();
const knex_1 = __importDefault(require("knex"));
let DB = (0, knex_1.default)(knexfile_1.default[process.env.DB_CONNECTION]);
function applySQLitePragmas(instance) {
    const client = (knexfile_1.default[process.env.DB_CONNECTION] || {}).client;
    if (client === 'better-sqlite3') {
        try {
            instance.raw('PRAGMA journal_mode = WAL');
            instance.raw('PRAGMA synchronous = NORMAL');
            instance.raw('PRAGMA foreign_keys = ON');
        }
        catch (err) {
            console.warn('Failed to apply SQLite PRAGMA:', err);
        }
    }
}
applySQLitePragmas(DB);
DB.connection = (stage) => {
    const instance = (0, knex_1.default)(knexfile_1.default[stage]);
    applySQLitePragmas(instance);
    return instance;
};
exports.default = DB;
//# sourceMappingURL=DB.js.map