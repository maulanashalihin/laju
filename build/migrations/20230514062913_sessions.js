"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('sessions', function (table) {
        table.string('id').primary();
        table.string("user_id").index();
        table.text("user_agent");
    });
}
async function down(knex) {
    await knex.schema.dropTable('sessions');
}
//# sourceMappingURL=20230514062913_sessions.js.map