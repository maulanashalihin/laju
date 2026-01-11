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

#### Usage Examples

```typescript
// Get request body
const { email, password } = await request.json();

// Get query parameters
const page = request.query.page || 1;

// Get route parameters
const userId = request.params.id;

// Get headers
const userAgent = request.get("user-agent");
const authHeader = request.header("authorization");

// Get cookies
const sessionId = request.cookies.auth_id;

// Access authenticated user
if (request.user) {
  console.log(request.user.name);
  console.log(request.user.is_admin);
}

// Get client IP
const clientIp = request.ip;

// Get request method
const method = request.method; // GET, POST, PUT, DELETE, etc.
```

---

### Response Interface

Extended HyperExpress Response with Inertia support.

```typescript
interface Response extends HyperExpress.Response {
  // Inertia.js rendering
  inertia(component: string, props?: object, viewProps?: object): Promise<void>;
  
  // Standard HyperExpress methods
  json(data: any): Response;
  send(data: string | Buffer): Response;
  status(code: number): Response;
  type(contentType: string): Response;
  redirect(url: string): Response;
  cookie(name: string, value: string, maxAge?: number): Response;
  setHeader(name: string, value: string): Response;
  end(): void;
}
```

#### Usage Examples

```typescript
// JSON response
return response.json({
  success: true,
  data: { id: 123, name: "John" }
});

// JSON with status code
return response.status(201).json({
  message: "Created successfully"
});

// Error response
return response.status(400).json({
  error: "Invalid input"
});

// Inertia page
return response.inertia("posts/index", {
  posts: posts,
  total: count
});

// HTML response
const html = view("welcome.html", { title: "Welcome" });
return response.type("html").send(html);

// Redirect
return response.redirect("/home");

// Set cookie
response.cookie("theme", "dark", 1000 * 60 * 60 * 24 * 365); // 1 year

// Set header
response.setHeader("X-Custom-Header", "value");

// Multiple operations
return response
  .status(200)
  .cookie("session", token, 3600000)
  .json({ success: true });
```

---

## Controller Methods

### Standard Controller Pattern

```typescript
import { Request, Response } from "type";
import DB from "app/services/DB";

class Controller {
  // Display list page
  public async index(request: Request, response: Response) {
    const items = await DB.from("items").select("*");
    return response.inertia("items/index", { items });
  }
  
  // Display create form
  public async create(request: Request, response: Response) {
    return response.inertia("items/create");
  }
  
  // Store new item
  public async store(request: Request, response: Response) {
    const data = await request.json();
    
    // Validate
    if (!data.name) {
      return response.status(400).json({
        error: "Name is required"
      });
    }
    
    // Insert
    const [id] = await DB.table("items").insert({
      ...data,
      created_at: Date.now()
    });
    
    return response.redirect("/items");
  }
  
  // Display edit form
  public async edit(request: Request, response: Response) {
    const id = request.params.id;
    const item = await DB.from("items").where("id", id).first();
    
    if (!item) {
      return response.status(404).json({ error: "Not found" });
    }
    
    return response.inertia("items/edit", { item });
  }
  
  // Update item
  public async update(request: Request, response: Response) {
    const id = request.params.id;
    const data = await request.json();
    
    await DB.table("items")
      .where("id", id)
      .update({
        ...data,
        updated_at: Date.now()
      });
    
    return response.redirect("/items");
  }
  
  // Delete item
  public async destroy(request: Request, response: Response) {
    const id = request.params.id;
    
    await DB.from("items").where("id", id).delete();
    
    return response.json({ success: true });
  }
}

export default new Controller();
```

---

## Service APIs

### Database Service (Knex.js)

```typescript
import DB from "app/services/DB";

// SELECT
DB.from(table: string)
  .select(...columns: string[])
  .where(column: string, value: any)
  .where(column: string, operator: string, value: any)
  .whereIn(column: string, values: any[])
  .whereNot(column: string, value: any)
  .whereNull(column: string)
  .whereNotNull(column: string)
  .whereBetween(column: string, [min, max])
  .orWhere(column: string, value: any)
  .orderBy(column: string, direction?: 'asc' | 'desc')
  .limit(count: number)
  .offset(count: number)
  .first()
  .count(column?: string)
  .sum(column: string)
  .avg(column: string)
  .min(column: string)
  .max(column: string)

// INSERT
DB.table(table: string)
  .insert(data: object | object[])
  .returning(column: string)

// UPDATE
DB.table(table: string)
  .where(column: string, value: any)
  .update(data: object)

// DELETE
DB.from(table: string)
  .where(column: string, value: any)
  .delete()

// JOIN
DB.from(table: string)
  .join(table: string, column1: string, column2: string)
  .leftJoin(table: string, column1: string, column2: string)
  .rightJoin(table: string, column1: string, column2: string)

// TRANSACTION
DB.transaction(async (trx) => {
  await trx.table("users").insert({ name: "John" });
  await trx.table("profiles").insert({ user_id: 1 });
})

// RAW QUERY
DB.raw(sql: string, bindings?: any[])

// MULTIPLE CONNECTIONS
DB.connection(stage: string)
```

