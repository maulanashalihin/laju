# Middlewares Guide for AI

## Core Principles

1. **Use existing middlewares first** - Check if functionality exists before creating new ones
2. **Import from app/middlewares** - All middlewares are in `app/middlewares/` directory
3. **No next() calls** - Middlewares don't use `next()`, they return response or continue
4. **Apply in routes** - Add middlewares to route definitions in `routes/web.ts`

## Built-in Middlewares

### auth

**Purpose:** Authentication - checks if user is logged in by verifying session cookie

**Behavior:**
- Checks `auth_id` cookie
- Retrieves user from cache or database
- Sets `request.user` if authenticated
- Redirects to `/login` if not authenticated

**Usage:**
```typescript
import auth from "../app/middlewares/auth"

router.get("/dashboard", auth, DashboardController.index)
```

**Access user in controller:**
```typescript
export default {
  async index(request: Request, response: Response) {
    const user = request.user
    // user.id, user.name, user.email, etc.
  }
}
```

### csrf

**Purpose:** CSRF protection - validates CSRF tokens for POST/PUT/DELETE requests

**Behavior:**
- Validates CSRF token from request body or headers
- Generates new CSRF token for GET requests
- Returns 403 if token is invalid or missing

**Usage:**
```typescript
import csrf from "../app/middlewares/csrf"

router.post("/posts", csrf, PostController.store)
```

**In forms (Svelte):**
```svelte
<script>
  import { page } from '@inertiajs/svelte'
</script>

<form method="POST">
  <input type="hidden" name="_token" value={page.props.csrf_token} />
  <!-- other form fields -->
</form>
```

### inertia

**Purpose:** Inertia.js headers - sets required headers for Inertia.js requests

**Behavior:**
- Sets `X-Inertia` header
- Sets `X-Inertia-Version` header
- Handles Inertia-specific request/response

**Usage:**
```typescript
import inertia from "../app/middlewares/inertia"

router.get("/dashboard", inertia, DashboardController.index)
```

### rateLimit

**Purpose:** Rate limiting - limits request frequency to prevent abuse

**Behavior:**
- Tracks requests by IP or user ID
- Returns 429 status if limit exceeded
- Sets rate limit headers in response

**Usage with preset:**
```typescript
import { rateLimit } from "../app/middlewares/rateLimit"

// Use preset rate limiters
router.post("/login", rateLimit("auth"), LoginController.login)
router.post("/api/data", rateLimit("api"), ApiController.index)
```

**Custom rate limit:**
```typescript
import { createRateLimit } from "../app/middlewares/rateLimit"

const customLimit = createRateLimit({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
  message: "Too many requests"
})

router.post("/endpoint", customLimit, Controller.action)
```

**Available presets:**
- `auth` - 5 requests per 15 minutes
- `api` - 60 requests per minute
- `password` - 3 requests per hour
- `register` - 3 requests per hour
- `upload` - 10 requests per minute

### securityHeaders

**Purpose:** Security headers - adds security-related HTTP headers

**Behavior:**
- Sets various security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security`
  - `Content-Security-Policy`
  - `Referrer-Policy`

**Usage:**
```typescript
import securityHeaders from "../app/middlewares/securityHeaders"

router.get("/dashboard", securityHeaders, DashboardController.index)
```

## Middleware Order

Order matters! Apply middlewares in this sequence:

```typescript
router.get("/protected", 
  securityHeaders,  // 1. Security headers first
  csrf,            // 2. CSRF protection
  rateLimit("api"), // 3. Rate limiting
  auth,            // 4. Authentication
  inertia,         // 5. Inertia headers
  Controller.index // 6. Controller
)
```

## Creating Custom Middlewares

If built-in middlewares don't meet your needs, create custom ones:

```typescript
// app/middlewares/myMiddleware.ts
import { Request, Response } from "../../type"

export default async (request: Request, response: Response) => {
  // Check condition
  if (!request.headers.authorization) {
    return response.status(401).json({ error: "Unauthorized" })
  }

  // If condition passes, middleware completes automatically
  // No need to call next()
}
```

**Usage:**
```typescript
import myMiddleware from "../app/middlewares/myMiddleware"

router.get("/api/data", myMiddleware, ApiController.index)
```

## Common Middleware Patterns

### Admin Check

```typescript
// app/middlewares/admin.ts
import { Request, Response } from "../../type"

export default async (request: Request, response: Response) => {
  if (!request.user?.is_admin) {
    return response.status(403).json({ error: "Forbidden" })
  }
}
```

### Email Verification Check

```typescript
// app/middlewares/verified.ts
import { Request, Response } from "../../type"

export default async (request: Request, response: Response) => {
  if (!request.user?.is_verified) {
    return response.redirect("/email/verify")
  }
}
```

### API Key Check

```typescript
// app/middlewares/apiKey.ts
import { Request, Response } from "../../type"

export default async (request: Request, response: Response) => {
  const apiKey = request.headers["x-api-key"]

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return response.status(401).json({ error: "Invalid API key" })
  }
}
```

### Maintenance Mode

```typescript
// app/middlewares/maintenance.ts
import { Request, Response } from "../../type"

export default async (request: Request, response: Response) => {
  if (process.env.MAINTENANCE_MODE === "true") {
    return response.status(503).json({ 
      error: "Service temporarily unavailable" 
    })
  }
}
```

## Quick Reference

| Middleware | Purpose | Usage |
|------------|---------|-------|
| `auth` | Authentication | `router.get("/dashboard", auth, Controller.index)` |
| `csrf` | CSRF protection | `router.post("/posts", csrf, Controller.store)` |
| `inertia` | Inertia.js headers | `router.get("/page", inertia, Controller.index)` |
| `rateLimit` | Rate limiting | `router.post("/api", rateLimit("api"), Controller.action)` |
| `securityHeaders` | Security headers | `router.get("/page", securityHeaders, Controller.index)` |

## Best Practices

1. **Check existing middlewares first** - Don't create duplicate functionality
2. **No next() calls** - Middlewares complete automatically
3. **Order matters** - Apply in correct sequence
4. **Return response** - If condition fails, return response immediately
5. **Use presets** - Use rateLimit presets when possible
6. **Keep it simple** - Each middleware should do one thing
7. **Test thoroughly** - Test middleware behavior with different scenarios
8. **Document clearly** - Add comments explaining middleware logic
