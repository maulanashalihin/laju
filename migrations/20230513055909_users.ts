import type DB from "../app/services/DB";

export async function up(db: typeof DB): Promise<void> {
	db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      avatar TEXT,
      is_verified INTEGER DEFAULT 0,
      membership_date INTEGER,
      is_admin INTEGER DEFAULT 0,
      password TEXT NOT NULL,
      remember_me_token TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);
}

export async function down(db: typeof DB): Promise<void> {
	db.run("DROP TABLE IF EXISTS users");
}
