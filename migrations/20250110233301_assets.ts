import type DB from "../app/services/DB";

export async function up(db: typeof DB): Promise<void> {
	db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      storage_key TEXT,
      user_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
	db.run(
		"CREATE INDEX IF NOT EXISTS assets_storage_key_idx ON assets(storage_key)",
	);
	db.run("CREATE INDEX IF NOT EXISTS assets_user_id_idx ON assets(user_id)");
}

export async function down(db: typeof DB): Promise<void> {
	db.run("DROP TABLE IF EXISTS assets");
}
