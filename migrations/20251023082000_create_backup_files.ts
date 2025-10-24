import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("backup_files", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("key", 500).notNullable().unique(); // S3/Wasabi object key
    table.string("file_name", 255).notNullable();
    table.bigInteger("file_size").nullable();
    table.string("compression", 50).defaultTo("gzip");
    table.string("storage", 50).defaultTo("s3");
    table.string("checksum", 128).nullable();
    table.bigInteger("uploaded_at").notNullable();
    table.bigInteger("deleted_at").nullable();
    
    table.string('encryption').nullable(); // e.g., 'aes-256-gcm'
    table.string('enc_iv').nullable(); // base64 IV
    table.string('enc_tag').nullable(); // base64 auth tag

    table.index(["uploaded_at"]);
    table.index(["deleted_at"]);
    table.index(["key"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("backup_files");
}