# Middleware Guide

Complete guide to understanding and creating middleware in Laju Framework.

## Table of Contents

1. [Introduction](#introduction)
2. [HyperExpress vs Express.js](#hyperexpress-vs-expressjs)
3. [Middleware Execution Flow](#middleware-execution-flow)
4. [Built-in Middleware](#built-in-middleware)
5. [Creating Custom Middleware](#creating-custom-middleware)
6. [Common Patterns](#common-patterns)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Introduction

Middleware functions are functions that have access to the request and response objects. They can execute code, modify request/response objects, and control the flow of the request-response cycle.

### What Middleware Can Do

- Execute any code
- Modify request and response objects
- End the request-response cycle
- Validate input data
- Check authentication/authorization
- Log requests
- Rate limiting
- Transform data

---

## HyperExpress vs Express.js

### ⚠️ CRITICAL DIFFERENCE

**HyperExpress supports TWO middleware patterns:**

```typescript
// ❌ Express.js style (DON'T USE)
app.use((req, res, next) => {
  console.log('Middleware');
  next(); // ❌ This doesn't exist in HyperExpress
});

// ✅ HyperExpress Style 1: Async (RECOMMENDED)
app.use(async (request, response) => {
  console.log('Middleware');
  // Automatically continues after resolve
});

// ✅ HyperExpress Style 2: Callback with next
app.use((request, response, next) => {
  console.log('Middleware');
  next(); // Must call next() to continue
});
```

### Execution Rules

| Pattern | Action | Result |
|---------|--------|--------|
| `async (req, res)` | No return | Continue to next middleware/handler |
| `async (req, res)` | `return response.xxx()` | Stop execution, send response |
| `(req, res, next)` | `next()` | Continue to next middleware/handler |
| `(req, res, next)` | `return response.xxx()` | Stop execution, send response |

### Examples

```typescript
// ✅ Continue to next handler (async pattern - RECOMMENDED)
export default async (request: Request, response: Response) => {
  request.startTime = Date.now();
  // No return = continues automatically
}

// ✅ Stop execution and redirect (async pattern)
export default async (request: Request, response: Response) => {
  if (!request.user) {
    return response.redirect("/login"); // Stops here
  }
  // Continues if user exists
}

// ✅ Stop execution and send JSON (async pattern)
export default async (request: Request, response: Response) => {
  if (!request.headers.authorization) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  // Continues if authorized
}

// ✅ Continue with callback pattern
export default (request: Request, response: Response, next) => {
  request.startTime = Date.now();
  next(); // Must call next() to continue
}
```

### ⚠️ IMPORTANT

**ALWAYS use `async` for middleware in Laju Framework:**

```typescript
// ✅ CORRECT - Async middleware
export function securityHeaders() {
  return async (request: Request, response: Response) => {
    response.header('X-Frame-Options', 'DENY');
    // Automatically continues
  };
}

// ❌ WRONG - Non-async without next
export function securityHeaders() {
  return (request: Request, response: Response) => {
    response.header('X-Frame-Options', 'DENY');
    // Request will hang - no way to continue!
  };
}
```

---

## Middleware Execution Flow

### Route Definition

```typescript
// Single middleware
Route.get("/profile", [Auth], ProfileController.show);

// Multiple middleware (executed in order)
Route.post("/upload", [Auth, uploadRateLimit, validateFile], UploadController.store);

// Global middleware (applies to all routes)
webserver.use(inertia());
```

### Execution Order

```typescript
Route.post("/posts", [middleware1, middleware2, middleware3], Controller.store);

// Flow:
// 1. middleware1 executes
//    - If returns response → STOP
//    - If no return → continue to #2
// 2. middleware2 executes
//    - If returns response → STOP
//    - If no return → continue to #3
// 3. middleware3 executes
//    - If returns response → STOP
//    - If no return → continue to Controller.store
// 4. Controller.store executes
```

---

## Built-in Middleware

### 1. Auth Middleware

Protects routes requiring authentication with session-based authentication.

**Location:** `app/middlewares/auth.ts`

```typescript
import Auth from "app/middlewares/auth";

// Protect single route
Route.get("/dashboard", [Auth], DashboardController.index);

// Protect multiple routes
Route.get("/profile", [Auth], ProfileController.show);
Route.post("/profile", [Auth], ProfileController.update);
```

**How it works:**

```typescript
export default async (request: Request, response: Response) => {
   const redirectToLogin = () => response.cookie("auth_id", "", 0).redirect("/login");

   if (!request.cookies.auth_id) {
      return redirectToLogin();
   }

   try {
      // Cache session for 60 days to reduce database queries
      const user = await Cache.remember(
         `session:${request.cookies.auth_id}`,
         60 * 24 * 60, // 60 days in minutes
         async () => {
            return SQLite.get(`
               SELECT u.id, u.name, u.email, u.phone, u.is_admin, u.is_verified
               FROM sessions s
               JOIN users u ON s.user_id = u.id
               WHERE s.id = ? AND s.expires_at > datetime('now')
            `, [request.cookies.auth_id]) as User | null;
         }
      );

      if (!user) {
         return redirectToLogin();
      }

      // Convert SQLite 0/1 to boolean
      user.is_admin = Boolean(user.is_admin);
      user.is_verified = Boolean(user.is_verified);

      request.user = user;

   } catch (error) {
      console.error("Auth middleware error:", error);
      return redirectToLogin();
   }
}
```

**Features:**
- ✅ Session caching (60 days) for performance
- ✅ Session expiration check
- ✅ Error handling with fallback to login
- ✅ Includes phone field in user data

**Access user in controller:**

```typescript
public async show(request: Request, response: Response) => {
   const userId = request.user.id; // Available after Auth middleware
   const user = await DB.from("users").where("id", userId).first();
   return response.json({ user });
}
```

---

### 2. CSRF Middleware

Protects against Cross-Site Request Forgery attacks with token-based validation.

**Location:** `app/middlewares/csrf.ts`

#### Global CSRF Protection

```typescript
import { csrf } from "app/middlewares/csrf";

// Apply globally in server.ts
webserver.use(csrf({
  excludeAPIs: true,  // Exclude /api/* routes (default: true)
  excludePaths: ['/webhooks/*']  // Additional paths to exclude
}));
```

#### Individual Route CSRF Check

```typescript
import { csrfCheck } from "app/middlewares/csrf";

// Apply to specific routes
Route.post("/upload", [csrfCheck], UploadController.store);
```

#### How It Works

```typescript
export function csrf(options: CSRFOptions = {}) {
  const config = {
    excludePaths: new Set(options.excludePaths || []),
    excludeAPIs: options.excludeAPIs ?? true
  };

  return async (request: Request, response: Response) => {
    const method = request.method.toUpperCase();
    const path = request.path;

    // Only check state-changing methods (POST, PUT, PATCH, DELETE)
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      // For GET requests, ensure token exists in cookie
      if (!request.cookies.csrf_token) {
        CSRF.setToken(response);
      }
      return; // Continue to next handler
    }

    // Skip excluded paths
    for (const excludedPath of config.excludePaths) {
      if (path.startsWith(excludedPath)) {
        return;
      }
    }

    // Skip API routes if configured
    if (config.excludeAPIs && path.startsWith('/api/')) {
      return;
    }

    // Validate CSRF token
    const token = CSRF.getTokenFromRequest(request);
    const cookieToken = request.cookies.csrf_token;

    if (!token || !cookieToken || token !== cookieToken || !CSRF.validate(token)) {
      return response.status(403).json({
        success: false,
        error: {
          message: 'Invalid CSRF token',
          code: 'CSRF_INVALID'
        }
      });
    }

    // Token valid, generate new one for next request (token rotation)
    const newToken = CSRF.regenerate();
    response.cookie('csrf_token', newToken, TOKEN_EXPIRY, {
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  };
}
```

**Features:**
- ✅ Token rotation on each successful request
- ✅ Automatic token generation for GET requests
- ✅ Configurable path exclusions
- ✅ API route exclusion (default)
- ✅ Secure cookie settings in production

**Frontend Usage:**

```typescript
// Include CSRF token in requests
const csrfToken = document.cookie.match(/csrf_token=([^;]+)/)?.[1];

fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({ title: 'New Post' })
});
```

---

### 3. Rate Limit Middleware

Prevents abuse by limiting requests per time window.

**Location:** `app/middlewares/rateLimit.ts`

#### Preset Rate Limiters

```typescript
import {
  authRateLimit,           // 5 requests per 15 min
  apiRateLimit,            // 100 requests per 15 min
  generalRateLimit,        // 1000 requests per 15 min
  passwordResetRateLimit,  // 3 requests per hour
  emailRateLimit,          // 10 requests per hour
  uploadRateLimit,         // 50 requests per hour
  createAccountRateLimit   // 3 requests per hour
} from "app/middlewares/rateLimit";

// Usage
Route.post("/login", [authRateLimit], AuthController.processLogin);
Route.post("/register", [createAccountRateLimit], AuthController.processRegister);
Route.post("/api/upload", [Auth, uploadRateLimit], UploadController.store);
```

#### Custom Rate Limiter

```typescript
import { rateLimit } from "app/middlewares/rateLimit";

const customLimit = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 100,           // 100 requests
  message: "Too many requests",
  statusCode: 429,
  keyGenerator: (request) => request.ip,  // Rate limit by IP
  skip: (request) => request.user?.is_admin  // Skip for admins
});

Route.post("/api/data", [customLimit], DataController.store);
```

#### Custom Handler

```typescript
const customLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  handler: (request: Request, response: Response) => {
    return response.flash("error", 'Too many attempts, please try again later').redirect("/login", 303);
  }
});
```

#### Rate Limit by User ID

```typescript
import { userRateLimit } from "app/middlewares/rateLimit";

// 50 requests per 15 minutes per user
const userLimit = userRateLimit(50, 15 * 60 * 1000);

Route.post("/api/posts", [Auth, userLimit], PostController.store);
```

#### Custom Key Rate Limit

```typescript
import { customRateLimit } from "app/middlewares/rateLimit";

// Rate limit by custom key
const apiLimit = customRateLimit('api:v1:endpoint', 1000, 15 * 60 * 1000);

Route.get("/api/v1/data", [apiLimit], DataController.index);
```

**Features:**
- ✅ Cloudflare IP detection (supports `cf-connecting-ip` header)
- ✅ Rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- ✅ Custom key generators
- ✅ Skip conditions
- ✅ Custom handlers
- ✅ Automatic logging for exceeded limits

---

### 4. Security Headers Middleware

Adds security-related HTTP headers to all responses.

**Location:** `app/middlewares/securityHeaders.ts`

#### What It Does

Automatically adds security headers to prevent:
- XSS (Cross-Site Scripting) attacks
- Clickjacking
- MIME type sniffing
- Unauthorized cross-origin requests
- DNS prefetching
- And other common web vulnerabilities

#### Default Headers

```typescript
// Development mode - allows external resources
Content-Security-Policy: default-src 'self' http: https: data: blob:; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Permitted-Cross-Domain-Policies: none

// Production mode - strict policy
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### Usage

Applied globally in `server.ts`:

```typescript
import { securityHeaders } from "./app/middlewares/securityHeaders";

webserver.use(securityHeaders()); // Add to all responses
```

#### Custom Configuration

```typescript
import { securityHeaders, SecurityHeadersOptions } from "app/middlewares/securityHeaders";

// Custom CSP
const customHeaders: SecurityHeadersOptions = {
  contentSecurityPolicy: "default-src 'self'; script-src 'self' https://cdn.example.com",
  strictTransportSecurity: false, // Disable HSTS
  xFrameOptions: 'SAMEORIGIN', // Allow same-origin frames
  xContentTypeOptions: true,
};

webserver.use(securityHeaders(customHeaders));
```

#### Preset Configurations

```typescript
import {
  developmentSecurityHeaders,
  productionSecurityHeaders
} from "app/middlewares/securityHeaders";

// Development mode - less restrictive
webserver.use(developmentSecurityHeaders());

// Production mode - most restrictive
webserver.use(productionSecurityHeaders());
```

#### Development vs Production

**Development Mode:**
- Allows all external resources (`http: https: data: blob:`)
- Includes Vite dev server (`http://localhost:${VITE_PORT || 5173}`)
- Disables HSTS (HTTP Strict Transport Security)
- Permissive for easier development

**Production Mode:**
- Strict CSP - only `https:` for external resources
- Enables HSTS with 1-year max-age
- All security headers active
- Maximum security enforcement

#### Content Security Policy (CSP)

The CSP is configured differently for development and production:

**Development:**
```
default-src 'self' http: https: data: blob:
script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: http://localhost:${VITE_PORT}
style-src 'self' 'unsafe-inline' http: https: http://localhost:${VITE_PORT}
img-src 'self' data: blob: http: https: http://localhost:${VITE_PORT}
font-src 'self' data: http: https: http://localhost:${VITE_PORT}
connect-src 'self' http: https: ws: wss: http://localhost:${VITE_PORT} ws://localhost:${VITE_PORT}
frame-ancestors 'self'
```

**Production:**
```
default-src 'self'
script-src 'self'
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
font-src 'self' data: https:
connect-src 'self' https:
frame-ancestors 'self'
```

This ensures:
- ✅ External fonts (Google Fonts, Inter, Fira Code) work in development
- ✅ Vite HMR works with WebSocket connections
- ✅ CDN resources can be loaded during development
- ✅ Production remains secure with strict policies

#### Available Options

```typescript
interface SecurityHeadersOptions {
  contentSecurityPolicy?: boolean | string;
  strictTransportSecurity?: boolean | string;
  xFrameOptions?: boolean | string;
  xContentTypeOptions?: boolean;
  xXSSProtection?: boolean | string;
  referrerPolicy?: boolean | string;
  permissionsPolicy?: boolean | string;
  crossOriginEmbedderPolicy?: boolean;
  crossOriginOpenerPolicy?: boolean | string;
  crossOriginResourcePolicy?: boolean | string;
}
```

#### Important Notes

⚠️ **CRITICAL:** The security middleware MUST use `async` pattern:

```typescript
// ✅ CORRECT - Async middleware
export function securityHeaders() {
  return async (request: Request, response: Response) => {
    // Set headers
    response.header('X-Frame-Options', 'DENY');
    // NO RETURN - automatically continues
  };
}

// ❌ WRONG - Non-async without next
export function securityHeaders() {
  return (request: Request, response: Response) => {
    response.header('X-Frame-Options', 'DENY');
    // Request will hang - no way to continue!
  };
}

// ❌ WRONG - Empty return
export function securityHeaders() {
  return async (request: Request, response: Response) => {
    response.header('X-Frame-Options', 'DENY');
    return; // This stops execution!
  };
}
```

---

### 5. Inertia Middleware

Handles Inertia.js responses for SPA-like experience.

**Location:** `app/middlewares/inertia.ts`

```typescript
import inertia from "app/middlewares/inertia";

// Apply globally in server.ts
webserver.use(inertia());

// Now you can use response.inertia() in controllers
public async index(request: Request, response: Response) => {
  const posts = await DB.from("posts");
  return response.inertia("posts/index", { posts });
}
```

#### How It Works

```typescript
const inertia = () => {
  return async (request: Request, response: Response) => {
    // Set up the flash method on response
    response.flash = (type: string, message: string, ttl: number = 3000) => {
      response.cookie(type, message, ttl);
      return response;
    };

    // Override redirect method
    response.redirect = ((url: string, status: number = 302) => {
      return response.status(status).setHeader("Location", url).send();
    }) as { (url: string): boolean; (url: string, status?: number): Response };

    // Set up the inertia method on response
    response.inertia = async (component: string, inertiaProps = {}, viewProps = {}) => {
      const url = request.originalUrl;

      // Merge shared props with inertia props
      let props: Record<string, unknown> = {
        ...request.share,
        user: request.user || {},
        ...inertiaProps
      };

      // Parse all flash messages from cookies
      const flashTypes = ['error', 'success', 'info', 'warning'];
      const flashMessages: Record<string, string> = {};

      for (const type of flashTypes) {
        if (request.cookies[type]) {
          flashMessages[type] = request.cookies[type];
          response.cookie(type, "", 0);
        }
      }

      // Add flash messages to props
      if (Object.keys(flashMessages).length > 0) {
        props.flash = flashMessages;
      }

      const inertiaObject = {
        component: component,
        props: props,
        url: url,
        version: pkg.version,
      };

      if (!request.header("X-Inertia")) {
        // Initial page load - return HTML
        const html = view("inertia.html", {
          page: JSON.stringify(inertiaObject),
          title: "Laju - LAJU - Hyper Performance TypeScript Monolith",
          ...viewProps
        });

        return response.type("html").send(html);
      }

      // Inertia request - return JSON
      response.setHeader("Vary", "Accept");
      response.setHeader("X-Inertia", "true");
      response.setHeader("X-Inertia-Version", pkg.version);

      return response.json(inertiaObject);
    };

    // CRITICAL: Must not call anything here to let request pass through to route handlers
  };
};
```

#### Features

- ✅ Flash message support (error, success, info, warning)
- ✅ Automatic flash message cleanup
- ✅ Shared props merging
- ✅ User prop automatically included
- ✅ Version tracking for cache busting
- ✅ Initial page load returns HTML
- ✅ Subsequent requests return JSON

#### Flash Messages

```typescript
// Set flash message in controller
public async store(request: Request, response: Response) {
  // ... create post logic
  return response.flash("success", "Post created successfully!")
    .redirect("/posts");
}

// Access in Svelte component
<script>
  let { flash } = $props();
</script>

{#if flash?.success}
  <div class="alert success">{flash.success}</div>
{/if}
```

#### Shared Props

```typescript
// Set shared props in middleware
request.share = { appName: "My App", theme: "dark" };

// Available in all Inertia responses
public async index(request: Request, response: Response) {
  return response.inertia("dashboard", { posts }); // Includes shared props
}
```

---

## Creating Custom Middleware

### Basic Middleware Template

```typescript
// app/middlewares/myMiddleware.ts
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  // Your logic here
  
  // Option 1: Continue to next handler (no return)
  request.customData = "some value";
  
  // Option 2: Stop and send response
  // return response.status(400).json({ error: "Bad request" });
}
```

### Example 1: Request Logger

```typescript
// app/middlewares/requestLogger.ts
import { Request, Response } from "../../type";
import { logInfo } from "../services/Logger";

export default async (request: Request, response: Response) => {
  const startTime = Date.now();
  
  logInfo("Request received", {
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  });
  
  // Continue to next handler
  request.startTime = startTime;
}
```

**Usage:**

```typescript
import requestLogger from "../app/middlewares/requestLogger";

// Apply to specific routes
Route.get("/api/data", [requestLogger], DataController.index);

// Or globally
webserver.use(requestLogger);
```

---

### Example 2: API Key Validation

```typescript
// app/middlewares/apiKey.ts
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  const apiKey = request.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return response.status(401).json({
      error: "API key is required",
      code: "MISSING_API_KEY"
    });
  }
  
  if (apiKey !== process.env.API_KEY) {
    return response.status(403).json({
      error: "Invalid API key",
      code: "INVALID_API_KEY"
    });
  }
  
  // Valid API key, continue
}
```

**Usage:**

```typescript
import apiKey from "../app/middlewares/apiKey";

Route.get("/api/external/data", [apiKey], ExternalController.getData);
```

---

### Example 3: Role-Based Access Control

```typescript
// app/middlewares/requireAdmin.ts
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  // Assumes Auth middleware ran first
  if (!request.user) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  
  if (!request.user.is_admin) {
    return response.status(403).json({ 
      error: "Admin access required" 
    });
  }
  
  // User is admin, continue
}
```

**Usage:**

```typescript
import Auth from "../app/middlewares/auth";
import requireAdmin from "../app/middlewares/requireAdmin";

// Both middleware must pass
Route.get("/admin/users", [Auth, requireAdmin], AdminController.users);
Route.delete("/admin/users/:id", [Auth, requireAdmin], AdminController.deleteUser);
```

---

### Example 4: Request Validation

```typescript
// app/middlewares/validatePost.ts
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  const { title, content } = await request.json();
  
  const errors: any = {};
  
  if (!title || title.trim().length === 0) {
    errors.title = "Title is required";
  }
  
  if (!content || content.trim().length < 10) {
    errors.content = "Content must be at least 10 characters";
  }
  
  if (Object.keys(errors).length > 0) {
    return response.status(422).json({
      error: "Validation failed",
      details: errors
    });
  }
  
  // Validation passed, continue
}
```

**Usage:**

```typescript
import validatePost from "../app/middlewares/validatePost";

Route.post("/posts", [Auth, validatePost], PostController.store);
```

---

### Example 5: CORS Middleware

```typescript
// app/middlewares/cors.ts
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
  const origin = request.headers.origin as string;
  
  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return response.status(204).send('');
  }
  
  // Continue for other methods
}
```

---

### Example 6: Request Timing

```typescript
// app/middlewares/timing.ts
import { Request, Response } from "../../type";
import { logInfo } from "../services/Logger";

export default async (request: Request, response: Response) => {
  const startTime = Date.now();
  
  // Store original send method
  const originalSend = response.send;
  
  // Override send to log timing
  response.send = function(body: any) {
    const duration = Date.now() - startTime;
    
    logInfo("Request completed", {
      method: request.method,
      url: request.url,
      duration: `${duration}ms`,
      status: response.statusCode
    });
    
    return originalSend.call(this, body);
  };
  
  // Continue
}
```

---

## Common Patterns

### Pattern 1: Conditional Middleware

```typescript
// app/middlewares/conditionalAuth.ts
import { Request, Response } from "../../type";
import SQLite from "../services/SQLite";

export default async (request: Request, response: Response) => {
  // Only check auth for non-public routes
  const publicRoutes = ['/login', '/register', '/'];
  
  if (publicRoutes.includes(request.path)) {
    return; // Skip auth check
  }
  
  // Check authentication for other routes
  if (!request.cookies.auth_id) {
    return response.redirect("/login");
  }
  
  const user = SQLite.get("SELECT * FROM users WHERE id = ?", [request.cookies.auth_id]);
  
  if (!user) {
    return response.redirect("/login");
  }
  
  request.user = user;
}
```

---

### Pattern 2: Middleware Factory

```typescript
// app/middlewares/requireRole.ts
import { Request, Response } from "../../type";

export function requireRole(role: string) {
  return async (request: Request, response: Response) => {
    if (!request.user) {
      return response.status(401).json({ error: "Unauthorized" });
    }
    
    if (request.user.role !== role) {
      return response.status(403).json({ 
        error: `${role} access required` 
      });
    }
    
    // User has required role
  };
}

// Usage
import { requireRole } from "../app/middlewares/requireRole";

Route.get("/admin/dashboard", [Auth, requireRole('admin')], AdminController.dashboard);
Route.get("/moderator/reports", [Auth, requireRole('moderator')], ModeratorController.reports);
```

---

### Pattern 3: Async Data Loading

```typescript
// app/middlewares/loadPost.ts
import { Request, Response } from "../../type";
import DB from "../services/DB";

export default async (request: Request, response: Response) => {
  const { id } = request.params;
  
  const post = await DB.from("posts").where("id", id).first();
  
  if (!post) {
    return response.status(404).json({ error: "Post not found" });
  }
  
  // Attach to request
  request.post = post;
  
  // Continue to handler
}

// Usage in controller
public async show(request: Request, response: Response) {
  // Post already loaded by middleware
  return response.json({ post: request.post });
}
```

---

### Pattern 4: Multiple Validators

```typescript
// app/middlewares/validators.ts
import { Request, Response } from "../../type";

export function validateEmail() {
  return async (request: Request, response: Response) => {
    const { email } = await request.json();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(422).json({ 
        error: "Valid email is required" 
      });
    }
  };
}

export function validatePassword() {
  return async (request: Request, response: Response) => {
    const { password } = await request.json();
    
    if (!password || password.length < 8) {
      return response.status(422).json({ 
        error: "Password must be at least 8 characters" 
      });
    }
  };
}

// Usage
import { validateEmail, validatePassword } from "../app/middlewares/validators";

Route.post("/register", [
  validateEmail(),
  validatePassword()
], AuthController.processRegister);
```

---

## Error Handling

### Try-Catch in Middleware

```typescript
// app/middlewares/safeMiddleware.ts
import { Request, Response } from "../../type";
import { logError } from "../services/Logger";

export default async (request: Request, response: Response) => {
  try {
    // Your middleware logic
    const data = await someAsyncOperation();
    request.data = data;
    
  } catch (error) {
    logError("Middleware error", { 
      error: error.message,
      stack: error.stack,
      url: request.url
    });
    
    return response.status(500).json({ 
      error: "Internal server error" 
    });
  }
}
```

---

### Global Error Handler

```typescript
// server.ts
webserver.set_error_handler((request, response, error) => {
  logError("Unhandled error", {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method
  });
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : error.message;
  
  return response.status(500).json({ error: message });
});
```

---

## Best Practices

### ✅ DO

**1. Keep middleware focused**
```typescript
// ✅ Good - Single responsibility
export default async (request: Request, response: Response) => {
  if (!request.user) {
    return response.redirect("/login");
  }
}
```

**2. Use descriptive names**
```typescript
// ✅ Good
import requireAdmin from "../app/middlewares/requireAdmin";
import validatePost from "../app/middlewares/validatePost";
```

**3. Order middleware correctly**
```typescript
// ✅ Good - Auth before authorization
Route.post("/admin/users", [Auth, requireAdmin], AdminController.createUser);

// ✅ Good - Validation before processing
Route.post("/posts", [Auth, validatePost, uploadRateLimit], PostController.store);
```

**4. Return response to stop execution**
```typescript
// ✅ Good
if (!isValid) {
  return response.status(400).json({ error: "Invalid" });
}
```

**5. Use TypeScript types**
```typescript
// ✅ Good
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
  // Fully typed
}
```

---

### ❌ DON'T

**1. Don't use next()**
```typescript
// ❌ Bad - HyperExpress doesn't have next()
export default async (request, response, next) => {
  console.log("Middleware");
  next(); // ❌ This doesn't exist
}
```

**2. Don't forget to return when stopping**
```typescript
// ❌ Bad - Missing return
if (!request.user) {
  response.redirect("/login"); // ❌ Will continue execution!
}

// ✅ Good
if (!request.user) {
  return response.redirect("/login");
}
```

**3. Don't put business logic in middleware**
```typescript
// ❌ Bad - Too much logic
export default async (request: Request, response: Response) => {
  const data = await request.json();
  const processed = await processData(data);
  const saved = await saveToDatabase(processed);
  request.result = saved;
}

// ✅ Good - Delegate to service
export default async (request: Request, response: Response) => {
  const data = await request.json();
  if (!isValid(data)) {
    return response.status(400).json({ error: "Invalid" });
  }
}
```

**4. Don't modify response after sending**
```typescript
// ❌ Bad
return response.json({ success: true });
response.setHeader('X-Custom', 'value'); // ❌ Too late!

// ✅ Good
response.setHeader('X-Custom', 'value');
return response.json({ success: true });
```

---

## Summary

### Key Takeaways

1. **No `next()` function** - Return response to stop, no return to continue
2. **Order matters** - Middleware executes in array order
3. **Return to stop** - Always return when sending response
4. **Keep focused** - One responsibility per middleware
5. **Use built-in** - Auth, CSRF, rate limiting, Inertia, security headers already available

### Built-in Middleware Summary

| Middleware | Purpose | Location |
|------------|---------|----------|
| `Auth` | Session-based authentication | `app/middlewares/auth.ts` |
| `csrf()` / `csrfCheck()` | CSRF protection with token rotation | `app/middlewares/csrf.ts` |
| `rateLimit()` | Flexible rate limiting with presets | `app/middlewares/rateLimit.ts` |
| `securityHeaders()` | Security headers (CSP, HSTS, etc.) | `app/middlewares/securityHeaders.ts` |
| `inertia()` | Inertia.js response handling | `app/middlewares/inertia.ts` |

### Quick Reference

```typescript
// Continue to next handler
export default async (request: Request, response: Response) => {
  request.data = "value";
  // No return
}

// Stop and send response
export default async (request: Request, response: Response) => {
  return response.json({ error: "Error" });
}

// Conditional execution
export default async (request: Request, response: Response) => {
  if (condition) {
    return response.redirect("/login");
  }
  // Continues if condition is false
}
```

---

## Next Steps

- [Authentication Guide](04-AUTHENTICATION.md) - Session management
- [API Reference](07-API-REFERENCE.md) - Request/Response methods
- [Best Practices](09-BEST-PRACTICES.md) - Code organization
- [Security Guide](09a-SECURITY.md) - Input validation, XSS, CSRF
