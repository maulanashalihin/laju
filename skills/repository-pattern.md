# Repository Pattern Guidelines

Repository Pattern = Layer abstraction antara Controller dan Database. Semua query database kompleks ditempatkan di `app/repositories/`.

## Decision Tree: Repository vs Direct DB Access

```
Implementing a feature with database operations
    ↓
Is this a simple CRUD operation (SELECT, INSERT, UPDATE, DELETE basic)?
    ↓ YES
Use DB directly in controller:
  await DB.selectFrom('posts').where('id', '=', id).execute()
    ↓
Done ✅

    ↓ NO (complex query)
Does this query involve JOINs with 3+ tables?
    ↓ YES
Create/use Repository:
  await PostRepository.findWithAuthorAndComments(id)
    ↓
Done ✅

    ↓ NO
Is this same query used in 3+ different controllers?
    ↓ YES
Create/use Repository:
  await UserRepository.findByEmail(email)
    ↓
Done ✅

    ↓ NO
Is this query likely to change schema soon?
    ↓ YES
Create/use Repository
    ↓
Done ✅

    ↓ NO
Use DB directly in controller
    ↓
Done ✅
```

## When to USE Repository

| Scenario | Example | Action |
|----------|---------|--------|
| **Complex JOINs** | Query posts with author, comments, and tags | ✅ Create Repository |
| **Reusable query** | `findByEmail()` used in Login, Register, PasswordReset | ✅ Create Repository |
| **Query aggregation** | Dashboard stats with multiple aggregations | ✅ Create Repository |
| **Likely schema changes** | Feature still in active development | ✅ Create Repository |
| **Testability needed** | Need to mock database for unit tests | ✅ Create Repository |

## When NOT to Use Repository

| Scenario | Example | Action |
|----------|---------|--------|
| **Simple CRUD** | Basic SELECT/INSERT/UPDATE/DELETE | ❌ Use DB directly |
| **One-time query** | Query only used in one controller method | ❌ Use DB directly |
| **Simple WHERE** | `.where('status', '=', 'active')` | ❌ Use DB directly |
| **MVP/Prototype** | Rapid development, quick validation | ❌ Use DB directly |

## Examples

### ❌ DON'T Use Repository (Simple CRUD)

```typescript
// PostController.ts - Simple operations
class PostController {
  async show(request: Request, response: Response) {
    const post = await DB.selectFrom('posts')
      .selectAll()
      .where('id', '=', request.params.id)
      .executeTakeFirst()
    
    return response.inertia('posts/show', { post })
  }
  
  async store(request: Request, response: Response) {
    await DB.insertInto('posts')
      .values({ id: uuidv7(), ...request.body })
      .execute()
    
    return response.redirect('/posts')
  }
}
```

### ✅ USE Repository (Complex Query)

```typescript
// repositories/PostRepository.ts
export class PostRepository {
  static async findWithDetails(id: string) {
    return DB.selectFrom('posts')
      .innerJoin('users', 'posts.user_id', 'users.id')
      .leftJoin('comments', 'posts.id', 'comments.post_id')
      .select([
        'posts.id',
        'posts.title',
        'posts.content',
        'users.name as author_name',
        'users.avatar as author_avatar',
        (eb) => eb.fn.count('comments.id').as('comment_count')
      ])
      .where('posts.id', '=', id)
      .groupBy('posts.id')
      .executeTakeFirst()
  }
  
  static async findByUserWithStats(userId: string) {
    // Complex aggregation query
    return DB.selectFrom('posts')
      .selectAll()
      .select((eb) => [
        eb.fn.count('posts.id').as('total_posts'),
        eb.fn.avg('posts.views').as('avg_views')
      ])
      .where('user_id', '=', userId)
      .execute()
  }
}

// PostController.ts
class PostController {
  async show(request: Request, response: Response) {
    // Use Repository for complex query
    const post = await PostRepository.findWithDetails(request.params.id)
    return response.inertia('posts/show', { post })
  }
}
```

### ✅ USE Repository (Reusable Query)

```typescript
// repositories/UserRepository.ts
export class UserRepository {
  static async findByEmail(email: string) {
    return DB.selectFrom('users')
      .selectAll()
      .where('email', '=', email.toLowerCase())
      .executeTakeFirst()
  }
  
  static async findByPhone(phone: string) {
    return DB.selectFrom('users')
      .selectAll()
      .where('phone', '=', phone)
      .executeTakeFirst()
  }
}

// Used in multiple controllers:
// LoginController.ts, RegisterController.ts, PasswordController.ts
const user = await UserRepository.findByEmail(email)
```

## Repository Naming Convention

- **File**: `app/repositories/{Entity}Repository.ts`
- **Class**: `{Entity}Repository`
- **Methods**: 
  - `findBy{Field}` - Find single by field
  - `findAll` - Find all records
  - `findAllBy{Field}` - Find multiple by field
  - `create` - Insert new record
  - `update` - Update existing record
  - `delete` - Delete record
  - `findWith{Relations}` - Complex query with joins

## Quick Decision Checklist

Before creating a Repository, ask:
1. [ ] Is this query used in 3+ places? → Repository
2. [ ] Does it have JOINs with 3+ tables? → Repository
3. [ ] Does it have complex aggregations? → Repository
4. [ ] Is this a one-time simple query? → Direct DB
5. [ ] Is this for MVP/prototype? → Direct DB

**Default Rule**: Start with Direct DB. Refactor to Repository when needed (when query complexity grows or reuse needed).

## Existing Repositories

Laju has built-in repositories:
- `UserRepository` - User queries (findByEmail, etc.)
- `AssetRepository` - Asset/file queries

Check `app/repositories/` before creating new ones.
