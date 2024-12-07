"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().notNullable();
        table.string('name', 255);
        table.string('email', 255).unique().notNullable();
        table.string('phone', 255);
        table.boolean("is_verified").defaultTo(false);
        table.dateTime('membership_date');
        table.boolean("is_admin").defaultTo(false);
        table.string('password', 180).notNullable();
        table.string('remember_me_token').nullable();
        table.bigInteger("created_at");
        table.bigInteger("updated_at");
    });
}
async function down(knex) {
    await knex.schema.dropTable('users');
}
//# sourceMappingURL=20230513055909_users.js.map