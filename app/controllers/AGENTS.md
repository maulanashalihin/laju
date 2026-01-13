# Laju Controllers

## Controller Structure

Controllers are exported as **instances**, not classes. Never use `this` inside controllers.

```typescript
class MyController {
   public async myMethod(request: Request, response: Response) {
      // ❌ WRONG: this.anotherMethod()
      // ✅ CORRECT: MyController.anotherMethod() or extract to utility function
   }
}

export default new MyController();
```

## Response Patterns

### Inertia Responses
```typescript
return response.inertia("PageName", { prop1, prop2 });
```

### JSON Responses
```typescript
return response.json({ success: true, data: result });
```

### Redirects
```typescript
return response.redirect("/path");
```

### Error Responses
```typescript
return response.status(401).json({ error: 'Unauthorized' });
return response.status(404).send("Not found");
```

## Authentication Check

Always check if user is authenticated:

```typescript
if (!request.user) {
   return response.status(401).json({ error: 'Unauthorized' });
}
```

## Input Validation

Always validate input before processing:

```typescript
const body = await request.json();
const validated = Validator.validateOrFail(schema, body, response);
if (!validated) return;
```

## Database Operations

### When to use DB vs SQLite

- **DB (Knex)**: Complex queries, joins, transactions, inserts/updates, or when query builder improves readability
- **SQLite**: Simple reads with significant performance gain, especially for high-traffic endpoints

**Performance Note**:
- Native SQLite is 385% faster for `SELECT BY ID` queries
- Native SQLite is 96% faster for `SELECT ALL` queries
- Use SQLite for high-traffic endpoints where performance matters
- Use Knex when readability and maintainability outweigh performance gains

### Loading Single Record

```typescript
import SQLite from "../services/SQLite";
import DB from "../services/DB";

// SQLite - simple reads (faster)
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]);

// DB - when you need query builder
const user = await DB.from("users").where("id", id).first();
```

### Loading Multiple Records

```typescript
// SQLite - simple list
const users = SQLite.all("SELECT * FROM users WHERE active = ?", [1]);

// DB - with ordering, limit
const users = await DB.from("users")
   .where("active", true)
   .orderBy("created_at", "desc")
   .limit(10);
```

### With Joins (DB only)

```typescript
const posts = await DB.from("posts")
   .join("users", "posts.user_id", "users.id")
   .select("posts.*", "users.name as author_name")
   .where("posts.published", true);
```

### Pagination

```typescript
import Cache from "../services/CacheService";

const page = Number(request.query.page) || 1;
const limit = 20;
const offset = (page - 1) * limit;

const cacheKey = `items:page:${page}:limit:${limit}`;

const [items, total] = await Cache.remember(cacheKey, 5, async () => {
   return await Promise.all([
      DB.from("items").limit(limit).offset(offset),
      DB.from("items").count("* as count").first()
   ]);
});

return response.json({
   data: items[0],
   pagination: {
      page,
      limit,
      total: items[1].count
   }
});
```

### Transactions (DB only)

```typescript
await DB.transaction(async (trx) => {
   const [userId] = await trx.from("users").insert(user).returning("id");
   await trx.from("profiles").insert({ user_id: userId, ...profile });
});
```

## User Data Updates

When updating user data, always invalidate cache:

```typescript
import Authenticate from "../services/Authenticate";

await DB.from("users").where("id", userId).update({ name: "New Name" });
await Authenticate.invalidateUserSessions(userId);
```

## Error Handling

Always wrap async operations in try-catch:

```typescript
try {
   // operations
} catch (error) {
   console.error("Error:", error);
   return response.status(500).json({ error: "Internal server error" });
}
```
