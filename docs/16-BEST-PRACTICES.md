# Best Practices

Guidelines and best practices for building production-ready Laju applications.

## Detailed Guides

For in-depth documentation, see these focused guides:

- **[Security Guide](09a-SECURITY.md)** - Authentication, Validation, SQL Injection, XSS, CSRF
- **[Performance Guide](09b-PERFORMANCE.md)** - Database, Caching, File Uploads, Monitoring

---

## Table of Contents

1. [Code Organization](#code-organization)
2. [Security Guidelines](#security-guidelines)
3. [Performance Tips](#performance-tips)
4. [Error Handling](#error-handling)
5. [Database Best Practices](#database-best-practices)
6. [API Design](#api-design)
7. [Frontend Best Practices](#frontend-best-practices)
8. [Testing Strategies](#testing-strategies)
9. [Logging & Monitoring](#logging--monitoring)
10. [Deployment Practices](#deployment-practices)

---

## Code Organization

### Controller Structure

✅ **DO: Keep controllers thin**

```typescript
// ✅ Good - Controller delegates to services
class PostController {
  public async store(request: Request, response: Response) {
    const data = await request.json();
    const post = await PostService.create(data);
    return response.json({ success: true, data: post });
  }
}
```

❌ **DON'T: Put business logic in controllers**

```typescript
// ❌ Bad - Business logic in controller
class PostController {
  public async store(request: Request, response: Response) {
    const data = await request.json();
    // Validation logic
    if (!data.title) throw new Error("Title required");
    // Business logic
    const slug = data.title.toLowerCase().replace(/\s/g, '-');
    // Database logic
    const post = await DB.table("posts").insert({ ...data, slug });
    return response.json(post);
  }
}
```

### Service Layer

✅ **DO: Create reusable services**

```typescript
// app/services/PostService.ts
class PostService {
  async create(data: PostData) {
    this.validate(data);
    const slug = this.generateSlug(data.title);
    return await DB.table("posts").insert({ ...data, slug });
  }
  
  private validate(data: PostData) {
    if (!data.title) throw new Error("Title required");
    if (!data.content) throw new Error("Content required");
  }
  
  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/\s/g, '-');
  }
}

export default new PostService();
```

### File Naming

✅ **DO: Use consistent naming conventions**

```
Controllers:  PascalCase + Controller.ts  (AuthController.ts)
Services:     PascalCase.ts               (Authenticate.ts, DB.ts)
Middleware:   camelCase.ts                (auth.ts, rateLimit.ts)
Components:   PascalCase.svelte           (Header.svelte)
Pages:        kebab-case.svelte           (forgot-password.svelte)
```

### Import Organization

✅ **DO: Use absolute imports**

```typescript
// ✅ Good
import DB from "app/services/DB";
import AuthController from "app/controllers/AuthController";
import { Request, Response } from "type";
```

❌ **DON'T: Use relative imports**

```typescript
// ❌ Bad
import DB from "../../app/services/DB";
import AuthController from "../controllers/AuthController";
```

---

## Security Guidelines

### Password Security

✅ **DO: Use strong password hashing**

```typescript
// ✅ Good - PBKDF2 with 100,000 iterations
const hashedPassword = await Authenticate.hash(password);
```

❌ **DON'T: Use weak hashing**

```typescript
// ❌ Bad - bcrypt with low rounds or plain MD5
const hash = crypto.createHash('md5').update(password).digest('hex');
```

### Input Validation

✅ **DO: Validate all user input**

```typescript
// ✅ Good
public async store(request: Request, response: Response) {
  const { email, password } = await request.json();
  
  // Validate
  if (!email || !this.isValidEmail(email)) {
    return response.status(400).json({ error: "Invalid email" });
  }
  
  if (!password || password.length < 8) {
    return response.status(400).json({ 
      error: "Password must be at least 8 characters" 
    });
  }
  
  // Process...
}
```

### SQL Injection Prevention

✅ **DO: Use parameterized queries**

```typescript
// ✅ Good - Parameterized
const user = await DB.from("users")
  .where("email", email)
  .first();

const user = SQLite.get(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

❌ **DON'T: Concatenate SQL strings**

```typescript
// ❌ Bad - SQL injection vulnerability
const user = SQLite.get(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

### XSS Prevention

✅ **DO: Sanitize output in templates**

```html
<!-- ✅ Good - Eta auto-escapes -->
<p><%= it.userInput %></p>

<!-- Svelte auto-escapes -->
<p>{userInput}</p>
```

❌ **DON'T: Use raw HTML without sanitization**

```html
<!-- ❌ Bad - XSS vulnerability -->
<p>{@html userInput}</p>
```

### Environment Variables

✅ **DO: Never commit secrets**

```env
# .env (in .gitignore)
WASABI_SECRET_KEY=your_secret_key
GOOGLE_CLIENT_SECRET=your_client_secret
```

❌ **DON'T: Hardcode secrets**

```typescript
// ❌ Bad
const apiKey = "sk_live_abc123xyz";
```

### Rate Limiting

✅ **DO: Protect sensitive endpoints**

```typescript
// ✅ Good
Route.post("/login", [authRateLimit], AuthController.processLogin);
Route.post("/register", [createAccountRateLimit], AuthController.processRegister);
Route.post("/api/s3/signed-url", [Auth, uploadRateLimit], S3Controller.getSignedUrl);
```

### CORS Configuration

✅ **DO: Configure CORS properly**

```typescript
// ✅ Good - Specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com'
    : '*',
  credentials: true
};
webserver.use(cors(corsOptions));
```

---

## Performance Tips

### Database Queries

✅ **DO: Use Native SQLite for reads**

```typescript
// ✅ Good - 385% faster for single reads
const user = SQLite.get(
  "SELECT * FROM users WHERE id = ?",
  [userId]
);
```

✅ **DO: Use indexes for frequently queried columns**

```typescript
// Migration
table.string('email').notNullable().unique();
table.index('email'); // Add index
```

✅ **DO: Use transactions for multiple operations**

```typescript
// ✅ Good - Atomic operations
await DB.transaction(async (trx) => {
  const userId = await trx.table("users").insert({ name });
  await trx.table("profiles").insert({ user_id: userId });
});
```

❌ **DON'T: Make N+1 queries**

```typescript
// ❌ Bad - N+1 query problem
const posts = await DB.from("posts").select("*");
for (const post of posts) {
  post.author = await DB.from("users").where("id", post.user_id).first();
}

// ✅ Good - Single query with JOIN
const posts = await DB.from("posts")
  .join("users", "posts.user_id", "users.id")
  .select("posts.*", "users.name as author");
```

### Caching

✅ **DO: Cache frequently accessed data**

```typescript
// ✅ Good - Cache user data
async function getUser(id: number) {
  const cached = await Redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  
  const user = await DB.from("users").where("id", id).first();
  await Redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600);
  
  return user;
}
```

### File Uploads

✅ **DO: Use presigned URLs for S3 uploads**

```typescript
// ✅ Good - Direct upload to S3
const signedUrl = await getSignedUploadUrl(key, contentType, 3600);
// Client uploads directly to S3
```

❌ **DON'T: Proxy uploads through your server**

```typescript
// ❌ Bad - Server becomes bottleneck
const buffer = await request.buffer();
await uploadBuffer(key, buffer, contentType);
```

### Memory Management

✅ **DO: Stream large files**

```typescript
// ✅ Good - Stream response
const response = await getObject(key);
return response.Body.pipe(res);
```

❌ **DON'T: Load entire file into memory**

```typescript
// ❌ Bad - Memory intensive
const response = await getObject(key);
const buffer = await response.Body.transformToByteArray();
return res.send(buffer);
```

---

## Error Handling

### Consistent Error Responses

✅ **DO: Return consistent error format**

```typescript
// ✅ Good
return response.status(400).json({
  error: "Validation failed",
  details: {
    email: "Email is required",
    password: "Password must be at least 8 characters"
  }
});
```

### Try-Catch Blocks

✅ **DO: Handle errors gracefully**

```typescript
// ✅ Good
public async store(request: Request, response: Response) {
  try {
    const data = await request.json();
    const post = await PostService.create(data);
    return response.json({ success: true, data: post });
  } catch (error) {
    Logger.error("Failed to create post", { error: error.message });
    return response.status(500).json({ 
      error: "Failed to create post" 
    });
  }
}
```

### Global Error Handler

✅ **DO: Use global error handler**

```typescript
// server.ts
webserver.set_error_handler((request, response, error) => {
  Logger.error("Unhandled error", { 
    error: error.message,
    stack: error.stack,
    url: request.originalUrl
  });
  
  if (error.code === "SQLITE_ERROR") {
    return response.status(500).json({ 
      error: "Database error" 
    });
  }
  
  return response.status(500).json({ 
    error: "Internal server error" 
  });
});
```

---

## Database Best Practices

### Schema Design

✅ **DO: Use appropriate data types**

```typescript
// ✅ Good
table.increments('id').primary();
table.string('email', 255).notNullable().unique();
table.text('content').notNullable();
table.integer('views').defaultTo(0);
table.boolean('is_active').defaultTo(true);
table.bigInteger('created_at').notNullable();
```

✅ **DO: Add indexes for performance**

```typescript
// ✅ Good
table.index('email');
table.index('created_at');
table.index(['user_id', 'status']); // Composite index
```

✅ **DO: Use foreign keys**

```typescript
// ✅ Good
table.integer('user_id')
  .unsigned()
  .notNullable()
  .references('id')
  .inTable('users')
  .onDelete('CASCADE');
```

### Migrations

✅ **DO: Make migrations reversible**

```typescript
// ✅ Good
export async function up(knex: Knex) {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('posts');
}
```

✅ **DO: Use timestamps**

```typescript
// ✅ Good
table.bigInteger('created_at').notNullable();
table.bigInteger('updated_at').notNullable();

// When inserting
await DB.table("posts").insert({
  title: "Hello",
  created_at: Date.now(),
  updated_at: Date.now()
});
```

---

## API Design

### RESTful Routes

✅ **DO: Follow REST conventions**

```typescript
// ✅ Good
Route.get("/posts", PostController.index);           // List
Route.get("/posts/create", PostController.create);   // Create form
Route.post("/posts", PostController.store);          // Store
Route.get("/posts/:id", PostController.show);        // Show
Route.get("/posts/:id/edit", PostController.edit);   // Edit form
Route.put("/posts/:id", PostController.update);      // Update
Route.delete("/posts/:id", PostController.destroy);  // Delete
```

### Response Format

✅ **DO: Use consistent response structure**

```typescript
// ✅ Good - Success
{
  success: true,
  data: { id: 1, name: "John" }
}

// ✅ Good - Error
{
  error: "Validation failed",
  details: { email: "Email is required" }
}

// ✅ Good - List with pagination
{
  success: true,
  data: [...],
  meta: {
    total: 100,
    page: 1,
    per_page: 10
  }
}
```

### Status Codes

✅ **DO: Use appropriate HTTP status codes**

```typescript
// Success
200 OK              // Successful GET, PUT, DELETE
201 Created         // Successful POST
204 No Content      // Successful DELETE with no body

// Client Errors
400 Bad Request     // Invalid input
401 Unauthorized    // Not authenticated
403 Forbidden       // Not authorized
404 Not Found       // Resource not found
422 Unprocessable   // Validation failed
429 Too Many        // Rate limit exceeded

// Server Errors
500 Internal Error  // Server error
503 Unavailable     // Service down
```

---

## Frontend Best Practices

### Component Structure

✅ **DO: Keep components focused**

```svelte
<!-- ✅ Good - Single responsibility -->
<script>
  export let user;
</script>

<div class="user-card">
  <img src={user.avatar} alt={user.name} />
  <h3>{user.name}</h3>
  <p>{user.email}</p>
</div>
```

### State Management

✅ **DO: Use Svelte stores for shared state**

```javascript
// stores.js
import { writable } from 'svelte/store';

export const user = writable(null);
export const theme = writable('light');
```

### Props Validation

✅ **DO: Validate component props**

```svelte
<script>
  export let title = "Default Title";
  export let count = 0;
  export let items = [];
  
  // Validate
  $: if (count < 0) count = 0;
</script>
```

---

## Testing Strategies

### Unit Tests

✅ **DO: Test business logic**

```typescript
// tests/unit/services/PostService.test.ts
describe('PostService', () => {
  it('should generate slug from title', () => {
    const slug = PostService.generateSlug('Hello World');
    expect(slug).toBe('hello-world');
  });
});
```

### Integration Tests

✅ **DO: Test API endpoints**

```typescript
// tests/integration/auth.test.ts
describe('POST /login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

---

## Logging & Monitoring

### Structured Logging

✅ **DO: Use structured logs**

```typescript
// ✅ Good
Logger.info("User logged in", {
  userId: user.id,
  email: user.email,
  ip: request.ip
});

Logger.error("Database query failed", {
  query: sql,
  error: error.message,
  stack: error.stack
});
```

❌ **DON'T: Use console.log in production**

```typescript
// ❌ Bad
console.log("User logged in:", user.id);
```

### Log Levels

✅ **DO: Use appropriate log levels**

```typescript
Logger.error()   // Errors that need immediate attention
Logger.warn()    // Warning conditions
Logger.info()    // Informational messages
Logger.debug()   // Debug information (development only)
```

---

## Deployment Practices

### Environment-Specific Configuration

✅ **DO: Use environment variables**

```typescript
// ✅ Good
const dbPath = process.env.NODE_ENV === 'production'
  ? '../data/production.sqlite3'
  : './data/dev.sqlite3';
```

### Health Checks

✅ **DO: Implement health check endpoint**

```typescript
// ✅ Good
Route.get("/health", async (request, response) => {
  const dbStatus = await checkDatabase();
  const redisStatus = await checkRedis();
  
  return response.json({
    status: "ok",
    database: dbStatus,
    redis: redisStatus,
    uptime: process.uptime()
  });
});
```

### Graceful Shutdown

✅ **DO: Handle shutdown signals**

```typescript
// ✅ Good
process.on("SIGTERM", async () => {
  Logger.info("SIGTERM received, shutting down gracefully");
  await closeDatabase();
  await closeRedis();
  process.exit(0);
});
```

---

## Summary Checklist

### Security
- [ ] Use PBKDF2 for password hashing
- [ ] Validate all user input
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Configure CORS properly
- [ ] Never commit secrets

### Performance
- [ ] Use Native SQLite for reads
- [ ] Add database indexes
- [ ] Implement caching
- [ ] Use presigned URLs for uploads
- [ ] Enable WAL mode
- [ ] Use transactions for bulk operations

### Code Quality
- [ ] Keep controllers thin
- [ ] Create reusable services
- [ ] Use consistent naming
- [ ] Handle errors gracefully
- [ ] Write tests
- [ ] Use structured logging

### Deployment
- [ ] Use environment variables
- [ ] Implement health checks
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Use PM2 cluster mode
- [ ] Enable HTTPS

---

## Next Steps

- [Deployment Guide](08-DEPLOYMENT.md)
- [Testing Guide](14-TESTING.md)
- [API Reference](07-API-REFERENCE.md)
