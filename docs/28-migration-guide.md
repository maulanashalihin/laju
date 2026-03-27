# Migration Guide: Controllers to Handlers

Complete guide for migrating from Laravel-style controllers to domain-based handlers in Laju Framework.

---

## Overview

Laju Framework has migrated from a **Laravel-style MVC pattern** with multiple controllers per domain to a **Handler-based pattern** with consolidated domain files.

### Why Migrate?

| Aspect | Controllers (Old) | Handlers (New) | Benefit |
|--------|------------------|----------------|---------|
| **Organization** | Multiple files per domain | Single file per domain | Easier navigation |
| **Naming** | `AuthController.ts`, `LoginController.ts`, `RegisterController.ts` | `auth.handler.ts` | Consistent naming |
| **Imports** | Different import for each controller | Single import per domain | Cleaner code |
| **Maintenance** | Scattered related logic | Consolidated domain logic | Easier maintenance |

---

## What Changed

### Directory Structure

```diff
app/
- ├── controllers/
- │   ├── LoginController.ts
- │   ├── RegisterController.ts
- │   ├── PasswordController.ts
- │   ├── ProfileController.ts
- │   ├── OAuthController.ts
- │   ├── HomeController.ts
- │   ├── UploadController.ts
- │   ├── S3Controller.ts
- │   └── StorageController.ts
+ ├── handlers/
+ │   ├── auth.handler.ts        # All authentication logic
+ │   ├── app.handler.ts         # Application pages
+ │   ├── public.handler.ts      # Public pages
+ │   ├── upload.handler.ts      # File uploads
+ │   ├── s3.handler.ts          # S3 operations
+ │   ├── storage.handler.ts     # Local storage
+ │   └── asset.handler.ts       # Static assets
```

### File Naming

| Old Pattern | New Pattern |
|-------------|-------------|
| `PascalCase` + `Controller.ts` | `kebab-case` + `.handler.ts` |
| `AuthController.ts` | `auth.handler.ts` |
| `LoginController.ts` | *(merged into)* `auth.handler.ts` |

### Export Pattern

```typescript
// ❌ OLD: Multiple controllers
// app/controllers/LoginController.ts
export const LoginController = { ... };
export default LoginController;

// app/controllers/RegisterController.ts
export const RegisterController = { ... };
export default RegisterController;

// ✅ NEW: Single handler per domain
// app/handlers/auth.handler.ts
export const AuthHandler = {
  loginPage() { ... },
  processLogin() { ... },
  registerPage() { ... },
  processRegister() { ... },
  // ... all auth-related methods
};
export default AuthHandler;
```

---

## Migration Steps

### Step 1: Identify Your Controllers

List all controllers you're currently using:

```bash
ls app/controllers/
```

Example output:
```
LoginController.ts
RegisterController.ts
PasswordController.ts
ProfileController.ts
OAuthController.ts
```

### Step 2: Map Controllers to Handlers

| Old Controllers | New Handler |
|-----------------|-------------|
| `LoginController.ts` | `auth.handler.ts` |
| `RegisterController.ts` | `auth.handler.ts` |
| `PasswordController.ts` | `auth.handler.ts` |
| `OAuthController.ts` | `auth.handler.ts` |
| `ProfileController.ts` | `app.handler.ts` |
| `HomeController.ts` | `app.handler.ts` |
| `UploadController.ts` | `upload.handler.ts` |
| `S3Controller.ts` | `s3.handler.ts` |
| `StorageController.ts` | `storage.handler.ts` |
| `AssetController.ts` | `asset.handler.ts` |

### Step 3: Create Handler Files

For each domain, create a single handler file:

```typescript
// app/handlers/auth.handler.ts
import { UserRepository } from "../repositories/user.repository";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { Response, Request } from "../../type";

export const AuthHandler = {
  // From LoginController
  async loginPage(request: Request, response: Response) {
    return response.inertia("auth/login");
  },

  async processLogin(request: Request, response: Response) {
    const body = await request.json();
    const validationResult = Validator.validate(loginSchema, body);
    
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || "Validation error";
      return response.flash("error", firstError).redirect("/login");
    }

    const { email, password } = validationResult.data!;
    // ... login logic
  },

  // From RegisterController
  async registerPage(request: Request, response: Response) {
    return response.inertia("auth/register");
  },

  async processRegister(request: Request, response: Response) {
    // ... register logic
  },

  // From PasswordController
  async forgotPasswordPage(request: Request, response: Response) {
    return response.inertia("auth/forgot-password");
  },

  // ... all other auth methods
};

export default AuthHandler;
```

