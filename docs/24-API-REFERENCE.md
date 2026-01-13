# API Reference

Complete API reference for Laju framework types, methods, and interfaces.

## Table of Contents

1. [Request & Response Types](#request--response-types)
2. [Controller Methods](#controller-methods)
3. [Service APIs](#service-apis)
4. [Middleware Functions](#middleware-functions)
5. [Helper Utilities](#helper-utilities)

---

## Request & Response Types

### Request Interface

Extended HyperExpress Request with additional properties.

```typescript
interface Request extends HyperExpress.Request {
  // User object (populated by auth middleware)
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_admin: boolean;
    is_verified: boolean;
  };
  
  // Shared data for Inertia pages
  share?: {
    user: User;
    [key: string]: any;
  };
  
  // Standard HyperExpress methods
  json(): Promise<any>;
  text(): Promise<string>;
  get(header: string): string | undefined;
  header(name: string): string | undefined;
  cookies: { [key: string]: string };
  params: { [key: string]: string };
  query: { [key: string]: string };
  originalUrl: string;
  method: string;
  ip: string;
  headers: { [key: string]: string };
}
```

### Response Interface

Extended HyperExpress Response with Inertia support.

```typescript
interface Response extends HyperExpress.Response {
  // Inertia.js response
  inertia(component: string, props?: object): Promise<Response>;
  
  // Standard methods
  json(data: any): Response;
  send(data: string | Buffer): Response;
  status(code: number): Response;
  redirect(url: string): Response;
  cookie(name: string, value: string, maxAge?: number): Response;
  setHeader(name: string, value: string): Response;
  type(contentType: string): Response;
}
```

---

## Controller Methods

### Basic Controller Structure

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";

class Controller {
  public async index(request: Request, response: Response) {
    const items = await DB.from("items");
    return response.inertia("items/index", { items });
  }

  public async store(request: Request, response: Response) {
    const data = await request.json();
    await DB.table("items").insert(data);
    return response.redirect("/items");
  }

  public async show(request: Request, response: Response) {
    const { id } = request.params;
    const item = await DB.from("items").where("id", id).first();
    return response.json({ item });
  }

  public async update(request: Request, response: Response) {
    const { id } = request.params;
    const data = await request.json();
    await DB.from("items").where("id", id).update(data);
    return response.json({ success: true });
  }

  public async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await DB.from("items").where("id", id).delete();
    return response.json({ success: true });
  }
}

export default new Controller();
```

---

## Service APIs

### Database (DB)

Knex.js query builder for complex queries.

```typescript
import DB from "app/services/DB";

// Select
const users = await DB.from("users").select("*");
const user = await DB.from("users").where("id", 1).first();

// Insert
await DB.table("users").insert({ name: "John", email: "john@example.com" });

// Update
await DB.from("users").where("id", 1).update({ name: "Jane" });

// Delete
await DB.from("users").where("id", 1).delete();

// Join
const posts = await DB.from("posts")
  .join("users", "posts.user_id", "users.id")
  .select("posts.*", "users.name as author");

// Transaction
await DB.transaction(async (trx) => {
  await trx.table("users").insert({ name: "John" });
  await trx.table("profiles").insert({ user_id: 1 });
});
```

### SQLite (Native)

Direct SQLite queries for better performance.

```typescript
import SQLite from "app/services/SQLite";

// Get single row
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [1]);

// Get all rows
const users = SQLite.all("SELECT * FROM users WHERE active = ?", [true]);

// Execute (INSERT/UPDATE/DELETE)
SQLite.run("INSERT INTO users (name, email) VALUES (?, ?)", ["John", "john@example.com"]);

// Prepared statement
const stmt = SQLite.prepare("SELECT * FROM users WHERE id = ?");
const user = stmt.get(1);
```

### Authentication

```typescript
import Authenticate from "app/services/Authenticate";

// Hash password
const hashed = await Authenticate.hash("password123");

// Compare password
const valid = await Authenticate.compare("password123", hashed);

// Process login (create session)
await Authenticate.process(user, request, response);

// Logout
await Authenticate.logout(request, response);
```

### Mailer

```typescript
import Mailer from "app/services/Mailer";

// Send email
await Mailer.send({
  to: "user@example.com",
  subject: "Welcome",
  html: "<h1>Welcome to our app!</h1>"
});

// Send with template
await Mailer.send({
  to: user.email,
  subject: "Password Reset",
  html: view("emails/reset-password.html", { token, user })
});
```

### Storage (S3)

```typescript
import { getSignedUploadUrl, getPublicUrl, deleteObject } from "app/services/S3";

// Get presigned upload URL
const signedUrl = await getSignedUploadUrl("uploads/file.jpg", "image/jpeg", 3600);

// Get public URL
const publicUrl = getPublicUrl("uploads/file.jpg");

// Delete object
await deleteObject("uploads/file.jpg");
```

### Redis (Optional)

```typescript
import Redis from "app/services/Redis";

// Set value
await Redis.set("key", "value", "EX", 3600); // Expires in 1 hour

// Get value
const value = await Redis.get("key");

// Delete
await Redis.del("key");

// Hash operations
await Redis.hset("user:1", "name", "John");
const name = await Redis.hget("user:1", "name");
```

### Logger

```typescript
import { logInfo, logError, logWarn, logDebug } from "app/services/Logger";

// Info
logInfo("User logged in", { userId: 1, ip: request.ip });

// Error
logError("Database query failed", { error: error.message, query: sql });

// Warning
logWarn("Rate limit approaching", { ip: request.ip, count: 95 });

// Debug
logDebug("Processing item", { itemId: 123 });
```

### View (Eta)

```typescript
import { view } from "app/services/View";

// Render template
const html = view("index.html", { 
  title: "Home", 
  user: { name: "John" } 
});

return response.type("html").send(html);
```

---

## Middleware Functions

### Creating Middleware

```typescript
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  // Your logic
  
  // Continue to next handler (no return)
  request.customData = "value";
  
  // OR stop and send response
  // return response.status(401).json({ error: "Unauthorized" });
}
```

### Built-in Middleware

```typescript
import Auth from "app/middlewares/auth";
import { authRateLimit, apiRateLimit } from "app/middlewares/rateLimit";

// Use in routes
Route.get("/dashboard", [Auth], DashboardController.index);
Route.post("/login", [authRateLimit], AuthController.processLogin);
```

---

## Helper Utilities

### Route Definition

```typescript
import Route from "./routes/Route";

// GET
Route.get("/path", Controller.method);
Route.get("/path", [middleware], Controller.method);

// POST
Route.post("/path", Controller.method);

// PUT/PATCH
Route.put("/path", Controller.method);

// DELETE
Route.delete("/path", Controller.method);

// Route parameters
Route.get("/users/:id", UserController.show);
Route.get("/posts/:id/comments/:commentId", CommentController.show);
```

### Environment Variables

```typescript
// Access environment variables
const dbPath = process.env.DB_PATH;
const apiKey = process.env.API_KEY;
const nodeEnv = process.env.NODE_ENV; // 'development' or 'production'

// Check environment
if (process.env.NODE_ENV === 'production') {
  // Production-only code
}
```

### Date/Time Utilities

```typescript
// Current timestamp (milliseconds)
const now = Date.now();

// Create date
const date = new Date();

// Format date
const formatted = date.toISOString(); // "2025-01-11T12:30:00.000Z"

// Add days
const tomorrow = Date.now() + (24 * 60 * 60 * 1000);

// Subtract days
const yesterday = Date.now() - (24 * 60 * 60 * 1000);
```

### Crypto Utilities

```typescript
import { randomUUID } from "crypto";

// Generate UUID
const id = randomUUID(); // "550e8400-e29b-41d4-a716-446655440000"

// Generate random bytes
import { randomBytes } from "crypto";
const token = randomBytes(32).toString("hex");
```

---

## Type Definitions

### User Type

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: number;
  updated_at: number;
}
```

### Session Type

```typescript
interface Session {
  id: string;
  user_id: number;
  ip: string;
  user_agent: string;
  created_at: number;
  updated_at: number;
}
```

### Inertia Props

```typescript
interface InertiaProps {
  user?: User;
  error?: string;
  [key: string]: any;
}
```

---

## Next Steps

- [Routing & Controllers](04-ROUTING-CONTROLLERS.md) - Learn routing basics
- [Middleware Guide](07-MIDDLEWARE.md) - Create custom middleware
- [Database Guide](03-DATABASE.md) - Database operations
- [Authentication Guide](06-AUTHENTICATION.md) - User authentication
