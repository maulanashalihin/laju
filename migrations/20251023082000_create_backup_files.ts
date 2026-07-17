import type DB from "../app/services/DB";

export async function up(db: typeof DB): Promise<void> {
	db.run(`
    CREATE TABLE IF NOT EXISTS backup_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      path TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
}

export async function down(db: typeof DB): Promise<void> {
	db.run("DROP TABLE IF EXISTS backup_files");
}
