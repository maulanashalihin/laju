import DB from "../../app/services/DB";
import Migrator from "../../app/services/Migrator";

class Command {
  public args: string[] = [];
  public commandName = "db:rollback";

  public async run() {
    try {
      const migrator = new Migrator(DB);
      
      // Check if first argument is a specific migration name or number
      const firstArg = this.args[0];
      
      if (!firstArg) {
        // No arguments - rollback 1 step
        console.log("\n🔄 Rolling back 1 migration...\n");
        const result = await migrator.migrateDown(1);
        
        if (result.success) {
          console.log("\n✅ Rollback completed!");
          process.exit(0);
        } else {
          console.error("\n❌ Rollback failed:", result.error);
          process.exit(1);
        }
      }
      
      // Check if argument is a number (steps) or migration name
      const steps = parseInt(firstArg);
      
      if (!isNaN(steps)) {
        // Rollback N steps
        console.log(`\n🔄 Rolling back ${steps} migration(s)...\n`);
        
        for (let i = 0; i < steps; i++) {
          const result = await migrator.migrateDown(1);
          if (!result.success) {
            console.error("\n❌ Rollback failed at step", i + 1, ":", result.error);
            process.exit(1);
          }
        }
        
        console.log("\n✅ Rollback completed!");
        process.exit(0);
      }
      
      // Argument is a migration name (e.g., "20230514062913_sessions")
      const targetMigration = firstArg.replace(".ts", "");
      console.log(`\n🔄 Rolling back to migration: ${targetMigration}\n`);
      
      const result = await migrator.migrateTo(targetMigration);
      
      if (result.success) {
        console.log("\n✅ Rollback completed!");
        process.exit(0);
      } else {
        console.error("\n❌ Rollback failed:", result.error);
        process.exit(1);
      }
      
    } catch (error) {
      console.error("\n❌ Rollback failed:", error);
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
