import DB from "../../app/services/DB";
import Migrator from "../../app/services/Migrator";

class Command {
  public args: string[] = [];
  public commandName = "db:migrate";

  public async run() {
    console.log("\n🚀 Running migrations...\n");

    try {
      const migrator = new Migrator(DB);
      const result = await migrator.migrateToLatest();

      if (result.success) {
        console.log("\n✅ Migrations completed!");
        process.exit(0);
      } else {
        console.error("\n❌ Migration failed:", result.error);
        process.exit(1);
      }
    } catch (error) {
      console.error("\n❌ Migration failed:", error);
      process.exit(1);
    } finally {
      await DB.destroy();
    }
  }
}

const cmd = new Command();
cmd.args = process.argv.slice(2);
cmd.run();

export default new Command();
