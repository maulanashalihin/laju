import type DB from "../app/services/DB";

export async function up(db: typeof DB): Promise<void> {
	db.run(`
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    )
  `);
}

export async function down(db: typeof DB): Promise<void> {
	db.run("DROP TABLE IF EXISTS email_verification_tokens");
}
