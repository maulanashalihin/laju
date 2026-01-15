# Route Guide for AI

## Core Principles

1. **Organize by feature** - Group related routes together with comments
2. **Use middleware only as needed** - Don't overuse, apply selectively
3. **Middleware order matters** - Execute in array order
4. **Catch-all last** - Must be the final route
5. **Export router** - Always export the Route instance

## Basic Pattern

```typescript
import HyperExpress from 'hyper-express';
import Controller from "../app/controllers/Controller";
import { Auth, authRateLimit } from "../app/middlewares";

const Route = new HyperExpress.Router();

Route.get("/path", [Middleware], Controller.method);
Route.post("/path", [Middleware], Controller.method);
Route.put("/path/:id", [Middleware], Controller.method);
Route.delete("/path/:id", [Middleware], Controller.method);

export default Route;
```

## Middleware Usage

**Available Middlewares:**
- `Auth` - Check user session (protected routes)
- `authRateLimit` - 5 req/15min (login/logout)
- `apiRateLimit` - 100 req/15min (API endpoints)
- `passwordResetRateLimit` - 3 req/hour (password reset)
- `createAccountRateLimit` - 3 req/hour (registration)
- `uploadRateLimit` - 50 req/hour (file uploads)

**When to use middleware:**

| Route Type | Auth | Rate Limit | Example |
|------------|------|------------|---------|
| Public GET | No | No | `Route.get("/", HomeController.index)` |
| Public POST | No | Yes | `Route.post("/login", [authRateLimit], LoginController.processLogin)` |
| Protected GET | Yes | No | `Route.get("/dashboard", [Auth], DashboardController.index)` |
| Protected POST | Yes | Yes | `Route.post("/api/posts", [Auth, apiRateLimit], PostController.store)` |

**Import:**
```typescript
import { Auth, authRateLimit, apiRateLimit, createAccountRateLimit, passwordResetRateLimit, uploadRateLimit } from "../app/middlewares";
```

## Route Organization

```typescript
/**
 * Public Routes
 * ------------------------------------------------
 */
Route.get("/", HomeController.index);
Route.get("/about", HomeController.about);

/**
 * Authentication Routes (with rate limiting)
 * ------------------------------------------------
 */
Route.get("/login", LoginController.loginPage);
Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.get("/register", RegisterController.registerPage);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);

/**
 * Protected Routes (require Auth)
 * ------------------------------------------------
 */
Route.get("/dashboard", [Auth], DashboardController.index);
Route.get("/profile", [Auth], ProfileController.edit);

/**
 * API Routes (require Auth + rate limiting)
 * ------------------------------------------------
 */
Route.get("/api/posts", [Auth, apiRateLimit], PostController.index);
Route.post("/api/posts", [Auth, apiRateLimit], PostController.store);
```

## RESTful Resource Routes

```typescript
Route.get("/posts", PostController.index);           // List
Route.get("/posts/form", [Auth], PostController.form); // Create/Edit form (reusable)
Route.post("/posts", [Auth, apiRateLimit], PostController.store); // Store
Route.get("/posts/:id", PostController.show);        // Show
Route.put("/posts/:id", [Auth, apiRateLimit], PostController.update); // Update
Route.delete("/posts/:id", [Auth, apiRateLimit], PostController.destroy); // Delete
```

## Catch-All Routes

**Must be the LAST route:**
```typescript
Route.get("/public/*", AssetController.publicFolder);
Route.get("/storage/*", StorageController.serveFile);
```

## Quick Reference

| Pattern | Example |
|---------|---------|
| Public GET | `Route.get("/", HomeController.index)` |
| Public POST | `Route.post("/login", [authRateLimit], LoginController.processLogin)` |
| Protected GET | `Route.get("/dashboard", [Auth], DashboardController.index)` |
| Protected POST | `Route.post("/api/posts", [Auth, apiRateLimit], PostController.store)` |
| With Params | `Route.get("/posts/:id", PostController.show)` |