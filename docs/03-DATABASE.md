# Database Guide

Complete guide for database operations in Laju framework.

## Table of Contents

1. [Overview](#overview)
2. [DB Service (Kysely)](#db-service-kysely)
3. [SQLite Service (Native)](#sqlite-service-native)
4. [Migrations](#migrations)
5. [Database Refresh](#database-refresh)
6. [Performance Tips](#performance-tips)

---

## Overview

Laju provides two database services:

| Service | Use Case | Performance |
|---------|----------|-------------|
| **DB (Kysely)** | Complex queries, migrations | Standard |
| **SQLite (Native)** | Simple reads, performance-critical | 2-4x faster |

Both use **BetterSQLite3** with WAL mode enabled by default.

---

## DB Service (Kysely)

Kysely is a type-safe SQL query builder for TypeScript. It provides unparalleled autocompletion and compile-time type safety for complex queries.

### Basic Queries

```typescript
import DB from "app/services/DB";

// SELECT all
const users = await DB.selectFrom("users").selectAll().execute();

// SELECT with WHERE
const user = await DB.selectFrom("users")
  .selectAll()
  .where("email", "=", email)
  .executeTakeFirst();

const activeUsers = await DB.selectFrom("users")
  .selectAll()
  .where("is_active", "=", true)
  .execute();

// SELECT with multiple conditions
const results = await DB.selectFrom("posts")
  .selectAll()
  .where("status", "=", "published")
  .where("views", ">", 1000)
  .orderBy("created_at", "desc")
  .limit(10)
  .execute();
```

### INSERT

```typescript
// Basic insert
await DB.insertInto("posts")
  .values({
    title: "Hello World",
    content: "Post content",
    created_at: Date.now(),
    updated_at: Date.now()
  })
  .execute();

// Insert and get result
const result = await DB.insertInto("users")
  .values({
    name: "John Doe",
    email: "john@example.com"
  })
  .executeTakeFirst();
console.log(result.insertId); // Inserted row ID

// Batch insert
await DB.insertInto("logs").values([
  { message: "Log 1", created_at: Date.now() },
  { message: "Log 2", created_at: Date.now() },
  { message: "Log 3", created_at: Date.now() }
]).execute();
```

### UPDATE

```typescript
await DB.updateTable("users")
  .set({
    name: "New Name",
    updated_at: Date.now()
  })
  .where("id", "=", userId)
  .execute();

// Update multiple rows
await DB.updateTable("posts")
  .set({ status: "archived" })
  .where("status", "=", "draft")
  .execute();
```

### DELETE

```typescript
await DB.deleteFrom("sessions")
  .where("id", "=", sessionId)
  .execute();

// Delete with multiple conditions
await DB.deleteFrom("tokens")
  .where("expires_at", "<", new Date().toISOString())
  .execute();
```

### JOIN

```typescript
const posts = await DB.selectFrom("posts")
  .innerJoin("users", "posts.user_id", "users.id")
  .select(["posts.id", "posts.title", "users.name as author"])
  .execute();

// Left join
const users = await DB.selectFrom("users")
  .leftJoin("profiles", "users.id", "profiles.user_id")
  .select(["users.id", "users.name", "profiles.bio"])
  .execute();
```

### WHERE Variations

```typescript
// OR WHERE
const results = await DB.selectFrom("users")
  .selectAll()
  .where((eb) => eb.or([
    eb("role", "=", "admin"),
    eb("role", "=", "moderator")
  ]))
  .execute();

// WHERE IN
const results = await DB.selectFrom("posts")
  .selectAll()
  .where("category_id", "in", [1, 2, 3])
  .execute();

// WHERE NOT
const results = await DB.selectFrom("users")
  .selectAll()
  .where("status", "!=", "banned")
  .execute();

// WHERE NULL
const results = await DB.selectFrom("users")
  .selectAll()
  .where("deleted_at", "is", null)
  .execute();

// LIKE search
const results = await DB.selectFrom("users")
  .selectAll()
  .where("name", "like", "%john%")
  .execute();
```

### Aggregates

```typescript
// COUNT
const result = await DB.selectFrom("users")
  .select((eb) => eb.fn.countAll().as("count"))
  .executeTakeFirst();
console.log(result?.count);

// SUM
const result = await DB.selectFrom("orders")
  .select((eb) => eb.fn.sum("amount").as("total"))
  .executeTakeFirst();

// AVG
const result = await DB.selectFrom("products")
  .select((eb) => eb.fn.avg("price").as("average"))
  .executeTakeFirst();

// MIN/MAX
const minResult = await DB.selectFrom("products")
  .select((eb) => eb.fn.min("price").as("lowest"))
  .executeTakeFirst();

const maxResult = await DB.selectFrom("products")
  .select((eb) => eb.fn.max("price").as("highest"))
  .executeTakeFirst();
```

### Transactions

```typescript
await DB.transaction().execute(async (trx) => {
  const userResult = await trx.insertInto("users")
    .values({ name: "John" })
    .executeTakeFirst();
  
  const userId = userResult.insertId?.toString();
  
  await trx.insertInto("profiles")
    .values({ user_id: userId, bio: "Hello" })
    .execute();
    
  await trx.insertInto("settings")
    .values({ user_id: userId, theme: "dark" })
    .execute();
});
```

### Raw Queries

```typescript
import { sql } from "kysely";

const results = await sql<{
  id: string;
  name: string;
}>`SELECT * FROM users WHERE email = ${email}`.execute(DB);

// Raw in select
const users = await DB.selectFrom("users")
  .select([
    "id",
    sql<number>`COUNT(*) OVER()`.as("total_count")
  ])
  .execute();
```

### Multiple Connections

```typescript
const stagingDB = DB.connection("staging");
const users = await stagingDB.selectFrom("users").selectAll().execute();
```

---

## SQLite Service (Native)

Direct better-sqlite3 access for maximum performance.

### When to Use

| Use Native SQLite | Use Kysely |
|-------------------|------------|
| Simple reads (2-4x faster) | Complex query building |
| Performance-critical paths | Type-safe queries |
| Bulk operations | Developer productivity |
| Direct SQL control | Complex joins and subqueries |

### Basic Methods

```typescript
import SQLite from "app/services/SQLite";

// Get single row
const user = SQLite.get(
  'SELECT * FROM users WHERE email = ?',
  ['user@example.com']
);

// Get all rows
const posts = SQLite.all(
  'SELECT * FROM posts ORDER BY created_at DESC'
);

// Execute (INSERT, UPDATE, DELETE)
const result = SQLite.run(
  'INSERT INTO posts (title, content) VALUES (?, ?)',
  ['Title', 'Content']
);
console.log('Inserted ID:', result.lastInsertRowid);
console.log('Changes:', result.changes);
```

### Prepared Statements

```typescript
// Reuse statement for bulk operations
const insert = SQLite.prepare('INSERT INTO logs (message) VALUES (?)');
for (const msg of messages) {
  insert.run(msg);
}
```

### Transactions

```typescript
const insertMany = SQLite.transaction((items) => {
  const insert = SQLite.prepare('INSERT INTO items (name) VALUES (?)');
  for (const item of items) {
    insert.run(item.name);
  }
});
insertMany(items);
```

### Complex Queries

```typescript
const stats = SQLite.get(`
  SELECT 
    COUNT(*) as total,
    AVG(views) as avg_views,
    MAX(views) as max_views
  FROM posts
  WHERE status = ?
`, ['published']);
```

---

## Migrations

Laju uses Kysely's built-in migration system.

### Create Migration

Create a new file in the `migrations/` folder with the naming convention:
```
migrations/YYYYMMDDhhmmss_description.ts
```

Example:
```typescript
// migrations/20240101000000_create_posts_table.ts
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("posts")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("content", "text")
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").onDelete("cascade")
    )
    .addColumn("is_published", "boolean", (col) => col.defaultTo(false))
    .addColumn("created_at", "bigint")
    .addColumn("updated_at", "bigint")
    .execute();
    
  // Add indexes
  await db.schema
    .createIndex("posts_user_id_idx")
    .on("posts")
    .column("user_id")
    .execute();
    
  await db.schema
    .createIndex("posts_is_published_created_at_idx")
    .on("posts")
    .columns(["is_published", "created_at"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("posts").execute();
}
```

### Run Migrations

```bash
# Run all pending migrations
npm run migrate

# Database refresh (interactive)
npm run refresh
```

### Rollback Migrations

```bash
# Rollback 1 migration (default)
npm run migrate:down

# Rollback N migrations
npm run migrate:down 3

# Rollback to specific migration 
npm run migrate:down 20230514062913_sessions
npm run migrate:down 20230514062913_sessions.ts
```
 

#### Programmatic Usage

```typescript
import DB from "../app/services/DB";
import Migrator from "../app/services/Migrator";

async function rollback() {
  const migrator = new Migrator(DB);
  
  // Rollback one migration
  const result = await migrator.migrateDown(1);
  
  // Or rollback to specific migration
  // const result = await migrator.migrateTo("20230514062913_sessions");
  
  if (result.success) {
    console.log("✅ Rollback completed");
  } else {
    console.error("❌ Rollback failed:", result.error);
  }
  
  await DB.destroy();
}

rollback();
```

---

## Database Refresh

The `db:refresh` command allows you to selectively refresh a specific database by deleting its SQLite file and re-running migrations.

### Usage

```bash
# Interactive mode - prompts you to select a database
npm run refresh

# Direct selection - refresh specific database
npm run refresh 1    # Development
npm run refresh 2    # Production
npm run refresh 3    # Test
```

### How It Works

1. **Lists available databases** - Shows all databases configured in DB service
2. **Displays status** - Shows which database files exist (✓) or not (✗)
3. **Deletes selected database** - Removes only the specified `.sqlite3` file
4. **Recreates directory** - Ensures the `data` directory exists
5. **Runs migrations** - Executes all pending migrations for the selected environment

### Example Output

```bash
$ npm run refresh

📦 Available Databases:
─────────────────────────
1. Development (./data/dev.sqlite3) ✓
2. Production (./data/production.sqlite3) ✓
3. Test (./data/test.sqlite3) ✗
─────────────────────────

Select database number (1-3): 1

🔄 Refreshing Development database...
   File: ./data/dev.sqlite3

✅ Database file deleted

🚀 Running migrations...

✓ 20230513055909_users
✓ 20230514062913_sessions
✓ 20240101000001_create_password_reset_tokens
✓ 20240101000002_create_email_verification_tokens
✓ 20250110233301_assets
✓ 20251023082000_create_backup_files
✓ 20251210000000_create_cache_table

✅ Database refreshed successfully!
```

### Benefits

- **Selective refresh** - Only refresh the database you need, not all of them
- **Safe** - Doesn't delete the entire `data` folder, only the specific SQLite file
- **Automatic migrations** - Runs migrations with the correct `DB_CONNECTION` set
- **Interactive or direct** - Use prompts for convenience or pass arguments for scripts

### Configuration

Database configurations are defined in `app/services/DB.ts`:

```typescript
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
```

### When to Use

- Reset development database during development
- Clean up test database after running tests
- Rebuild database after schema changes
- Start fresh with a clean database state

---

## Performance Tips

### 1. Use Native SQLite for Simple Reads

```typescript
// Standard (Kysely)
const user = await DB.selectFrom("users")
  .selectAll()
  .where("id", "=", id)
  .executeTakeFirst();

// Fast (Native) - 2-4x faster
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]);
```

### 2. Add Indexes

```typescript
// In migration
await db.schema
  .createIndex("users_email_idx")
  .on("users")
  .column("email")
  .execute();

// Composite index
await db.schema
  .createIndex("posts_user_id_created_at_idx")
  .on("posts")
  .columns(["user_id", "created_at"])
  .execute();

// Unique index
await db.schema
  .createIndex("users_email_unique_idx")
  .on("users")
  .column("email")
  .unique()
  .execute();
```

### 3. Use Transactions for Bulk Operations

```typescript
// Slow - individual inserts
for (const item of items) {
  await DB.insertInto("items").values(item).execute();
}

// Fast - batch insert
await DB.insertInto("items").values(items).execute();

// Or use transaction
await DB.transaction().execute(async (trx) => {
  for (const item of items) {
    await trx.insertInto("items").values(item).execute();
  }
});
```

### 4. Use executeTakeFirst() for Single Records

```typescript
// Correct
const user = await DB.selectFrom("users")
  .selectAll()
  .where("id", "=", id)
  .executeTakeFirst();

// Avoid - returns array
const [user] = await DB.selectFrom("users")
  .selectAll()
  .where("id", "=", id)
  .limit(1)
  .execute();
```

### 5. Select Only Needed Columns

```typescript
// Good - select specific columns
const users = await DB.selectFrom("users")
  .select(["id", "name", "email"])
  .execute();

// Acceptable when you need all columns
const users = await DB.selectFrom("users")
  .selectAll()
  .execute();
```

---

## Next Steps

- [Authentication Guide](04-AUTHENTICATION.md)
- [Storage & Email Guide](05-STORAGE.md)
- [API Reference](07-API-REFERENCE.md)
