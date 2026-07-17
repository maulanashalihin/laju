import type DB from "../app/services/DB";

export async function up(db: typeof DB): Promise<void> {
	db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      user_agent TEXT,
      expires_at TEXT,
      data TEXT DEFAULT '{}',
      created_at INTEGER,
      updated_at INTEGER
    )
  `);
	db.run(
		"CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id)",
	);
	db.run(
		"CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at)",
	);
}

export async function down(db: typeof DB): Promise<void> {
	db.run("DROP TABLE IF EXISTS sessions");
}
