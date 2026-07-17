import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { migrateToLatest } from "../../app/services/Migrator";

const dbConfig: Record<string, { filename: string }> = {
	development: { filename: "./data/dev.sqlite3" },
	production: { filename: "./data/production.sqlite3" },
	test: { filename: "./data/test.sqlite3" },
};

class Command {
	public args: string[] = [];

	public run() {
		const databases = Object.entries(dbConfig).map(([env, config]) => ({
			name: env.charAt(0).toUpperCase() + env.slice(1),
			file: config.filename,
			env,
		}));

		console.log("\n📦 Available Databases:");
		console.log("─────────────────────────");
		databases.forEach((db, index) => {
			const exists = fs.existsSync(db.file);
			console.log(
				`${index + 1}. ${db.name} (${db.file}) ${exists ? "✓" : "✗"}`,
			);
		});
		console.log("─────────────────────────\n");

		const selection = this.args[1];

		if (!selection) {
			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			rl.question("Select database number (1-3): ", (answer) => {
				rl.close();
				const index = parseInt(answer) - 1;
				if (isNaN(index) || index < 0 || index >= databases.length) {
					console.log("❌ Invalid selection");
					process.exit(1);
				}
				this.refreshDatabase(databases[index]);
			});
			return;
		}

		const index = parseInt(selection) - 1;
		if (isNaN(index) || index < 0 || index >= databases.length) {
			console.log("❌ Invalid selection");
			process.exit(1);
		}

		this.refreshDatabase(databases[index]);
	}

	private async refreshDatabase(selectedDb: {
		name: string;
		file: string;
		env: string;
	}) {
		console.log(`\n🔄 Refreshing ${selectedDb.name} database...`);
		console.log(`   File: ${selectedDb.file}\n`);

		const dbPath = path.resolve(selectedDb.file);

		// Delete main database file
		if (fs.existsSync(dbPath)) {
			fs.unlinkSync(dbPath);
			console.log("✅ Database file deleted");
		} else {
			console.log("ℹ️  Database file doesn't exist, skipping deletion");
		}

		// Delete WAL and SHM files
		for (const ext of ["-wal", "-shm"]) {
			const p = dbPath + ext;
			if (fs.existsSync(p)) {
				fs.unlinkSync(p);
				console.log(`✅ ${ext} file deleted`);
			}
		}

		const dataDir = path.resolve("./data");
		if (!fs.existsSync(dataDir)) {
			fs.mkdirSync(dataDir, { recursive: true });
			console.log("✅ Data directory created");
		}

		// Set environment for DB connection
		process.env.DB_CONNECTION = selectedDb.env;

		// Re-initialize DB by requiring fresh module
		// (module cache will use the new env)
		delete require.cache[require.resolve("../../app/services/DB")];

		console.log("\n🚀 Running migrations...\n");

		try {
			const results = await migrateToLatest();
			const failed = results.filter((r) => !r.success);
			if (failed.length > 0) {
				console.error(`\n❌ ${failed.length} migration(s) failed`);
				failed.forEach((r) => console.error(`   ${r.name}: ${r.error}`));
				process.exit(1);
			}
			console.log("\n✅ Database refreshed successfully!");
			process.exit(0);
		} catch (error) {
			console.error("\n❌ Migration failed:", error);
			process.exit(1);
		}
	}
}

const cmd = new Command();
cmd.args = ["", ...process.argv.slice(2)];
cmd.run();

export default new Command();
