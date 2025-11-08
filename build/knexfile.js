"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        client: "better-sqlite3",
        connection: {
            filename: "./dev.sqlite3"
        },
        useNullAsDefault: true
    },
    production: {
        client: "better-sqlite3",
        connection: {
            filename: "./production.sqlite3"
        },
        useNullAsDefault: true
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map