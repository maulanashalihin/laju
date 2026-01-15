# Laju Migrations

## Migration Structure

Each migration file exports `up()` and `down()` functions:

```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
   // Create table or modify schema
}

export async function down(knex: Knex): Promise<void> {
   // Rollback changes
}
```

## Naming Convention

Use timestamp prefix: `YYYYMMDDHHMMSS_descriptive_name.ts`

Example: `20250113000001_add_expires_at_to_sessions.ts`

## Creating Tables

```typescript
export async function up(knex: Knex): Promise<void> {
   await knex.schema.createTable('table_name', function (table) {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.text('description').nullable();
      table.boolean('is_active').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      // Foreign key
      table.foreign('user_id')
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');
   });
}
```

**After Creating Migration:**
- Remind user to run the migration
- Provide the command: `npx knex migrate:latest`
- Offer to run it for them

**Important Notes:**
- **UUID columns**: Do NOT use `defaultTo(knex.raw('gen_random_uuid()'))` - this is PostgreSQL-specific and causes errors in SQLite
- **UUID generation**: Generate UUIDs in application layer using `uuidv7()` or `uuid()` from the `uuidv7` or `uuid` package
- **Timestamps**: Use `knex.fn.now()` for current timestamp

## Modifying Tables

```typescript
export async function up(knex: Knex): Promise<void> {
   await knex.schema.alterTable('table_name', (table) => {
      table.string('new_column').nullable();
      table.dropColumn('old_column');
   });
}
```

## Rolling Back

The `down()` function should reverse the `up()` changes:

```typescript
export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTable('table_name');
   // OR for alterTable:
   await knex.schema.alterTable('table_name', (table) => {
      table.dropColumn('new_column');
   });
}
```

## Common Column Types

- `table.uuid('id')` - UUID primary key
- `table.string('name', 255)` - VARCHAR
- `table.text('content')` - TEXT
- `table.integer('count')` - INTEGER
- `table.boolean('is_active')` - BOOLEAN
- `table.timestamp('created_at')` - TIMESTAMP
- `table.bigInteger('timestamp')` - BIGINT (Unix timestamp)

## Best Practices

1. **Always provide rollback**: Ensure `down()` reverses `up()`
2. **Use descriptive names**: Make migration names clear
3. **Keep migrations small**: One change per migration when possible
4. **Test migrations**: Run both up and down migrations
5. **Don't modify existing migrations**: Create new ones instead

## Running Migrations

```bash
# Run pending migrations
npx knex migrate:latest

# Rollback last migration
npx knex migrate:rollback

# List migration status
npx knex migrate:status
```
