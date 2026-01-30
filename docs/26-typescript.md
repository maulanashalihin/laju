# TypeScript Configuration

Laju uses TypeScript 5 with strict mode enabled for maximum type safety and developer experience.

## Overview

TypeScript configuration in Laju is designed to:
- Catch errors at compile-time rather than runtime
- Provide excellent IntelliSense and autocomplete
- Enforce best practices through strict type checking
- Enable type-safe development with custom types and interfaces

## Configuration File

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2021",
    "lib": ["es2021"],
    "skipLibCheck": true,
    "sourceMap": true,
    "outDir": "./build",
    "module": "commonjs",
    "moduleResolution": "node",
    "removeComments": true,

    // Strict Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,

    // Additional Checks
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,

    // Path Aliases
    "baseUrl": ".",
    "paths": {
      "app/*": ["app/*"],
      "routes/*": ["routes/*"],
      "resources/*": ["resources/*"],
      "type/*": ["type/*"]
    }
  },
  "include": ["./*.ts", "type/index.d.ts", "commands", "migrations", "seeds"]
}
```

## Strict Mode Settings

Laju enables all TypeScript strict mode options:

### `strict: true`
Enables all strict type checking options at once.

### `noImplicitAny: true`
Prevents variables from having an implicit `any` type.

```typescript
// ❌ Error: Parameter 'user' implicitly has an 'any' type
function process(user) {
  return user.id;
}

// ✅ Correct: Explicit type annotation
function process(user: User) {
  return user.id;
}
```

### `strictNullChecks: true`
Ensures `null` and `undefined` are handled explicitly.

```typescript
// ❌ Error: Object is possibly 'undefined'
const id = user?.id;

// ✅ Correct: Handle undefined case
if (!user) {
  return response.status(401).json({ error: 'Unauthorized' });
}
const id = user.id;
```

### `strictFunctionTypes: true`
Enforces stricter checking for function parameters.

## Path Aliases

Laju provides convenient path aliases for cleaner imports:

```typescript
// Instead of:
import HomeController from "../../../app/controllers/HomeController";

