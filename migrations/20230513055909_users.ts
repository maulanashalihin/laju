import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "text", (col) => col.primaryKey().notNull())
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("phone", "text")
    .addColumn("avatar", "text")
    .addColumn("is_verified", "integer", (col) => col.defaultTo(0))
    .addColumn("membership_date", "integer")
    .addColumn("is_admin", "integer", (col) => col.defaultTo(0))
    .addColumn("password", "text", (col) => col.notNull())
    .addColumn("remember_me_token", "text")
    .addColumn("created_at", "integer")
    .addColumn("updated_at", "integer")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
