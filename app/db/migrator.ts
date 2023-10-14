import DB from "./index";

import { migrate } from "drizzle-orm/bun-sqlite/migrator";

await migrate(DB, { migrationsFolder: "migrations" });


