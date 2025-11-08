"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('email_verification_tokens', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable().index();
        table.string('token').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at').notNullable();
        table.foreign('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
    });
}
async function down(knex) {
    return knex.schema.dropTable('email_verification_tokens');
}
//# sourceMappingURL=20240101000002_create_email_verification_tokens.js.map