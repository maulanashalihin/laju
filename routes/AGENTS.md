# Route Guide for AI

## Core Principles

1. **Organize by feature** - Group related routes together
2. **Apply rate limiting** - Use appropriate rate limits for auth/API routes
3. **Middleware order matters** - Execute in array order
4. **Catch-all last** - Must be the final route
5. **Export router** - Always export the Route instance

## Basic Pattern

```typescript
import HyperExpress from 'hyper-express';
import Controller from "../app/controllers/Controller";
import Middleware from "../app/middlewares/middleware";

const Route = new HyperExpress.Router();

Route.get("/path", [Middleware], Controller.method);
Route.post("/path", [Middleware], Controller.method);
Route.put("/path/:id", [Middleware], Controller.method);
Route.delete("/path/:id", [Middleware], Controller.method);

export default Route;
```

## Route Organization

Group routes with clear comments:

```typescript
/**
 * Public Routes
 * ------------------------------------------------
 * GET  / - Home page
 * GET  /about - About page
 */
Route.get("/", HomeController.index);
Route.get("/about", HomeController.about);

/**
 * Authentication Routes
 * ------------------------------------------------
 * GET   /login - Login page
 * POST  /login - Process login
 * GET   /register - Registration page
 * POST  /register - Process registration
 */
Route.get("/login", LoginController.loginPage);
Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.get("/register", RegisterController.registerPage);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);

/**
 * Protected Routes
 * ------------------------------------------------
 * GET   /dashboard - User dashboard
 * GET   /profile - User profile
 */
Route.get("/dashboard", [Auth], DashboardController.index);
Route.get("/profile", [Auth], ProfileController.edit);
```

## Rate Limiting

Import and apply rate limiters:

```typescript
import {
  authRateLimit,           // 5 req/15min - Login/logout
  apiRateLimit,            // 100 req/15min - API endpoints
  passwordResetRateLimit,  // 3 req/hour - Password reset
  createAccountRateLimit,  // 3 req/hour - Registration
  uploadRateLimit          // 50 req/hour - File uploads
} from "../app/middlewares/rateLimit";

// Authentication routes
Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);
Route.post("/forgot-password", [passwordResetRateLimit], PasswordController.sendResetPassword);

// API routes
Route.post("/api/*", [apiRateLimit], ApiController.method);

// Upload routes
Route.post("/upload", [uploadRateLimit], UploadController.upload);
```

## Route Parameters

```typescript
Route.get("/users/:id", UserController.show);
Route.get("/posts/:postId/comments/:commentId", CommentController.show);
```

Access in controller:
```typescript
const id = request.params.id;
const postId = request.params.postId;
```

## Middleware Order

Middlewares execute in array order:

```typescript
Route.get("/protected", [Auth, RateLimit], Controller.method);
// Auth runs first, then RateLimit, then Controller
```

## Catch-All Routes

**Must be the LAST route in the file:**

```typescript
// Public assets - Always last
Route.get("/public/*", AssetController.publicFolder);
```

Catch-all routes match any path, so they must come after all specific routes.

## RESTful Resource Routes

Standard CRUD pattern:

```typescript
Route.get("/posts", PostController.index);           // List
Route.get("/posts/create", PostController.create);   // Create form
Route.post("/posts", PostController.store);          // Store
Route.get("/posts/:id", PostController.show);        // Show
Route.get("/posts/:id/edit", PostController.edit);   // Edit form
Route.put("/posts/:id", PostController.update);      // Update
Route.delete("/posts/:id", PostController.destroy);  // Delete
```

## SSR vs Inertia Routes

**SSR (Public, SEO):**
```typescript
Route.get("/", HomeController.index);  // Landing page
Route.get("/blog", BlogController.index);  // Blog posts
```

**Inertia (Protected):**
```typescript
Route.get("/dashboard", [Auth], DashboardController.index);
Route.get("/profile", [Auth], ProfileController.edit);
```

## Complete Example

```typescript
import HyperExpress from 'hyper-express';
import HomeController from "../app/controllers/HomeController";
import PostController from "../app/controllers/PostController";
import Auth from "../app/middlewares/auth";
import AssetController from "../app/controllers/AssetController";
import { authRateLimit, apiRateLimit } from "../app/middlewares/rateLimit";

const Route = new HyperExpress.Router();

/**
 * Public Routes
 * ------------------------------------------------
 * GET  / - Home page
 * GET  /about - About page
 */
Route.get("/", HomeController.index);
Route.get("/about", HomeController.about);

/**
 * Post Routes (Public)
 * ------------------------------------------------
 * GET  /posts - List all posts
 * GET  /posts/:id - Show single post
 */
Route.get("/posts", PostController.index);
Route.get("/posts/:id", PostController.show);

/**
 * Post Routes (Protected)
 * ------------------------------------------------
 * GET   /posts/create - Create form
 * POST  /posts - Store new post
 * GET   /posts/:id/edit - Edit form
 * PUT   /posts/:id - Update post
 * DELETE /posts/:id - Delete post
 */
Route.get("/posts/create", [Auth], PostController.create);
Route.post("/posts", [Auth, authRateLimit], PostController.store);
Route.get("/posts/:id/edit", [Auth], PostController.edit);
Route.put("/posts/:id", [Auth, authRateLimit], PostController.update);
Route.delete("/posts/:id", [Auth], PostController.destroy);

/**
 * API Routes
 * ------------------------------------------------
 * POST /api/posts - API endpoint
 */
Route.post("/api/posts", [apiRateLimit], ApiController.store);

/**
 * Static Assets - Always Last
 * ------------------------------------------------
 * GET /public/* - Serve public files
 */
Route.get("/public/*", AssetController.publicFolder);

export default Route;
```

## Quick Reference

| Method | Pattern | Example |
|--------|---------|---------|
| GET | `Route.get()` | `Route.get("/users", UserController.index)` |
| POST | `Route.post()` | `Route.post("/users", UserController.store)` |
| PUT | `Route.put()` | `Route.put("/users/:id", UserController.update)` |
| DELETE | `Route.delete()` | `Route.delete("/users/:id", UserController.destroy)` |
| With Middleware | `[Middleware]` | `Route.get("/protected", [Auth], Controller.method)` |
| With Params | `:param` | `Route.get("/users/:id", UserController.show)` |

## Rate Limit Reference

| Limiter | Window | Max | Use Case |
|---------|--------|-----|----------|
| `authRateLimit` | 15 min | 5 | Login/logout |
| `apiRateLimit` | 15 min | 100 | API endpoints |
| `passwordResetRateLimit` | 1 hour | 3 | Password reset |
| `createAccountRateLimit` | 1 hour | 3 | Registration |
| `uploadRateLimit` | 1 hour | 50 | File uploads |
| `emailRateLimit` | 1 hour | 10 | Email sending |
| `generalRateLimit` | 15 min | 1000 | General routes |