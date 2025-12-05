"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        client: "better-sqlite3",
        connection: {
            filename: "./data/dev.sqlite3"
        },
        useNullAsDefault: true
    },
    production: {
        client: "better-sqlite3",
        connection: {
            filename: "./data/production.sqlite3"
        },
        useNullAsDefault: true
    },
    test: {
        client: "better-sqlite3",
        connection: {
            filename: "./data/test.sqlite3"
        },
        useNullAsDefault: true,
        migrations: {
            directory: './migrations'
        }
    }
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map