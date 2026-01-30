import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("password_reset_tokens")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.unique().notNull())
    .addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("expires_at", "text", (col) => col.notNull())
    .execute();

  await db.schema.createIndex("password_reset_tokens_email_idx").on("password_reset_tokens").column("email").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("password_reset_tokens").execute();
}
