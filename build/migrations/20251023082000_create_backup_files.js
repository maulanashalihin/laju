"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("backup_files", (table) => {
        table.uuid("id").primary().notNullable();
        table.string("key", 500).notNullable().unique();
        table.string("file_name", 255).notNullable();
        table.bigInteger("file_size").nullable();
        table.string("compression", 50).defaultTo("gzip");
        table.string("storage", 50).defaultTo("s3");
        table.string("checksum", 128).nullable();
        table.bigInteger("uploaded_at").notNullable();
        table.bigInteger("deleted_at").nullable();
        table.string('encryption').nullable();
        table.string('enc_iv').nullable();
        table.string('enc_tag').nullable();
        table.index(["uploaded_at"]);
        table.index(["deleted_at"]);
        table.index(["key"]);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists("backup_files");
}
//# sourceMappingURL=20251023082000_create_backup_files.js.map