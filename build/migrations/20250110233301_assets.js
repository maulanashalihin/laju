"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('assets', (table) => {
        table.string('id').primary();
        table.string('name');
        table.string('type').notNullable();
        table.string('url').notNullable();
        table.string('mime_type');
        table.integer('size').unsigned();
        table.string('s3_key').nullable().index();
        table.string('user_id').index();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    return knex.schema.dropTable('assets');
}
//# sourceMappingURL=20250110233301_assets.js.map