---

### SQLite Service (Native)

```typescript
import SQLite from "app/services/SQLite";

// Get single row
SQLite.get(sql: string, params?: any[]): object | undefined

// Get all rows
SQLite.all(sql: string, params?: any[]): object[]

// Execute without returning rows
SQLite.run(sql: string, params?: any[]): {
  changes: number;
  lastInsertRowid: number;
}

// Prepare statement
SQLite.prepare(sql: string): Statement

// Statement methods
const stmt = SQLite.prepare(sql);
stmt.run(...params)
stmt.get(...params)
stmt.all(...params)
```

---

### Authentication Service

```typescript
import Authenticate from "app/services/Authenticate";

// Hash password
Authenticate.hash(password: string): Promise<string>
// Returns: "salt:hash"

// Compare password
Authenticate.compare(
  password: string, 
  storedHash: string
): Promise<boolean>

// Create session (login)
Authenticate.process(
  user: object,
  request: Request,
  response: Response
): Promise<void>

// Destroy session (logout)
Authenticate.logout(
  request: Request,
  response: Response
): Promise<void>
```

---

### S3 Storage Service

```typescript
import {
  uploadBuffer,
  uploadBufferSecure,
  getSignedUploadUrl,
  getPublicUrl,
  getObject,
  headObject,
  exists,
  deleteObject
} from "app/services/S3";

// Upload buffer
uploadBuffer(
  key: string,
  body: Buffer,
  contentType?: string,
  cacheControl?: string
): Promise<void>

// Secure upload (private)
uploadBufferSecure(
  key: string,
  body: Buffer | Readable,
  contentType?: string,
  contentLength?: number,
  metadata?: Record<string, string>
): Promise<void>

// Generate presigned upload URL
getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn?: number
): Promise<string>

// Get public URL
getPublicUrl(key: string): string

// Download file
getObject(key: string): Promise<GetObjectCommandOutput>

// Get file metadata
headObject(key: string): Promise<HeadObjectCommandOutput>

// Check if file exists
exists(key: string): Promise<boolean>

// Delete file
deleteObject(key: string): Promise<void>
```

---

### Email Services

```typescript
import { MailTo } from "app/services/Mailer";
// or
import { MailTo } from "app/services/Resend";

// Send email
MailTo({
  to: string,
  subject: string,
  text: string
}): Promise<void>
```

---

### View Service

```typescript
import { view } from "app/services/View";

// Render template
view(
  filename: string,
  data?: object
): string
```

---

### Logger Service

```typescript
import Logger from "app/services/Logger";

// Log levels
Logger.error(message: string, meta?: object): void
Logger.warn(message: string, meta?: object): void
Logger.info(message: string, meta?: object): void
Logger.http(message: string, meta?: object): void
Logger.verbose(message: string, meta?: object): void
Logger.debug(message: string, meta?: object): void
Logger.silly(message: string, meta?: object): void
```

---

### Redis Service

```typescript
import Redis from "app/services/Redis";

// Set value
Redis.set(key: string, value: string, ...args): Promise<string>

// Get value
Redis.get(key: string): Promise<string | null>

// Delete key
Redis.del(key: string): Promise<number>

// Check if exists
Redis.exists(key: string): Promise<number>

// Set with expiration
Redis.setex(key: string, seconds: number, value: string): Promise<string>

// Increment
Redis.incr(key: string): Promise<number>

// Decrement
Redis.decr(key: string): Promise<number>

// Get multiple keys
Redis.mget(...keys: string[]): Promise<(string | null)[]>

// Set multiple keys
Redis.mset(...keyValues: string[]): Promise<string>

// Set expiration
Redis.expire(key: string, seconds: number): Promise<number>

// Get TTL
Redis.ttl(key: string): Promise<number>
```

---

## Middleware Functions

### HyperExpress Middleware Pattern

**IMPORTANT**: HyperExpress middleware works differently from Express.js. Do NOT use `next()`.

