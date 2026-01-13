# Laju Routing

## Route Pattern

```typescript
import Route from "hyper-express";
import Controller from "../app/controllers/Controller";
import Middleware from "../app/middlewares/middleware";

Route.get("/path", [Middleware1, Middleware2], Controller.method);
Route.post("/path", [Middleware], Controller.method);
Route.put("/path/:id", [Middleware], Controller.method);
Route.delete("/path/:id", [Middleware], Controller.method);
```

## Middleware Order

Middlewares execute in the order they appear in the array:

```typescript
Route.get("/protected", [Auth, RateLimit], Controller.method);
// Auth runs first, then RateLimit, then Controller
```

## Route Grouping

Organize routes with clear comments:

```typescript
/**
 * Authentication Routes
 * ------------------------------------------------
 * GET  /login - Login page
 * POST /login - Process login
 */
Route.get("/login", LoginController.loginPage);
Route.post("/login", [authRateLimit], LoginController.processLogin);
```

## Catch-All Routes

**Must be the LAST route in the file**:

```typescript
Route.get("/public/*", AssetController.publicFolder); // Always last
```

Catch-all routes match any path, so they must come after all specific routes.

## Rate Limiting

Apply rate limiting to auth and API routes:

```typescript
import {
  authRateLimit,
  apiRateLimit,
  passwordResetRateLimit,
  createAccountRateLimit,
  uploadRateLimit
} from "../app/middlewares/rateLimit";

Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.post("/api/*", [apiRateLimit], ApiController.method);
Route.post("/forgot-password", [passwordResetRateLimit], PasswordController.sendResetPassword);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);
Route.post("/upload", [uploadRateLimit], UploadController.process);
```

## Route Parameters

```typescript
Route.get("/users/:id", UserController.show);
Route.get("/posts/:postId/comments/:commentId", CommentController.show);
```

Access parameters in controller:
```typescript
const id = request.params.id;
const postId = request.params.postId;
```

## Export Route

Always export the router instance:

```typescript
export default Route;
```

Import in `server.ts`:
```typescript
import Route from "./routes/web";
app.use(Route);
```
