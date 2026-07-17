import type DB from "../app/services/DB";

export async function up(db: typeof DB): Promise<void> {
	db.run(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    )
  `);
	db.run(
		"CREATE INDEX IF NOT EXISTS password_reset_tokens_email_idx ON password_reset_tokens(email)",
	);
}

export async function down(db: typeof DB): Promise<void> {
	db.run("DROP TABLE IF EXISTS password_reset_tokens");
}
