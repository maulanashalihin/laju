# Middlewares Guide for AI

## Core Principles

1. **Use existing middlewares first** - Check if functionality exists before creating new ones
2. **Import from app/middlewares** - All middlewares are in `app/middlewares/` directory
3. **No next() calls** - Middlewares don't use `next()`, they return response or continue
4. **Apply in routes** - Add middlewares to route definitions in `routes/web.ts`

## Built-in Middlewares

| Middleware | Purpose | Usage |
|------------|---------|-------|
| `auth` | Authentication - checks user session | `router.get("/dashboard", auth, Controller.index)` |
| `csrf` | CSRF protection - validates CSRF tokens | `router.post("/posts", csrf, Controller.store)` |
| `inertia` | Inertia.js headers | `router.get("/page", inertia, Controller.index)` |
| `rateLimit` | Rate limiting - limits request frequency | `router.post("/api", rateLimit("api"), Controller.action)` |
| `securityHeaders` | Security headers | `router.get("/page", securityHeaders, Controller.index)` |

## Usage Examples

### Authentication
```typescript
import auth from "../app/middlewares/auth"

router.get("/dashboard", auth, DashboardController.index)

// Access user in controller
export default {
  async index(request: Request, response: Response) {
    const user = request.user
    // user.id, user.name, user.email, etc.
  }
}
```

### CSRF Protection
```typescript
import csrf from "../app/middlewares/csrf"

router.post("/posts", csrf, PostController.store)
```

In forms (Svelte):
```svelte
<script>
  import { page } from '@inertiajs/svelte'
</script>

<form method="POST">
  <input type="hidden" name="_token" value={page.props.csrf_token} />
</form>
```

### Rate Limiting
```typescript
import { rateLimit } from "../app/middlewares/rateLimit"

// Use presets
router.post("/login", rateLimit("auth"), LoginController.login)
router.post("/api/data", rateLimit("api"), ApiController.index)

// Custom limit
import { createRateLimit } from "../app/middlewares/rateLimit"
const customLimit = createRateLimit({
  maxRequests: 5,
  windowMs: 60 * 1000,
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

## Middleware Order

Order matters! Apply in sequence:
```typescript
router.get("/protected", 
  securityHeaders,  // 1. Security headers
  csrf,            // 2. CSRF protection
  rateLimit("api"), // 3. Rate limiting
  auth,            // 4. Authentication
  inertia,         // 5. Inertia headers
  Controller.index // 6. Controller
)
```

## Creating Custom Middlewares

```typescript
// app/middlewares/myMiddleware.ts
import { Request, Response } from "../../type"

export default async (request: Request, response: Response) => {
  if (!request.headers.authorization) {
    return response.status(401).json({ error: "Unauthorized" })
  }
  // If condition passes, middleware completes automatically
}
```

Usage:
```typescript
import myMiddleware from "../app/middlewares/myMiddleware"
router.get("/api/data", myMiddleware, ApiController.index)
```

## Common Patterns

### Admin Check
```typescript
export default async (request: Request, response: Response) => {
  if (!request.user?.is_admin) {
    return response.status(403).json({ error: "Forbidden" })
  }
}
```

### Email Verification Check
```typescript
export default async (request: Request, response: Response) => {
  if (!request.user?.is_verified) {
    return response.redirect("/email/verify")
  }
}
```

### API Key Check
```typescript
export default async (request: Request, response: Response) => {
  const apiKey = request.headers["x-api-key"]
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return response.status(401).json({ error: "Invalid API key" })
  }
}
```
