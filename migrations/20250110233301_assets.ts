import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("assets")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("name", "text")
    .addColumn("type", "text", (col) => col.notNull()) // image, video, document, etc
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("mime_type", "text")
    .addColumn("size", "integer") // file size in bytes
    .addColumn("storage_key", "text")
    .addColumn("user_id", "text")
    .addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema.createIndex("assets_storage_key_idx").on("assets").column("storage_key").execute();
  await db.schema.createIndex("assets_user_id_idx").on("assets").column("user_id").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("assets").execute();
}
