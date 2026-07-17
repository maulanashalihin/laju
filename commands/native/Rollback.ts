import { migrateDown } from "../../app/services/Migrator";

class Command {
	public args: string[] = [];

	public async run() {
		const firstArg = this.args[0];

		try {
			if (!firstArg) {
				// No arguments - rollback 1 step
				console.log("\n🔄 Rolling back 1 migration...\n");
				const results = await migrateDown(1);
				const failed = results.filter((r) => !r.success);
				if (failed.length > 0) {
					console.error("\n❌ Rollback failed");
					failed.forEach((r) => console.error(`   ${r.name}: ${r.error}`));
					process.exit(1);
				}
				console.log("\n✅ Rollback completed!");
				process.exit(0);
			}

			const steps = parseInt(firstArg);
			if (!isNaN(steps)) {
				// Rollback N steps
				console.log(`\n🔄 Rolling back ${steps} migration(s)...\n`);
				const results = await migrateDown(steps);
				const failed = results.filter((r) => !r.success);
				if (failed.length > 0) {
					console.error("\n❌ Rollback failed");
					failed.forEach((r) => console.error(`   ${r.name}: ${r.error}`));
					process.exit(1);
				}
				console.log("\n✅ Rollback completed!");
				process.exit(0);
			}

			console.log(
				"\nℹ️  Rollback by migration name not supported in simplified migrator.",
			);
			console.log(
				"   Use 'npx tsx commands/native/Migrate.ts down <steps>' instead.",
			);
			process.exit(1);
		} catch (error) {
			console.error("\n❌ Rollback failed:", error);
			process.exit(1);
		}
	}
}

const cmd = new Command();
cmd.args = process.argv.slice(2);
cmd.run();

export default new Command();