// Use:
import HomeController from "app/controllers/HomeController";
```

Available aliases:
- `app/*` - Application logic (controllers, services, etc.)
- `routes/*` - Route definitions
- `resources/*` - Frontend resources (Svelte components, styles)
- `type/*` - Type definitions

## Custom Types

### User Interface

```typescript
// type/index.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_admin: boolean;
  is_verified: boolean;
}
```

### Request & Response Types

Laju extends HyperExpress's Request and Response with custom properties:

```typescript
// type/hyper-express.d.ts
declare module 'hyper-express' {
  interface Request {
    user?: User;  // Authenticated user
    share?: any;  // Shared data between middlewares
  }

  interface Response {
    view(view: string, data?: any): void;
    inertia(component: string, data?: any): void;
    flash(message: string, data: any): Response;
  }
}
```

### Using Custom Types

```typescript
import { Request, Response, User } from "type";

class ProfileController {
  public async update(request: Request, response: Response) {
    // TypeScript knows request.user might be undefined
    if (!request.user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    // TypeScript knows user is defined here
    const user: User = request.user;
    // ...
  }
}
```

## Type Guards

### Authentication Guard

When using the `Auth` middleware, TypeScript still requires null checks:

```typescript
Route.get("/profile", [Auth], ProfileController.profilePage);

// In controller:
public async profilePage(request: Request, response: Response) {
  // Still need to check - TypeScript doesn't know middleware ran
  if (!request.user) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  // Now TypeScript knows user is defined
  console.log(request.user.name);
}
```

## Common TypeScript Patterns in Laju

### 1. Controller Methods

```typescript
class HomeController {
  public async index(request: Request, response: Response) {
    try {
      const html = view("index.html");
      return response.type("html").send(html);
    } catch (error) {
      // Error is typed as 'any' - use type assertion if needed
      console.error("Error:", error);
      return response.status(500).send("Internal Server Error");
    }
  }
}
```

### 2. Middleware

```typescript
export function myMiddleware() {
  return async (request: Request, response: Response) => {
    // Access custom properties
    const user = request.user;

    // Use custom methods
    response.inertia("Dashboard", { props });
  };
}
```

### 3. Service Classes

```typescript
export class AuthService {
  async process(user: User, request: Request, response: Response) {
    // Type-safe user object
    const userId = user.id;

    // Returns Response for chaining
    return response
      .cookie("auth_id", token, 1000 * 60 * 60 * 24 * 60)
      .redirect("/home");
  }
}
```

## Build Process

### Development
```bash
npm run dev
```
TypeScript is compiled on-the-fly by `ts-node` for rapid development.

### Production
```bash
npm run build
```
This compiles TypeScript to JavaScript in the `build/` directory:
```bash
tsc && tsc-alias -p tsconfig.json && mkdir -p dist/views && cp -rf resources/views/partials dist/views
```

## Type Checking

To check types without building:
```bash
npx tsc --noEmit
```

This will report all type errors without generating output files.

## Best Practices

### 1. Always Type Function Parameters

```typescript
// ❌ Bad
function getUser(id) {
  return db.find(id);
}

// ✅ Good
function getUser(id: string): Promise<User | null> {
  return db.find(id);
}
```

### 2. Handle Nullable Types Properly

```typescript
// ❌ Bad - crashes if user is null
const email = user.email;

// ✅ Good - handle null case
if (!user) {
  throw new Error('User not found');
}
const email = user.email;
```

### 3. Use Type Guards for User Input

```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = schema.safeParse(body);
if (!result.success) {
  return response.status(400).json({ errors: result.error });
}

// data is now properly typed
const { email, password } = result.data;
```

### 4. Leverage Path Aliases

```typescript
// ❌ Bad - relative paths
import { DB } from "../../../services/DB";

// ✅ Good - path alias
import { DB } from "app/services/DB";
```

### 5. Controller Method Calls - No `this` Context

**CRITICAL:** Laju exports controller instances, not classes. This means `this` doesn't work in controller methods.

```typescript
// ❌ WRONG - Using 'this' will cause runtime error
class UserController {
  public async store(request: Request, response: Response) {
    const validated = this.validateUser(data); // Error: this is undefined
  }

  private validateUser(data: any) { /* ... */ }
}

export default new UserController();
```

```typescript
// ✅ CORRECT - Use static methods
class UserController {
  public async store(request: Request, response: Response) {
    const validated = UserController.validateUser(data); // Works!
  }

  private static validateUser(data: any) { /* ... */ }
}

export default new UserController();
```

```typescript
// ✅ ALSO CORRECT - Extract to separate utility function
import { validateUser } from "utils/validation";

class UserController {
  public async store(request: Request, response: Response) {
    const validated = validateUser(data); // Works!
  }
}

export default new UserController();
```

**Why?** Controllers are exported as instances (`new UserController()`), and when methods are passed as function references to routes, the `this` context is lost.

## Troubleshooting

### Type Errors After Updates

If you see type errors after updating Laju:

1. **Clean and rebuild:**
   ```bash
   rm -rf build dist
   npm run build
   ```

2. **Check TypeScript version:**
   ```bash
   npm list typescript
   # Should be 5.6.3 or higher
   ```

3. **Clear IDE cache:**
   - VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

### "Cannot find module" Errors

Ensure `tsconfig.json` paths are configured correctly and your IDE is using the workspace TypeScript version.

### Type Errors with HyperExpress

The type augmentation is in `type/hyper-express.d.ts`. If you see errors about missing properties:

1. Check that `type/index.d.ts` imports the augmentation
2. Restart your TypeScript server
3. Ensure `tsconfig.json` includes the `type/` directory

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript 5 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
- [HyperExpress Documentation](https://hyper-express.js.org/)
- [Zod Validation](https://zod.dev/)
