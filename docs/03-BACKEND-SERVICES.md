# Backend Services Guide

Complete reference for all backend services in Laju framework.

## Table of Contents

1. [Database Services](#database-services)
2. [Authentication Service](#authentication-service)
3. [Storage Service (S3)](#storage-service-s3)
4. [Email Services](#email-services)
5. [View Service](#view-service)
6. [Logging Service](#logging-service)
7. [Rate Limiter](#rate-limiter)
8. [Redis Cache](#redis-cache)

---

## Database Services

Laju provides two database services: Knex.js for query building and native SQLite for maximum performance.

### DB Service (Knex.js) - `app/services/DB.ts`

Query builder with SQLite WAL optimizations.

#### Configuration

```typescript
// knexfile.ts
const config = {
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
      filename: "../data/production.sqlite3"
    },
    useNullAsDefault: true
  }
};
```

#### Usage Examples

```typescript
import DB from "app/services/DB";

// SELECT queries
const users = await DB.from("users").select("*");
const user = await DB.from("users").where("email", email).first();
const activeUsers = await DB.from("users").where("is_active", true);

// INSERT
await DB.table("posts").insert({
  title: "Hello World",
  content: "Post content",
  created_at: Date.now(),
  updated_at: Date.now()
});

// INSERT with returning ID
const [id] = await DB.table("users").insert({
  name: "John Doe",
  email: "john@example.com"
}).returning("id");

// UPDATE
await DB.table("users")
  .where("id", userId)
  .update({
    name: "New Name",
    updated_at: Date.now()
  });

// DELETE
await DB.from("sessions")
  .where("id", sessionId)
  .delete();

// JOIN
const posts = await DB.from("posts")
  .join("users", "posts.user_id", "users.id")
  .select("posts.*", "users.name as author");

// WHERE conditions
const results = await DB.from("posts")
  .where("status", "published")
  .where("views", ">", 1000)
  .orderBy("created_at", "desc")
  .limit(10);

// OR WHERE
const results = await DB.from("users")
  .where("role", "admin")
  .orWhere("role", "moderator");

// WHERE IN
const results = await DB.from("posts")
  .whereIn("category_id", [1, 2, 3]);

// LIKE search
const results = await DB.from("users")
  .where("name", "like", "%john%");

// COUNT
const count = await DB.from("users").count("* as total");

// Transactions
await DB.transaction(async (trx) => {
  const userId = await trx.table("users").insert({ name: "John" });
  await trx.table("profiles").insert({ user_id: userId });
});

// Raw queries
const results = await DB.raw("SELECT * FROM users WHERE email = ?", [email]);

// Multiple database connections
const stagingDB = DB.connection("staging");
const users = await stagingDB.from("users").select("*");
```

#### Performance Tips

- WAL mode enabled by default (19.9x faster writes)
- Use `.first()` instead of `.limit(1)` for single records
- Batch inserts for better performance
- Use transactions for multiple related operations
- Index frequently queried columns

---

### SQLite Service (Native) - `app/services/SQLite.ts`

Direct better-sqlite3 access for maximum performance (2-4x faster reads).

#### Usage Examples

```typescript
import SQLite from "app/services/SQLite";

// Get single row (385% faster than Knex)
const user = SQLite.get(
  'SELECT * FROM users WHERE email = ?',
  ['user@example.com']
);

// Get all rows (96% faster than Knex)
const posts = SQLite.all(
  'SELECT * FROM posts ORDER BY created_at DESC'
);

// Execute without returning rows
const result = SQLite.run(
  'INSERT INTO posts (title, content) VALUES (?, ?)',
  ['Title', 'Content']
);
console.log('Inserted ID:', result.lastInsertRowid);
console.log('Changes:', result.changes);

// Prepared statements for bulk operations
const insert = SQLite.prepare('INSERT INTO logs (message) VALUES (?)');
for (const msg of messages) {
  insert.run(msg);
}

// Transactions
const insertMany = SQLite.transaction((items) => {
  const insert = SQLite.prepare('INSERT INTO items (name) VALUES (?)');
  for (const item of items) {
    insert.run(item.name);
  }
});
insertMany(items);

// Complex queries
const stats = SQLite.get(`
  SELECT 
    COUNT(*) as total,
    AVG(views) as avg_views,
    MAX(views) as max_views
  FROM posts
  WHERE status = ?
`, ['published']);
```

#### When to Use Native SQLite

✅ **Use Native SQLite for:**
- High-performance read operations (2-4x faster)
- Simple CRUD operations
- Performance-critical paths
- Bulk operations with prepared statements
- Direct SQL control

❌ **Use Knex.js for:**
- Complex query building
- Database migrations
- Cross-database compatibility
- Developer productivity with query builder syntax

---

## Authentication Service

### Authenticate Service - `app/services/Authenticate.ts`

Secure password hashing and session management using PBKDF2.

#### Configuration

```typescript
// PBKDF2 settings
const ITERATIONS = 100000;  // 100,000 iterations
const KEYLEN = 64;          // 64-byte key
const DIGEST = 'sha512';    // SHA-512 hashing
const SALT_SIZE = 16;       // 16-byte salt
```

#### Methods

```typescript
import Authenticate from "app/services/Authenticate";

// Hash password
const hashedPassword = await Authenticate.hash("mypassword123");
// Returns: "salt:hash" format
// Example: "a1b2c3d4e5f6:9f8e7d6c5b4a3..."

// Verify password
const isValid = await Authenticate.compare(
  "mypassword123",
  hashedPassword
);
// Returns: true or false

// Create session (login)
await Authenticate.process(user, request, response);
// - Generates UUID session token
// - Stores in sessions table
// - Sets auth_id cookie (60-day expiration)
// - Redirects to /home

// Destroy session (logout)
await Authenticate.logout(request, response);
// - Deletes session from database
// - Clears auth_id cookie
// - Redirects to /login
```

#### Usage in Controller

```typescript
// Registration
const hashedPassword = await Authenticate.hash(password);
await DB.table("users").insert({
  name,
  email,
  password: hashedPassword,
  created_at: Date.now()
});

// Login
const user = await DB.from("users")
  .where("email", email)
  .first();

if (!user) {
  return response.status(401).json({ error: "Invalid credentials" });
}

const valid = await Authenticate.compare(password, user.password);
if (!valid) {
  return response.status(401).json({ error: "Invalid credentials" });
}

await Authenticate.process(user, request, response);

// Logout
await Authenticate.logout(request, response);
```

#### Security Features

- **PBKDF2** with 100,000 iterations (OWASP recommended)
- **SHA-512** hashing algorithm
- **Random salt** per password (16 bytes)
- **Secure session tokens** (UUID v4)
- **HttpOnly cookies** (prevents XSS)
- **60-day session expiration**

---

## Storage Service (S3)

### S3 Service - `app/services/S3.ts`

Wasabi/S3 integration with presigned URLs for secure, direct uploads.

#### Configuration

```env
# .env
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=https://cdn.example.com  # Optional
```

#### Methods

```typescript
import { 
  uploadBuffer, 
  getSignedUploadUrl, 
  getPublicUrl,
  getObject,
  deleteObject,
  exists
} from "app/services/S3";

// Upload buffer directly
await uploadBuffer(
  'assets/photo.jpg',      // key
  buffer,                  // file buffer
  'image/jpeg',            // content type
  'public, max-age=31536000' // cache control (optional)
);

// Generate presigned upload URL (recommended)
const signedUrl = await getSignedUploadUrl(
  'assets/photo.jpg',      // key
  'image/jpeg',            // content type
  3600                     // expiration in seconds (1 hour)
);

// Get public URL
const publicUrl = getPublicUrl('assets/photo.jpg');
// Returns: https://cdn.example.com/laju-dev/assets/photo.jpg
// Or: https://s3.ap-southeast-1.wasabisys.com/laju-dev/assets/photo.jpg

// Download file
const response = await getObject('assets/photo.jpg');
const stream = response.Body;

// Delete file
await deleteObject('assets/photo.jpg');

// Check if file exists
const fileExists = await exists('assets/photo.jpg');
```

#### Presigned URL Upload Flow

**Server-side (Controller):**

```typescript
// app/controllers/S3Controller.ts
public async getSignedUrl(request: Request, response: Response) {
  const { filename, contentType } = await request.json();
  
  // Generate unique key
  const key = `assets/${Date.now()}-${filename}`;
  
  // Generate presigned URL
  const signedUrl = await getSignedUploadUrl(key, contentType, 3600);
  const publicUrl = getPublicUrl(key);
  
  return response.json({
    success: true,
    data: {
      signedUrl,   // Use this to upload
      publicUrl,   // Use this to display
      fileKey: key,
      expiresIn: 3600
    }
  });
}
```

**Client-side (Svelte):**

```javascript
// Upload file to S3
async function uploadToS3(file) {
  // 1. Request signed URL from server
  const res = await fetch('/api/s3/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type
    })
  });
  
  const { data } = await res.json();
  
  // 2. Upload directly to S3 via PUT
  await fetch(data.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });
  
  // 3. Use publicUrl to display or save to database
  return data.publicUrl;
}
```

#### Benefits of Presigned URLs

✅ **Reduced server load** - Files upload directly to S3  
✅ **Better performance** - No proxy through your server  
✅ **Secure** - Time-limited, signed URLs  
✅ **Scalable** - Handle unlimited concurrent uploads  

---

## Email Services

Laju provides two email services: Nodemailer (SMTP) and Resend (API).

### Mailer Service (Nodemailer) - `app/services/Mailer.ts`

SMTP email via Gmail or other providers.

#### Configuration

```env
# .env
USER_MAILER=your.email@gmail.com
PASS_MAILER=your-app-password  # Gmail App Password
MAIL_FROM_NAME=Your App Name
MAIL_FROM_ADDRESS=noreply@yourapp.com
```

#### Gmail Setup

1. Enable 2-Step Verification in Google Account
2. Go to Security → 2-Step Verification → App passwords
3. Generate app password for "Mail"
4. Use the 16-character password in `.env`

#### Usage

```typescript
import { MailTo } from "app/services/Mailer";

// Send email
await MailTo({
  to: "user@example.com",
  subject: "Welcome to Laju!",
  text: "Thank you for signing up..."
});

// Password reset email
await MailTo({
  to: user.email,
  subject: "Password Reset Request",
  text: `Click here to reset your password: ${resetLink}`
});

// Email verification
await MailTo({
  to: user.email,
  subject: "Verify Your Email",
  text: `Click here to verify: ${verificationLink}`
});
```

---

### Resend Service - `app/services/Resend.ts`

Modern email API (alternative to SMTP).

#### Configuration

```env
# .env
RESEND_API_KEY=re_xxxxxxxxxxxxx
MAIL_FROM_ADDRESS=noreply@yourapp.com
```

#### Usage

```typescript
import { MailTo } from "app/services/Resend";

await MailTo({
  to: "user@example.com",
  subject: "Welcome!",
  text: "Thank you for signing up..."
});
```

#### Switching Email Providers

Both services use the same `MailTo` interface, so you can easily switch:

```typescript
// Option 1: Use Nodemailer
import { MailTo } from "app/services/Mailer";

// Option 2: Use Resend
import { MailTo } from "app/services/Resend";

// Same usage for both
await MailTo({ to, subject, text });
```

---

## View Service

### View Service - `app/services/View.ts`

Squirrelly template engine with hot reload in development.

#### Template Syntax

```html
<!-- resources/views/hello.html -->
<!doctype html>
<html>
<head>
  <title>{{it.title}}</title>
</head>
<body>
  {{@include('partials/header.html')}}
  
  <h1>Hello, {{it.name}}!</h1>
  
  {{@if(it.isAdmin)}}
    <p>Admin panel</p>
  {{/if}}
  
  {{@each(it.posts) => post}}
    <article>
      <h2>{{post.title}}</h2>
      <p>{{post.content}}</p>
    </article>
  {{/each}}
</body>
</html>
```

#### Usage

```typescript
import { view } from "app/services/View";

// Render template
const html = view("hello.html", {
  title: "Welcome",
  name: "John",
  isAdmin: true,
  posts: [
    { title: "Post 1", content: "Content 1" },
    { title: "Post 2", content: "Content 2" }
  ]
});

response.type("html").send(html);
```

#### Features

- **Hot reload** in development (watches `resources/views`)
- **Partials** support for reusable components
- **Auto asset paths** (Vite dev server in development)
- **Fast compilation** (Squirrelly is 10x faster than EJS)

---

## Logging Service

### Logger Service - `app/services/Logger.ts`

Winston-based logging with file rotation.

#### Usage

```typescript
import Logger from "app/services/Logger";

// Info logs
Logger.info("User logged in", { userId: 123 });

// Error logs
Logger.error("Database connection failed", { error: err.message });

// Warning logs
Logger.warn("Rate limit exceeded", { ip: request.ip });

// Debug logs (only in development)
Logger.debug("Query executed", { sql, params });
```

#### Log Levels

```
error: 0
warn: 1
info: 2
http: 3
verbose: 4
debug: 5
silly: 6
```

Set log level in `.env`:

```env
LOG_LEVEL=info  # production
LOG_LEVEL=debug # development
```

---

## Rate Limiter

### RateLimiter Service - `app/services/RateLimiter.ts`

Memory-based rate limiting to prevent abuse.

#### Predefined Limits

```typescript
// app/middlewares/rateLimit.ts

// Authentication endpoints (login, register)
export const authRateLimit = createRateLimiter({
  windowMs: 60 * 1000,        // 1 minute
  max: 5,                     // 5 requests per minute
  message: "Too many attempts, please try again later"
});

// General API endpoints
export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000,        // 1 minute
  max: 60,                    // 60 requests per minute
  message: "Rate limit exceeded"
});

// Password reset
export const passwordResetRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 3,                     // 3 requests per 15 minutes
  message: "Too many password reset attempts"
});

// Account creation
export const createAccountRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 3,                     // 3 accounts per hour
  message: "Too many accounts created"
});

// File uploads
export const uploadRateLimit = createRateLimiter({
  windowMs: 60 * 1000,        // 1 minute
  max: 10,                    // 10 uploads per minute
  message: "Upload rate limit exceeded"
});
```

#### Usage in Routes

```typescript
import { authRateLimit, apiRateLimit } from "../app/middlewares/rateLimit";

// Apply to specific routes
Route.post("/login", [authRateLimit], AuthController.processLogin);
Route.post("/api/data", [apiRateLimit], DataController.getData);
```

---

## Redis Cache

### Redis Service - `app/services/Redis.ts`

Optional Redis caching for improved performance.

#### Configuration

```env
# .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional
```

#### Usage

```typescript
import Redis from "app/services/Redis";

// Set cache
await Redis.set("user:123", JSON.stringify(user), "EX", 3600); // 1 hour

// Get cache
const cached = await Redis.get("user:123");
const user = JSON.parse(cached);

// Delete cache
await Redis.del("user:123");

// Check if exists
const exists = await Redis.exists("user:123");

// Set with expiration
await Redis.setex("session:abc", 3600, sessionData);

// Increment counter
await Redis.incr("page:views");
```

#### Caching Patterns

```typescript
// Cache-aside pattern
async function getUser(id) {
  // Try cache first
  const cached = await Redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Cache miss - fetch from database
  const user = await DB.from("users").where("id", id).first();
  
  // Store in cache
  await Redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600);
  
  return user;
}
```

---

## Next Steps

- [Frontend Development](04-FRONTEND-DEVELOPMENT.md)
- [Database Management](05-DATABASE.md)
- [Authentication System](06-AUTHENTICATION.md)
- [API Reference](07-API-REFERENCE.md)
