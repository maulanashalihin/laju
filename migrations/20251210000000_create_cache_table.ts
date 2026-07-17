import type DB from "../app/services/DB";

export async function up(db: typeof DB): Promise<void> {
	db.run(`
    CREATE TABLE IF NOT EXISTS cache (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      expiration INTEGER NOT NULL
    )
  `);
}

export async function down(db: typeof DB): Promise<void> {
	db.run("DROP TABLE IF EXISTS cache");
}
