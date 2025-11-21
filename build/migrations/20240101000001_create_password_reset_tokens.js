"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('password_reset_tokens', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().index();
        table.string('token').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at').notNullable();
    });
}
async function down(knex) {
    return knex.schema.dropTable('password_reset_tokens');
}
//# sourceMappingURL=20240101000001_create_password_reset_tokens.js.map