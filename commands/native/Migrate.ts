import { migrateToLatest, migrateDown } from "../../app/services/Migrator";

class Command {
	public args: string[] = [];

	public async run() {
		const direction = this.args[0] || "up";

		console.log("\n🚀 Running migrations...\n");

		try {
			if (direction === "down") {
				const steps = parseInt(this.args[1] || "1", 10);
				const results = await migrateDown(steps);
				const failed = results.filter((r) => !r.success);
				if (failed.length > 0) {
					console.error(`\n❌ ${failed.length} migration(s) failed`);
					failed.forEach((r) => console.error(`   ${r.name}: ${r.error}`));
					process.exit(1);
				}
				console.log(`\n✅ Rolled back ${results.length} migration(s)!`);
			} else {
				const results = await migrateToLatest();
				const failed = results.filter((r) => !r.success);
				if (failed.length > 0) {
					console.error(`\n❌ ${failed.length} migration(s) failed`);
					failed.forEach((r) => console.error(`   ${r.name}: ${r.error}`));
					process.exit(1);
				}
				console.log(`\n✅ Migrations completed!`);
			}

			process.exit(0);
		} catch (error) {
			console.error("\n❌ Migration failed:", error);
			process.exit(1);
		}
	}
}

const cmd = new Command();
cmd.args = process.argv.slice(2);
cmd.run();
