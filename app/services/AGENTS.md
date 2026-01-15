# Services Guide for AI

## Core Principles

1. **Use existing services first** - Check if functionality exists before creating new services
2. **Import from app/services** - All services are in `app/services/` directory
3. **Use static methods** - Services use static methods, no `this` keyword
4. **Handle errors gracefully** - Services should handle errors and return appropriate responses

## Built-in Services

### Database Operations

**DB** - Database operations using Knex
```typescript
import DB from "../services/DB"

// Select
const users = await DB.from("users").where("id", 1).first()
const allUsers = await DB.from("users").select("*")

// Insert
await DB.from("users").insert({ name: "John", email: "john@example.com" })

// Update
await DB.from("users").where("id", 1).update({ name: "Jane" })

// Delete
await DB.from("users").where("id", 1).delete()

// Transactions
await DB.transaction(async (trx) => {
  await trx.from("users").insert({ name: "John" })
  await trx.from("posts").insert({ title: "Hello" })
})
```

### Authentication

**Authenticate** - Password hashing, login/logout, session management
```typescript
import Authenticate from "../services/Authenticate"

// Hash password
const hashedPassword = await Authenticate.hash("password123")

// Compare password
const isValid = await Authenticate.compare("password123", hashedPassword)

// Login user
await Authenticate.login(user, request, response)

// Logout user
await Authenticate.logout(request, response)
```

### Validation

**Validator** - Input validation with Zod schemas
```typescript
import Validator from "../services/Validator"
import { z } from "zod"

// Validate input
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const result = await Validator.validate(schema, { email: "test@example.com", password: "12345678" })

if (!result.success) {
  return response.status(400).json({ errors: result.errors })
}

// Or throw on validation error
try {
  const data = await Validator.validateOrThrow(schema, input)
} catch (error) {
  // Handle ZodError
}
```

### Caching

**CacheService** - Caching layer
```typescript
import Cache from "../services/CacheService"

// Get from cache
const data = await Cache.get("key")

// Store in cache (expires in 60 minutes)
await Cache.put("key", { data: "value" }, 60)

// Remember - get or store
const data = await Cache.remember("key", 60, async () => {
  return await DB.from("users").where("id", 1).first()
})

// Forget (delete)
await Cache.forget("key")

// Flush all
await Cache.flush()
```

### Email

**Mailer** - SMTP email sending (Gmail)
```typescript
import { MailTo } from "../services/Mailer"

await MailTo({
  to: "user@example.com",
  subject: "Welcome",
  text: "Hello, welcome to our app!"
})
```

**Resend** - Email sending via Resend API
```typescript
import { MailTo } from "../services/Resend"

await MailTo({
  to: "user@example.com",
  subject: "Welcome",
  text: "Hello, welcome to our app!"
})
```

### Rate Limiting

**RateLimiter** - Rate limiting
```typescript
import RateLimiter from "../services/RateLimiter"

// Check rate limit
const { allowed, remaining, reset } = await RateLimiter.attempt("user:123", 10, 60)

if (!allowed) {
  return response.status(429).json({ error: "Too many requests" })
}
```

### Logging

**Logger** - Logging
```typescript
import Logger from "../services/Logger"

Logger.info("User logged in", { userId: 123 })
Logger.error("Database error", { error: err.message })
Logger.warn("Suspicious activity", { ip: request.ip })
```

### Translation

**Translation** - Multi-language support
```typescript
import { t } from "../services/Translation"

const message = t("welcome_message")
// Returns translated text based on user's locale
```

### View Rendering

**View** - SSR template rendering (Eta)
```typescript
import view from "../services/View"

const html = await view("index.html", {
  title: "Welcome",
  user: request.user
})
```

### File Storage

**LocalStorage** - Local file storage
```typescript
import LocalStorage from "../services/LocalStorage"

// Store file
const path = await LocalStorage.store(file, "uploads")

// Delete file
await LocalStorage.delete("uploads/filename.jpg")

// Get URL
const url = LocalStorage.url("uploads/filename.jpg")
```

**S3** - AWS S3 integration
```typescript
import S3 from "../services/S3"

// Upload file
const url = await S3.upload(file, "uploads")

// Delete file
await S3.delete("uploads/filename.jpg")

// Get URL
const url = await S3.url("uploads/filename.jpg")
```

### CSRF Protection

**CSRF** - CSRF token generation and validation
```typescript
import CSRF from "../services/CSRF"

// Generate token
const token = await CSRF.generate(request, response)

// Validate token
const isValid = await CSRF.validate(request, response)
```

### Redis

**Redis** - Redis client
```typescript
import Redis from "../services/Redis"

// Set value
await Redis.set("key", "value", "EX", 60)

// Get value
const value = await Redis.get("key")

// Delete value
await Redis.del("key")
```

### Google OAuth

**GoogleAuth** - Google OAuth
```typescript
import GoogleAuth from "../services/GoogleAuth"

// Get auth URL
const authUrl = GoogleAuth.getAuthUrl()

// Exchange code for tokens
const tokens = await GoogleAuth.exchangeCode(code)

// Get user info
const userInfo = await GoogleAuth.getUserInfo(tokens.access_token)
```

## Creating Custom Services

If built-in services don't meet your needs, create custom services:

```typescript
// app/services/MyService.ts
import DB from "./DB"

class MyService {
  public async doSomething(id: number) {
    const data = await DB.from("table").where("id", id).first()
    // Process data
    return data
  }
}

export default new MyService()
```

**Usage in controller:**
```typescript
import MyService from "../services/MyService"

const result = await MyService.doSomething(123)
```

## Quick Reference

| Service | Purpose | Example |
|---------|---------|---------|
| `DB` | Database operations | `DB.from("users").where("id", 1).first()` |
| `Authenticate` | Password hashing, sessions | `await Authenticate.hash("password")` |
| `Validator` | Input validation | `await Validator.validate(schema, data)` |
| `CacheService` | Caching | `await Cache.put("key", value, 60)` |
| `Mailer` | SMTP email | `await MailTo({ to, subject, text })` |
| `Resend` | Resend email | `await MailTo({ to, subject, text })` |
| `RateLimiter` | Rate limiting | `await RateLimiter.attempt("key", 10, 60)` |
| `Logger` | Logging | `Logger.info("message", { data })` |
| `Translation` | Multi-language | `t("welcome_message")` |
| `View` | SSR rendering | `await view("index.html", data)` |
| `LocalStorage` | Local file storage | `await LocalStorage.store(file, "uploads")` |
| `S3` | AWS S3 storage | `await S3.upload(file, "uploads")` |
| `CSRF` | CSRF protection | `await CSRF.generate(request, response)` |
| `Redis` | Redis operations | `await Redis.set("key", "value")` |
| `GoogleAuth` | Google OAuth | `GoogleAuth.getAuthUrl()` |

## Best Practices

1. **Check existing services first** - Don't create duplicate functionality
2. **Use static methods** - Services use static methods, no `this`
3. **Handle errors** - Always handle errors appropriately
4. **Use transactions** - For multiple database operations
5. **Cache when appropriate** - Use CacheService for expensive operations
6. **Log important events** - Use Logger for debugging and monitoring
7. **Validate input** - Always validate user input with Validator
8. **Use environment variables** - Store sensitive data in .env
