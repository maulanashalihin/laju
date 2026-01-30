import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("sessions")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text")
    .addColumn("user_agent", "text")
    .addColumn("expires_at", "text")
    .execute();

  await db.schema.createIndex("sessions_user_id_idx").on("sessions").column("user_id").execute();
  await db.schema.createIndex("sessions_expires_at_idx").on("sessions").column("expires_at").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("sessions").execute();
}
