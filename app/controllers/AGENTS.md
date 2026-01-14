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
// Default 302 (Found) - for GET requests
return response.redirect("/path");

// 303 (See Other) - for POST/PUT/PATCH form submissions
return response.redirect("/path", 303);

// 301 (Moved Permanently) - for permanent redirects
return response.redirect("/new-path", 301);

// 307 (Temporary Redirect) - for method preservation
return response.redirect("/submit", 307);
```

**⚠️ IMPORTANT**: Always use 303 for form submissions (POST, PUT, PATCH) to prevent browsers from changing the HTTP method.

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

### Validation with Flash Messages (Recommended for Inertia Forms)

**⚠️ IMPORTANT**: For Inertia forms, use `validate()` instead of `validateOrFail()` to avoid JSON response modal errors.

```typescript
const body = await request.json();
const validationResult = Validator.validate(schema, body);

if (!validationResult.success) {
   const errors = validationResult.errors || {};
   const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
   return response
      .flash("error", firstError)
      .redirect("/path");
}

const { email, password } = validationResult.data!;
```

### Validation with JSON Response (For API Endpoints)

```typescript
const body = await request.json();
const validated = Validator.validateOrFail(schema, body, response);
if (!validated) return;
```

## Database Operations

### When to use DB vs SQLite

- **DB (Knex)**: Complex queries, joins, transactions, inserts/updates, or when query builder improves readability
- **SQLite**: Simple reads with significant performance gain, especially for high-traffic endpoints

**Performance**: SQLite is 385% faster for `SELECT BY ID` and 96% faster for `SELECT ALL` queries.

### Loading Records
```typescript
// SQLite - simple reads (faster)
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]);
const users = SQLite.all("SELECT * FROM users WHERE active = ?", [1]);

// DB - with query builder
const user = await DB.from("users").where("id", id).first();
const users = await DB.from("users").where("active", true).orderBy("created_at", "desc").limit(10);
```

### Joins (DB only)
```typescript
const posts = await DB.from("posts")
   .join("users", "posts.user_id", "users.id")
   .select("posts.*", "users.name as author_name")
   .where("posts.published", true);
```  

## User Data Updates

When updating user data, always invalidate cache:

```typescript
import Authenticate from "../services/Authenticate";

await DB.from("users").where("id", userId).update({ name: "New Name" });
await Authenticate.invalidateUserSessions(userId);
```

## Error Handling

### Flash Messages

Use flash messages for validation and authentication errors:

```typescript
return response.flash("error", "Email sudah terdaftar").redirect("/path");
```

Supported types: `error`, `success`, `info`, `warning`

### Error Handling Pattern

```typescript
public async processRequest(request: Request, response: Response) {
   try {
      const body = await request.json();
      
      // Validation
      const validationResult = Validator.validate(schema, body);
      if (!validationResult.success) {
         const errors = validationResult.errors || {};
         const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
         return response.flash("error", firstError).redirect("/path", 303);
      }
      
      // Business logic
      const { email } = validationResult.data!;
      
      // Database operations
      const existing = await DB.from("users").where("email", email).first();
      if (existing) {
         return response.flash("error", "Email sudah terdaftar").redirect("/path", 303);
      }
      
      // Success
      return response.flash("success", "Success!").redirect("/path", 303);
      
   } catch (error: any) {
      console.error("Error:", error);
      if (error.code === 'SQLITE_CONSTRAINT') {
         return response.flash("error", "Data sudah ada").redirect("/path", 303);
      }
      return response.flash("error", "Terjadi kesalahan. Silakan coba lagi nanti.").redirect("/path", 303);
   }
}
```

### JSON Error Responses (For API Endpoints)
```typescript
try {
   // operations
} catch (error) {
   console.error("Error:", error);
   return response.status(500).json({ error: "Internal server error" });
}
```
