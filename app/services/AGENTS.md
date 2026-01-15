# Services Guide for AI

## Core Principles

1. **Use existing services first** - Check if functionality exists before creating new services
2. **Import from app/services** - All services are in `app/services/` directory
3. **Use static methods** - Services use static methods, no `this` keyword

## Built-in Services

| Service | Purpose | Example |
|---------|---------|---------|
| `DB` | Database operations (Knex) | `DB.from("users").where("id", 1).first()` |
| `Authenticate` | Password hashing, login/logout, sessions | `await Authenticate.hash("password")` |
| `Validator` | Input validation (Zod) | `await Validator.validate(schema, data)` |
| `CacheService` | Caching layer | `await Cache.put("key", value, 60)` |
| `Mailer` | SMTP email (Gmail) | `await MailTo({ to, subject, text })` |
| `Resend` | Resend email API | `await MailTo({ to, subject, text })` |
| `RateLimiter` | Rate limiting | `await RateLimiter.attempt("key", 10, 60)` |
| `Logger` | Logging | `Logger.info("message", { data })` |
| `Translation` | Multi-language | `t("welcome_message")` |
| `View` | SSR rendering (Eta) | `await view("index.html", data)` |
| `LocalStorage` | Local file storage | `await LocalStorage.store(file, "uploads")` |
| `S3` | AWS S3 storage | `await S3.upload(file, "uploads")` |
| `CSRF` | CSRF protection | `await CSRF.generate(request, response)` |
| `Redis` | Redis client | `await Redis.set("key", "value")` |
| `GoogleAuth` | Google OAuth | `GoogleAuth.getAuthUrl()` |

## Common Patterns

### Database Operations
```typescript
import DB from "../services/DB"

const user = await DB.from("users").where("id", 1).first()
await DB.from("users").insert({ name: "John", email: "john@example.com" })
await DB.from("users").where("id", 1).update({ name: "Jane" })
await DB.from("users").where("id", 1).delete()

await DB.transaction(async (trx) => {
  await trx.from("users").insert({ name: "John" })
  await trx.from("posts").insert({ title: "Hello" })
})
```

### Authentication
```typescript
import Authenticate from "../services/Authenticate"

const hashedPassword = await Authenticate.hash("password123")
const isValid = await Authenticate.compare("password123", hashedPassword)
await Authenticate.login(user, request, response)
await Authenticate.logout(request, response)
```

### Validation
```typescript
import Validator from "../services/Validator"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const result = await Validator.validate(schema, data)
if (!result.success) {
  return response.status(400).json({ errors: result.errors })
}

const data = await Validator.validateOrThrow(schema, input)
```

### Caching
```typescript
import Cache from "../services/CacheService"

const data = await Cache.get("key")
await Cache.put("key", value, 60)
await Cache.remember("key", 60, async () => {
  return await DB.from("users").where("id", 1).first()
})
await Cache.forget("key")
```

### Email
```typescript
import { MailTo } from "../services/Mailer"
// or
import { MailTo } from "../services/Resend"

await MailTo({
  to: "user@example.com",
  subject: "Welcome",
  text: "Hello, welcome to our app!"
})
```

### Rate Limiting
```typescript
import RateLimiter from "../services/RateLimiter"

const { allowed } = await RateLimiter.attempt("user:123", 10, 60)
if (!allowed) {
  return response.status(429).json({ error: "Too many requests" })
}
```

### File Storage
```typescript
// Local
import LocalStorage from "../services/LocalStorage"
const path = await LocalStorage.store(file, "uploads")
await LocalStorage.delete("uploads/filename.jpg")

// S3
import S3 from "../services/S3"
const url = await S3.upload(file, "uploads")
await S3.delete("uploads/filename.jpg")
```

### Google OAuth
```typescript
import GoogleAuth from "../services/GoogleAuth"

const authUrl = GoogleAuth.getAuthUrl()
const tokens = await GoogleAuth.exchangeCode(code)
const userInfo = await GoogleAuth.getUserInfo(tokens.access_token)
```

## Creating Custom Services

```typescript
// app/services/MyService.ts
import DB from "./DB"

class MyService {
  public async doSomething(id: number) {
    return await DB.from("table").where("id", id).first()
  }
}

export default new MyService()
```

Usage:
```typescript
import MyService from "../services/MyService"
const result = await MyService.doSomething(123)
```