### Step 4: Update Routes

Update your route definitions to use handlers:

```typescript
// routes/web.ts

// ❌ OLD
import LoginController from "../app/controllers/LoginController";
import RegisterController from "../app/controllers/RegisterController";

Route.get("/login", LoginController.loginPage);
Route.post("/login", LoginController.processLogin);
Route.get("/register", RegisterController.registerPage);
Route.post("/register", RegisterController.processRegister);

// ✅ NEW
import AuthHandler from "../app/handlers/auth.handler";

Route.get("/login", AuthHandler.loginPage);
Route.post("/login", AuthHandler.processLogin);
Route.get("/register", AuthHandler.registerPage);
Route.post("/register", AuthHandler.processRegister);
```

### Step 5: Update Imports in Tests

If you have tests that import controllers:

```typescript
// ❌ OLD
import LoginController from "../app/controllers/LoginController";

// ✅ NEW
import AuthHandler from "../app/handlers/auth.handler";
```

### Step 6: Delete Old Controller Files

After confirming everything works:

```bash
rm app/controllers/LoginController.ts
rm app/controllers/RegisterController.ts
rm app/controllers/PasswordController.ts
rm app/controllers/OAuthController.ts
rm app/controllers/ProfileController.ts
rm app/controllers/HomeController.ts
rm app/controllers/UploadController.ts
rm app/controllers/S3Controller.ts
rm app/controllers/StorageController.ts
rm app/controllers/AssetController.ts
```

---

## Code Comparison

### Authentication Example

#### Before: Multiple Controllers

```typescript
// app/controllers/LoginController.ts
import { Request, Response } from "../../type";
import UserRepository from "../repositories/user.repository";
import Authenticate from "../services/Authenticate";

export const LoginController = {
  async loginPage(request: Request, response: Response) {
    return response.inertia("auth/login");
  },

  async processLogin(request: Request, response: Response) {
    const body = await request.json();
    const { email, password } = body;
    
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return response.flash("error", "Invalid credentials").redirect("/login");
    }

    const valid = await Authenticate.compare(password, user.password);
    if (!valid) {
      return response.flash("error", "Invalid credentials").redirect("/login");
    }

    await Authenticate.process(user, request, response);
  }
};

export default LoginController;
```

```typescript
// app/controllers/RegisterController.ts
import { Request, Response } from "../../type";
import UserRepository from "../repositories/user.repository";
import Authenticate from "../services/Authenticate";

export const RegisterController = {
  async registerPage(request: Request, response: Response) {
    return response.inertia("auth/register");
  },

  async processRegister(request: Request, response: Response) {
    const body = await request.json();
    const { email, password, name } = body;
    
    const exists = await UserRepository.emailExists(email);
    if (exists) {
      return response.flash("error", "Email already registered").redirect("/register");
    }

    const user = await UserRepository.create({
      email,
      password: await Authenticate.hash(password),
      name
    });

    await Authenticate.process(user, request, response);
  }
};

export default RegisterController;
```

#### After: Single Handler

```typescript
// app/handlers/auth.handler.ts
import { UserRepository } from "../repositories/user.repository";
import Authenticate from "../services/Authenticate";
import Validator from "../services/Validator";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { Response, Request } from "../../type";

export const AuthHandler = {
  async loginPage(request: Request, response: Response) {
    return response.inertia("auth/login");
  },

  async processLogin(request: Request, response: Response) {
    try {
      const body = await request.json();
      const validationResult = Validator.validate(loginSchema, body);
      
      if (!validationResult.success) {
        const firstError = Object.values(validationResult.errors || {})[0]?.[0] || "Validation error";
        return response.flash("error", firstError).redirect("/login");
      }

      const { email, password } = validationResult.data!;
      const user = await UserRepository.findByEmail(email.toLowerCase());
      
      if (!user) {
        return response.flash("error", "Email not registered").redirect("/login");
      }

      const valid = await Authenticate.compare(password, user.password);
      if (!valid) {
        return response.flash("error", "Invalid credentials").redirect("/login");
      }

      return Authenticate.process(user, request, response);
    } catch (error) {
      console.error("Login error:", error);
      return response.flash("error", "An error occurred").redirect("/login");
    }
  },

  async registerPage(request: Request, response: Response) {
    return response.inertia("auth/register");
  },

  async processRegister(request: Request, response: Response) {
    try {
      const body = await request.json();
      const validationResult = Validator.validate(registerSchema, body);
      
      if (!validationResult.success) {
        const firstError = Object.values(validationResult.errors || {})[0]?.[0] || "Validation error";
        return response.flash("error", firstError).redirect("/register");
      }

      const { email, password, name } = validationResult.data!;
      
      const exists = await UserRepository.emailExists(email);
      if (exists) {
        return response.flash("error", "Email already registered").redirect("/register");
      }

      const user = await UserRepository.create({
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        password: await Authenticate.hash(password),
        name
      });

      return Authenticate.process(user, request, response);
    } catch (error) {
      console.error("Registration error:", error);
      return response.flash("error", "An error occurred").redirect("/register");
    }
  }
};

export default AuthHandler;
```

