# Kysely - Laju Framework Guide

Type-safe SQL query builder for TypeScript. Used in Laju Framework with SQLite.

## Quick Reference

```typescript
import DB from '../app/services/DB'

// SELECT
const user = await DB.selectFrom('users')
  .selectAll()
  .where('id', '=', id)
  .executeTakeFirst()

// INSERT
await DB.insertInto('users')
  .values({ id: uuidv7(), name: 'John', email: 'john@example.com' })
  .execute()

// UPDATE
await DB.updateTable('users')
  .set({ name: 'Jane' })
  .where('id', '=', id)
  .execute()

// DELETE
await DB.deleteFrom('users')
  .where('id', '=', id)
  .execute()
```

## Basic Queries

### Select

```typescript
// Single record
const user = await DB.selectFrom('users')
  .selectAll()
  .where('id', '=', userId)
  .executeTakeFirst()  // Returns User | undefined

// Multiple records
const users = await DB.selectFrom('users')
  .select(['id', 'name', 'email'])
  .where('status', '=', 'active')
  .orderBy('created_at', 'desc')
  .execute()  // Returns User[]

// With joins
const posts = await DB.selectFrom('posts')
  .innerJoin('users', 'posts.user_id', 'users.id')
  .select(['posts.id', 'posts.title', 'users.name as author'])
  .where('posts.status', '=', 'published')
  .execute()
```

### Insert

```typescript
// Single insert
await DB.insertInto('posts')
  .values({
    id: uuidv7(),
    title: 'Hello World',
    content: 'Content here',
    user_id: userId,
    created_at: Date.now()
  })
  .execute()

// Insert with returning (SQLite 3.35+)
const [post] = await DB.insertInto('posts')
  .values({ id: uuidv7(), title: 'New Post' })
  .returningAll()
  .execute()
```

### Update

```typescript
await DB.updateTable('posts')
  .set({ 
    title: 'Updated Title',
    updated_at: Date.now()
  })
  .where('id', '=', postId)
  .execute()

// Conditional update
await DB.updateTable('users')
  .set({ last_login: Date.now() })
  .where('id', '=', userId)
  .where('status', '=', 'active')
  .execute()
```

### Delete

```typescript
await DB.deleteFrom('posts')
  .where('id', '=', postId)
  .execute()

// Delete with condition
await DB.deleteFrom('sessions')
  .where('expires_at', '<', Date.now())
  .execute()
```

## Common Patterns in Laju

### 1. Check if Record Exists

```typescript
const exists = await DB.selectFrom('users')
  .select('id')
  .where('email', '=', email)
  .executeTakeFirst() !== undefined
```

### 2. Count Records

```typescript
const result = await DB.selectFrom('posts')
  .select((eb) => eb.fn.count('id').as('count'))
  .where('status', '=', 'published')
  .executeTakeFirst()

const count = result?.count ?? 0
```

### 3. Pagination

```typescript
const page = 1
const perPage = 20
const offset = (page - 1) * perPage

const posts = await DB.selectFrom('posts')
  .selectAll()
  .orderBy('created_at', 'desc')
  .limit(perPage)
  .offset(offset)
  .execute()
```

### 4. Conditional Where

```typescript
let query = DB.selectFrom('posts').selectAll()

if (status) {
  query = query.where('status', '=', status)
}

if (userId) {
  query = query.where('user_id', '=', userId)
}

const posts = await query.execute()
```

### 5. Join with Aggregation

```typescript
// Posts with comment count
const posts = await DB.selectFrom('posts')
  .leftJoin('comments', 'posts.id', 'comments.post_id')
  .select([
    'posts.id',
    'posts.title',
    (eb) => eb.fn.count('comments.id').as('comment_count')
  ])
  .groupBy('posts.id')
  .execute()
```

## Transactions

```typescript
import { DB } from '../app/services/DB'

await DB.transaction().execute(async (trx) => {
  // All operations use trx instead of DB
  await trx.insertInto('orders').values({ ... }).execute()
  await trx.updateTable('inventory').set({ ... }).execute()
  await trx.insertInto('order_logs').values({ ... }).execute()
  // Auto-rollback on error
})
```

## Migrations

```typescript
// migrations/20250101_create_posts.ts
import { Kysely, sql } from 'kysely'
import { DatabaseTypes } from '../type/db-types'

export async function up(db: Kysely<DatabaseTypes>): Promise<void> {
  await db.schema
    .createTable('posts')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('content', 'text')
    .addColumn('user_id', 'text', (col) => col.notNull().references('users.id'))
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('draft'))
    .addColumn('created_at', 'integer', (col) => col.notNull())
    .addColumn('updated_at', 'integer')
    .execute()
    
  // Add index
  await db.schema
    .createIndex('posts_user_id_idx')
    .on('posts')
    .column('user_id')
    .execute()
}

export async function down(db: Kysely<DatabaseTypes>): Promise<void> {
  await db.schema.dropTable('posts').execute()
}
```

## Repository Pattern Integration

```typescript
// repositories/PostRepository.ts
import DB from '../services/DB'

export class PostRepository {
  // Complex queries only - simple CRUD use DB directly
  
  static async findWithAuthor(id: string) {
    return DB.selectFrom('posts')
      .innerJoin('users', 'posts.user_id', 'users.id')
      .select([
        'posts.id',
        'posts.title',
        'posts.content',
        'users.name as author_name',
        'users.avatar as author_avatar'
      ])
      .where('posts.id', '=', id)
      .executeTakeFirst()
  }
  
  static async findByUserWithStats(userId: string) {
    return DB.selectFrom('posts')
      .select((eb) => [
        eb.fn.count('id').as('total_posts'),
        eb.fn.avg('views').as('avg_views')
      ])
      .where('user_id', '=', userId)
      .executeTakeFirst()
  }
}
```

## Type Definitions

```typescript
// type/db-types.ts
export interface DatabaseTypes {
  users: {
    id: string
    name: string
    email: string
    password: string
    status: 'active' | 'inactive'
    created_at: number
    updated_at?: number
  }
  posts: {
    id: string
    title: string
    content?: string
    user_id: string
    status: 'draft' | 'published' | 'archived'
    views: number
    created_at: number
    updated_at?: number
  }
  // ... other tables
}
```

## Best Practices

1. **Use Repository for complex queries** (3+ tables, reusable queries)
2. **Use DB directly for simple CRUD** (single table operations)
3. **Always use parameterized queries** - Kysely does this automatically
4. **Use `executeTakeFirst()`** for single results, `execute()` for arrays
5. **Handle undefined** when using `executeTakeFirst()`

## Common Commands

```bash
# Run migrations
npm run migrate

# Rollback
npm run migrate:down
npm run migrate:down 3
npm run migrate:down 20250101000000

# Fresh database
npm run db:fresh
```

## Full Documentation

For advanced features (CTEs, subqueries, raw SQL), see:
https://kysely.dev/docs