```typescript
// ❌ WRONG - Express.js pattern (causes double execution)
export default async (request: Request, response: Response, next: Function) => {
   if (authenticated) {
      request.user = user;
      next(); // DON'T DO THIS - causes request to run twice
   } else {
      response.redirect("/login");
   }
}

// ✅ CORRECT - HyperExpress pattern
export default async (request: Request, response: Response) => {
   if (authenticated) {
      request.user = user;
      // No return = automatically continues to handler
   } else {
      return response.redirect("/login"); // Return = stops here
   }
}
```

**Key Rules:**
- **No `next()` needed** - HyperExpress auto-continues if no response is sent
- **Always `return`** when sending a response (redirect, json, send)
- **No return** = request continues to the next handler

---

### Auth Middleware

```typescript
import Auth from "app/middlewares/auth";

// Usage in routes
Route.get("/protected", [Auth], Controller.method);

// What it does:
// 1. Checks auth_id cookie
// 2. Validates session in database
// 3. Loads user data
// 4. Sets request.user
// 5. Redirects to /login if not authenticated
```

---

### Rate Limit Middleware

```typescript
import {
  authRateLimit,
  apiRateLimit,
  passwordResetRateLimit,
  createAccountRateLimit,
  uploadRateLimit
} from "app/middlewares/rateLimit";

// Usage in routes
Route.post("/login", [authRateLimit], AuthController.processLogin);
Route.post("/api/data", [apiRateLimit], DataController.getData);

// Configuration
authRateLimit: 5 requests per minute
apiRateLimit: 60 requests per minute
passwordResetRateLimit: 3 requests per 15 minutes
createAccountRateLimit: 3 requests per hour
uploadRateLimit: 10 requests per minute
```

---

### Inertia Middleware

```typescript
import inertia from "app/middlewares/inertia";

// Automatically applied globally
// Adds response.inertia() method

// Usage in controllers
response.inertia(component: string, props?: object, viewProps?: object)
```

---

## Helper Utilities

### Component Helper (`resources/js/Components/helper.js`)

```javascript
// Format date
formatDate(timestamp: number): string
// Returns: "Jan 1, 2024"

// Format relative time
timeAgo(timestamp: number): string
// Returns: "2 hours ago"

// Truncate text
truncate(text: string, length: number): string
// Returns: "This is a long text..."

// Debounce function
debounce(func: Function, wait: number): Function

// Throttle function
throttle(func: Function, limit: number): Function

// Copy to clipboard
copyToClipboard(text: string): Promise<void>

// Generate random string
randomString(length: number): string

// Validate email
isValidEmail(email: string): boolean

// Format number
formatNumber(num: number): string
// Returns: "1,234,567"

// Format currency
formatCurrency(amount: number, currency?: string): string
// Returns: "$1,234.56"
```

---

## Environment Variables

### Required Variables

```env
# Database
DB_CONNECTION=development  # development | production | test

# Server
NODE_ENV=development       # development | production
PORT=5555                  # Server port
VITE_PORT=5173            # Vite dev server port
HAS_CERTIFICATE=false     # Enable HTTPS

# Logging
LOG_LEVEL=info            # error | warn | info | debug
```

### Optional Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5555/google/callback
APP_URL=http://localhost:5555

# S3/Wasabi Storage
WASABI_ACCESS_KEY=
WASABI_SECRET_KEY=
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=
BACKUP_ENCRYPTION_KEY=
BACKUP_SSE=false

# Email (Nodemailer)
USER_MAILER=
PASS_MAILER=
MAIL_FROM_NAME=
MAIL_FROM_ADDRESS=

# Email (Resend)
RESEND_API_KEY=

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## Response Status Codes

### Success Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `204 No Content` - Successful request with no response body

### Client Error Codes

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded

### Server Error Codes

- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

---

## Error Handling

### Standard Error Response

```typescript
{
  error: string,           // Error message
  code?: string,          // Error code
  details?: object        // Additional details
}
```

### Example Error Responses

```typescript
// Validation error
response.status(400).json({
  error: "Invalid input",
  details: {
    email: "Email is required",
    password: "Password must be at least 8 characters"
  }
});

// Authentication error
response.status(401).json({
  error: "Invalid credentials"
});

// Not found error
response.status(404).json({
  error: "Resource not found",
  code: "NOT_FOUND"
});

// Rate limit error
response.status(429).json({
  error: "Too many requests",
  code: "RATE_LIMIT_EXCEEDED"
});

// Server error
response.status(500).json({
  error: "Internal server error",
  code: "INTERNAL_ERROR"
});
```

---

## Next Steps

- [Frontend Development](04-FRONTEND-DEVELOPMENT.md)
- [Database Management](05-DATABASE.md)
- [Deployment Guide](08-DEPLOYMENT.md)
- [Best Practices](10-BEST-PRACTICES.md)