---

## Import Path Changes

### In Routes

```typescript
// ❌ OLD
import AuthController from "../app/controllers/AuthController";
import HomeController from "../app/controllers/HomeController";

// ✅ NEW
import AuthHandler from "../app/handlers/auth.handler";
import AppHandler from "../app/handlers/app.handler";
```

### In Tests

```typescript
// ❌ OLD
import { LoginController } from "../app/controllers/LoginController";

// ✅ NEW
import { AuthHandler } from "../app/handlers/auth.handler";
```

---

## Common Patterns

### Handler Structure

```typescript
// app/handlers/[domain].handler.ts
import { Response, Request } from "../../type";
import Validator from "../services/Validator";
import { [domain]Schema } from "../validators/[domain].validator";

export const [Domain]Handler = {
  /**
   * Method description
   * HTTP_METHOD /route
   */
  async methodName(request: Request, response: Response) {
    // 1. Validate input
    const validationResult = Validator.validate(schema, body);
    if (!validationResult.success) {
      // Handle validation error
    }

    // 2. Business logic
    // ...

    // 3. Response
    return response.redirect("/path");
  }
};

export default [Domain]Handler;
```

### Route Definitions

```typescript
// routes/web.ts
import AuthHandler from "../app/handlers/auth.handler";
import AppHandler from "../app/handlers/app.handler";
import Auth from "../app/middlewares/auth.middleware";

// Public routes
Route.get("/login", AuthHandler.loginPage);
Route.post("/login", AuthHandler.processLogin);

// Protected routes
Route.get("/profile", [Auth], AppHandler.profilePage);
Route.post("/change-profile", [Auth], AppHandler.changeProfile);
```

---

## Checklist

### Migration Checklist

- [ ] Create handler files in `app/handlers/`
- [ ] Copy methods from controllers to handlers
- [ ] Update route imports
- [ ] Update test imports
- [ ] Test all routes
- [ ] Delete old controller files
- [ ] Update documentation

### Testing Checklist

- [ ] Login/logout works
- [ ] Registration works
- [ ] Password reset works
- [ ] Protected routes require auth
- [ ] File uploads work
- [ ] All routes respond correctly

---

## Troubleshooting

### Issue: "Module not found"

**Solution:** Check import path:
```typescript
// ✅ Correct
import AuthHandler from "../app/handlers/auth.handler";

// ❌ Wrong
import AuthHandler from "../app/handlers/AuthHandler";
```

### Issue: "Property does not exist on type"

**Solution:** Ensure handler exports match:
```typescript
export const AuthHandler = {
  loginPage: async (request: Request, response: Response) => { ... },
  // ... all methods
};

export default AuthHandler;
```

### Issue: Routes not working after migration

**Solution:** Verify route definitions:
```typescript
// Check routes/web.ts
Route.get("/login", AuthHandler.loginPage); // ✅ Correct
Route.get("/login", AuthHandler); // ❌ Wrong - missing method
```

---

## Next Steps

After migration:

1. **[Routing & Handlers](04-routing-handlers.md)** - Learn handler patterns
2. **[Project Structure](02-project-structure.md)** - Understand new structure
3. **[Best Practices](17-best-practices.md)** - Follow conventions

---

## Need Help?

- **[Troubleshooting](99-troubleshooting.md)** - Common errors
- **[GitHub Issues](https://github.com/maulanashalihin/laju/issues)** - Report bugs
- **[Documentation](https://docs.laju.dev)** - Full docs
