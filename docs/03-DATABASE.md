# Database Guide

Complete guide for database operations in Laju framework.

## Table of Contents

1. [Overview](#overview)
2. [DB Service (Knex.js)](#db-service-knexjs)
3. [SQLite Service (Native)](#sqlite-service-native)
4. [Migrations](#migrations)
5. [Database Refresh](#database-refresh)
6. [Performance Tips](#performance-tips)

---

## Overview

Laju provides two database services:

| Service | Use Case | Performance |
|---------|----------|-------------|
| **DB (Knex.js)** | Complex queries, migrations | Standard |
| **SQLite (Native)** | Simple reads, performance-critical | 2-4x faster |

Both use **BetterSQLite3** with WAL mode enabled by default.

---

## DB Service (Knex.js)

### Configuration

```typescript
// knexfile.ts
import type { Knex } from "knex"; 

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/dev.sqlite3"
    },
    useNullAsDefault: true
  },

  production: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/production.sqlite3"
    },
    useNullAsDefault: true
  },

  test: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/test.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations'
    }
  }
};

export default config;
```

### Basic Queries

```typescript
import DB from "app/services/DB";

// SELECT all
const users = await DB.from("users").select("*");

// SELECT with WHERE
const user = await DB.from("users").where("email", email).first();
const activeUsers = await DB.from("users").where("is_active", true);

// SELECT with multiple conditions
const results = await DB.from("posts")
  .where("status", "published")
  .where("views", ">", 1000)
  .orderBy("created_at", "desc")
  .limit(10);
```

### INSERT

```typescript
// Basic insert
await DB.table("posts").insert({
  title: "Hello World",
  content: "Post content",
  created_at: Date.now(),
  updated_at: Date.now()
});

// Insert with returning ID
const [id] = await DB.table("users").insert({
  name: "John Doe",
  email: "john@example.com"
}).returning("id");

// Batch insert
await DB.table("logs").insert([
  { message: "Log 1", created_at: Date.now() },
  { message: "Log 2", created_at: Date.now() },
  { message: "Log 3", created_at: Date.now() }
]);
```

### UPDATE

```typescript
await DB.table("users")
  .where("id", userId)
  .update({
    name: "New Name",
    updated_at: Date.now()
  });

// Update multiple rows
await DB.table("posts")
  .where("status", "draft")
  .update({ status: "archived" });
```

### DELETE

```typescript
await DB.from("sessions")
  .where("id", sessionId)
  .delete();

// Delete with multiple conditions
await DB.from("tokens")
  .where("expires_at", "<", new Date())
  .delete();
```

### JOIN

```typescript
const posts = await DB.from("posts")
  .join("users", "posts.user_id", "users.id")
  .select("posts.*", "users.name as author");

// Left join
const users = await DB.from("users")
  .leftJoin("profiles", "users.id", "profiles.user_id")
  .select("users.*", "profiles.bio");
```

### WHERE Variations

```typescript
// OR WHERE
const results = await DB.from("users")
  .where("role", "admin")
  .orWhere("role", "moderator");

// WHERE IN
const results = await DB.from("posts")
  .whereIn("category_id", [1, 2, 3]);

// WHERE NOT
const results = await DB.from("users")
  .whereNot("status", "banned");

// WHERE NULL
const results = await DB.from("users")
  .whereNull("deleted_at");

// WHERE BETWEEN
const results = await DB.from("orders")
  .whereBetween("created_at", [startDate, endDate]);

// LIKE search
const results = await DB.from("users")
  .where("name", "like", "%john%");
```

### Aggregates

```typescript
// COUNT
const count = await DB.from("users").count("* as total");

// SUM
const total = await DB.from("orders").sum("amount as total");

// AVG
const avg = await DB.from("products").avg("price as average");

// MIN/MAX
const min = await DB.from("products").min("price as lowest");
const max = await DB.from("products").max("price as highest");
```

### Transactions

```typescript
await DB.transaction(async (trx) => {
  const userId = await trx.table("users").insert({ name: "John" });
  await trx.table("profiles").insert({ user_id: userId, bio: "Hello" });
  await trx.table("settings").insert({ user_id: userId, theme: "dark" });
});
```

### Raw Queries

```typescript
const results = await DB.raw("SELECT * FROM users WHERE email = ?", [email]);

// Raw in select
const users = await DB.from("users")
  .select(DB.raw("COUNT(*) as post_count"))
  .groupBy("id");
```

### Multiple Connections

```typescript
const stagingDB = DB.connection("staging");
const users = await stagingDB.from("users").select("*");
```

---

## SQLite Service (Native)

Direct better-sqlite3 access for maximum performance.

### When to Use

| Use Native SQLite | Use Knex.js |
|-------------------|-------------|
| Simple reads (2-4x faster) | Complex query building |
| Performance-critical paths | Database migrations |
| Bulk operations | Developer productivity |
| Direct SQL control | Cross-database compatibility |

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

### Create Migration

```bash
npx knex migrate:make create_posts_table
```

### Migration Structure

```typescript
// migrations/20240101000000_create_posts_table.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content');
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.boolean('is_published').defaultTo(false);
    table.bigInteger('created_at');
    table.bigInteger('updated_at');
    
    // Indexes
    table.index(['user_id']);
    table.index(['is_published', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('posts');
}
```

### Run Migrations

```bash
# Run all pending migrations
npx knex migrate:latest

# Rollback last batch
npx knex migrate:rollback

# Check migration status
npx knex migrate:status
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

1. **Lists available databases** - Shows all databases configured in `knexfile.ts`
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

Requiring external module ts-node/register
Using environment: development
Batch 1 run: 7 migrations

✅ Database refreshed successfully!
```

### Benefits

- **Selective refresh** - Only refresh the database you need, not all of them
- **Safe** - Doesn't delete the entire `data` folder, only the specific SQLite file
- **Automatic migrations** - Runs migrations with the correct `NODE_ENV` set
- **Interactive or direct** - Use prompts for convenience or pass arguments for scripts

### Configuration

The command reads database configurations from `knexfile.ts`:

```typescript
// knexfile.ts
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./data/dev.sqlite3"
    },
    useNullAsDefault: true
  },
  // ... production, test
};
```

### When to Use

- Reset development database during development
- Clean up test database after running tests
- Rebuild database after schema changes
- Start fresh with a clean database state

---

## Performance Tips

### 1. Use Native SQLite for Reads

```typescript
// Slow (Knex)
const user = await DB.from("users").where("id", id).first();

// Fast (Native) - 2-4x faster
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]);
```

### 2. Add Indexes

```typescript
// In migration
table.index(['email']);  // Single column
table.index(['user_id', 'created_at']);  // Composite
table.unique(['email']);  // Unique index
```

### 3. Use Transactions for Bulk Operations

```typescript
// Slow - individual inserts
for (const item of items) {
  await DB.table("items").insert(item);
}

// Fast - transaction
await DB.transaction(async (trx) => {
  for (const item of items) {
    await trx.table("items").insert(item);
  }
});
```

### 4. Use .first() for Single Records

```typescript
// Correct
const user = await DB.from("users").where("id", id).first();

// Avoid
const [user] = await DB.from("users").where("id", id).limit(1);
```

### 5. Select Only Needed Columns

```typescript
// Good - select specific columns
const users = await DB.from("users").select("id", "name", "email");

// Avoid - select all when not needed
const users = await DB.from("users").select("*");
```

---

## Next Steps

- [Authentication Guide](04-AUTHENTICATION.md)
- [Storage & Email Guide](05-STORAGE.md)
- [API Reference](07-API-REFERENCE.md)
