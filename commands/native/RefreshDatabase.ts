import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import DB from "../../app/services/DB";
import Migrator from "../../app/services/Migrator";

// Database configuration
const dbConfig: Record<string, { filename: string }> = {
  development: {
    filename: "./data/dev.sqlite3",
  },
  production: {
    filename: "./data/production.sqlite3",
  },
  test: {
    filename: "./data/test.sqlite3",
  },
};

class Command {
  public args: string[] = [];
  public commandName = "db:refresh";

  public run() {
    const databases = Object.entries(dbConfig).map(([env, config]) => ({
      name: env.charAt(0).toUpperCase() + env.slice(1),
      file: config.filename,
      env: env,
    }));

    console.log("\n📦 Available Databases:");
    console.log("─────────────────────────");
    databases.forEach((db, index) => {
      const exists = fs.existsSync(db.file);
      const status = exists ? "✓" : "✗";
      console.log(`${index + 1}. ${db.name} (${db.file}) ${status}`);
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

  private async refreshDatabase(selectedDb: { name: string; file: string; env: string }) {
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

    // Delete WAL and SHM files if exist
    const walPath = dbPath + "-wal";
    const shmPath = dbPath + "-shm";

    if (fs.existsSync(walPath)) {
      fs.unlinkSync(walPath);
      console.log("✅ WAL file deleted");
    }

    if (fs.existsSync(shmPath)) {
      fs.unlinkSync(shmPath);
      console.log("✅ SHM file deleted");
    }

    const dataDir = path.resolve("./data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log("✅ Data directory created");
    }

    console.log("\n🚀 Running migrations...\n");

    try {
      // Set environment variable for the connection
      process.env.DB_CONNECTION = selectedDb.env;

      // Create a new DB connection for the selected environment
      const db = DB.getConnection(selectedDb.env);

      // Run migrations
      const migrator = new Migrator(db);
      const result = await migrator.migrateToLatest();

      if (result.success) {
        console.log("\n✅ Migrations completed!");
        console.log("\n✅ Database refreshed successfully!");
      } else {
        console.error("\n❌ Migration failed:", result.error);
        process.exit(1);
      }

      // Close database connection
      await db.destroy();

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
