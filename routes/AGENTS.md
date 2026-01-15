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

```typescript
import {
  authRateLimit,           // 5 req/15min - Login/logout
  apiRateLimit,            // 100 req/15min - API endpoints
  passwordResetRateLimit,  // 3 req/hour - Password reset
  createAccountRateLimit,  // 3 req/hour - Registration
  uploadRateLimit          // 50 req/hour - File uploads
} from "../app/middlewares/rateLimit";

Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);
Route.post("/api/*", [apiRateLimit], ApiController.method);
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

```typescript
Route.get("/protected", [Auth, RateLimit], Controller.method);
// Auth runs first, then RateLimit, then Controller
```

## Catch-All Routes

**Must be the LAST route:**
```typescript
Route.get("/public/*", AssetController.publicFolder);
```

## RESTful Resource Routes

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
Route.get("/", HomeController.index);
Route.get("/blog", BlogController.index);
```

**Inertia (Protected):**
```typescript
Route.get("/dashboard", [Auth], DashboardController.index);
Route.get("/profile", [Auth], ProfileController.edit);
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