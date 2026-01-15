# Validation Guide

Laju uses **Zod** for type-safe and easy-to-use input validation.

## Installation

Zod is already included in Laju dependencies. If not available:

```bash
npm install zod
```

## Why Zod?

| Feature | Zod | Yup |
|---------|-----|-----|
| Bundle Size | **8KB** | 15KB |
| TypeScript | Native | Via types |
| Learning Curve | **Easier** | Medium |
| Type Inference | ✅ Automatic | ❌ Manual |
| Zero Dependencies | ✅ | ❌ |

## Quick Start

### 1. Create Validation Schema

```typescript
// app/validators/PostValidator.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters'),
  published: z.boolean().optional(),
});

export const updatePostSchema = createPostSchema.partial();
```

### 2. Use in Controller

```typescript
// app/controllers/PostController.ts
import Validator from "../services/Validator";
import { createPostSchema } from "../validators/PostValidator";
import { Response, Request } from "../../type";
import DB from "../services/DB";

class PostController {
  public async store(request: Request, response: Response) {
    const body = await request.json();

    // Validate input
    const validatedData = Validator.validateOrFail(
      createPostSchema, 
      body, 
      response
    );
    
    // If validation fails, error response already sent
    if (!validatedData) return;

    // validatedData is now type-safe!
    const post = await DB.table("posts").insert({
      title: validatedData.title,
      content: validatedData.content,
      published: validatedData.published ?? false,
      user_id: request.user.id,
    });

    return response.json({ success: true, data: post });
  }
}

export default new PostController();
```

## Validator Service API

### `validate(schema, data)`

Validate data and return result object.

```typescript
const result = Validator.validate(loginSchema, body);

if (result.success) {
  console.log(result.data); // Typed data
} else {
  console.log(result.errors); // Error messages
}
```

### `validateOrThrow(schema, data)`

Validate and throw ZodError if validation fails.

```typescript
const data = Validator.validateOrThrow(schema, body);
```

## Validation in Controllers

### For Inertia Forms (Web UI)

Use `validate()` with flash messages for form submissions:

```typescript
// app/controllers/ProfileController.ts
import Validator from "../services/Validator";
import { updateProfileSchema } from "../validators/ProfileValidator";

class ProfileController {
  public async update(request: Request, response: Response) {
    const body = await request.json();

    // Validate input
    const validationResult = Validator.validate(updateProfileSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
      return response
        .flash("error", firstError)
        .redirect("/profile", 303);
    }

    const { name, email } = validationResult.data!;

    // Update profile
    await DB.from("users").where("id", request.user.id).update({ name, email });

    return response
      .flash("success", "Profile updated successfully")
      .redirect("/profile", 303);
  }
}
```

**Why use `validate()` for Inertia forms?**
- Returns result object instead of sending JSON response
- Allows you to extract first error message for flash message
- Prevents JSON modal errors in browser
- Enables redirect with error feedback

### For API Endpoints

Use `validate()` and handle JSON response in controller:

```typescript
// app/controllers/ApiController.ts
import Validator from "../services/Validator";
import { createPostSchema } from "../validators/PostValidator";

class ApiController {
  public async createPost(request: Request, response: Response) {
    const body = await request.json();

    // Validate input
    const validationResult = Validator.validate(createPostSchema, body);

    if (!validationResult.success) {
      return response.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.errors,
      });
    }

    const { title, content } = validationResult.data!;

    // Create post
    const post = await DB.table("posts").insert({
      title,
      content,
      user_id: request.user.id,
    });

    return response.json({ success: true, data: post });
  }
}
```

**Why handle response in controller?**
- Controller owns HTTP response logic
- Flexibility to customize error format per endpoint
- Easier testing without mocking Response object
- Clear separation of concerns

### Choosing the Right Method

| Use Case | Method | Response Type | Example |
|----------|--------|---------------|---------|
| Inertia forms | `validate()` | Flash + Redirect | User registration, profile update |
| API endpoints | `validate()` | JSON | Mobile app, external integrations |
| Internal validation | `validateOrThrow()` | Exception | Background jobs, services |

## Common Schemas

Validator service provides ready-to-use common schemas:

```typescript
import Validator from "../services/Validator";

// Email
Validator.schemas.email

// Password (min 8 chars, 1 number)
Validator.schemas.password

// Phone (Indonesian format)
Validator.schemas.phone

// Required string
Validator.schemas.requiredString('Name')

// Optional string
Validator.schemas.optionalString

// Positive number
Validator.schemas.positiveNumber

// URL
Validator.schemas.url

// Date (ISO format)
Validator.schemas.date

// Boolean
Validator.schemas.boolean

// UUID
Validator.schemas.uuid
```

## Custom Validation

### Refine (Custom Logic)

```typescript
const passwordSchema = z.object({
  password: z.string(),
  confirm_password: z.string(),
}).refine(
  (data) => data.password === data.confirm_password,
  {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  }
);
```

### Transform Data

```typescript
const userSchema = z.object({
  email: z.string().email().toLowerCase(), // Auto lowercase
  age: z.string().transform((val) => parseInt(val)), // String to number
  tags: z.string().transform((val) => val.split(',')), // CSV to array
});
```

### Async Validation

```typescript
const emailSchema = z.string().email().refine(
  async (email) => {
    const exists = await DB.from('users').where('email', email).first();
    return !exists;
  },
  { message: 'Email already registered' }
);
```

## Validation Examples

### Login Validation

```typescript
// app/validators/AuthValidator.ts
export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Email or phone number is required',
    path: ['email'],
  }
);
```

### Register Validation

```typescript
// app/validators/AuthValidator.ts
import { field } from './CommonValidator';

export const registerSchema = z.object({
  name: field.name,
  email: field.email,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

### File Upload Validation

```typescript
// app/validators/CommonValidator.ts
export function fileUploadSchema(options?: {
  maxSize?: number;
  allowedTypes?: string[];
}) {
  const maxSize = options?.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options?.allowedTypes || [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  return z.object({
    file_name: z.string().min(1, 'Filename is required'),
    file_size: z
      .number()
      .max(maxSize, `Maximum file size is ${maxSize / 1024 / 1024}MB`),
    file_type: z.enum(allowedTypes as [string, ...string[]]),
  });
}

// Usage
const uploadSchema = fileUploadSchema({
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
});
```

### Nested Objects

```typescript
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postal_code: z.string().regex(/^\d{5}$/),
});

const userSchema = z.object({
  name: z.string(),
  address: addressSchema, // Nested
  contacts: z.array(z.string().email()), // Array
});
```

## Error Response Format

When validation fails, the response format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email"],
    "password": ["Password must be at least 8 characters", "Password must contain a number"]
  }
}
```

## Best Practices

### 1. Separate Validators per Feature

```
app/validators/
├── CommonValidator.ts   # Reusable field schemas
├── AuthValidator.ts     # Login, Register, Password
├── ProfileValidator.ts  # Profile update
└── S3Validator.ts       # File upload
```

### 2. Reuse Schemas

```typescript
// Base schema
const baseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// Extend for create
export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8),
});

// Partial for update
export const updateUserSchema = baseUserSchema.partial();
```

### 3. Custom Error Messages

```typescript
const schema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email('Invalid email format'),
});
```

### 4. Environment-based Validation

```typescript
const isDev = process.env.NODE_ENV === 'development';

const schema = z.object({
  password: isDev 
    ? z.string().min(1) // Lenient in dev
    : z.string().min(8).regex(/[0-9]/), // Strict in prod
});
```

## Integration with Frontend

### Svelte Form Example

```svelte
<script>
  import { router } from '@inertiajs/svelte';
  
  let form = $state({
    email: '',
    password: '',
  });
  
  let errors = $state({});

  function submit() {
    router.post('/login', form, {
      onError: (err) => {
        errors = err; // Zod validation errors
      },
    });
  }
</script>

<form onsubmit={submit}>
  <input bind:value={form.email} />
  {#if errors.email}
    <p class="error">{errors.email[0]}</p>
  {/if}
  
  <input type="password" bind:value={form.password} />
  {#if errors.password}
    <p class="error">{errors.password[0]}</p>
  {/if}
  
  <button type="submit">Login</button>
</form>
```

## TypeScript Type Inference

Zod automatically generates TypeScript types:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

// Extract type from schema
type User = z.infer<typeof userSchema>;
// { name: string; age: number; email: string; }

// Use in function
function createUser(data: User) {
  // data is fully typed!
}
```

## Existing Validators

Laju already provides validators for existing controllers:

| File | Schemas | Used By |
|------|---------|--------|
| `AuthValidator.ts` | `loginSchema`, `registerSchema`, `forgotPasswordSchema`, `resetPasswordSchema`, `changePasswordSchema` | LoginController, RegisterController, PasswordController |
| `ProfileValidator.ts` | `updateProfileSchema`, `deleteUsersSchema` | ProfileController |
| `S3Validator.ts` | `signedUrlSchema` | S3Controller |
| `CommonValidator.ts` | `field.*` (reusable fields) | All validators |

## Resources

- **Zod Documentation**: [zod.dev](https://zod.dev)
- **Validator Service**: `app/services/Validator.ts`
- **Common Fields**: `app/validators/CommonValidator.ts`
- **Auth Validators**: `app/validators/AuthValidator.ts`

---

**Previous**: [Caching](17-CACHING.md)
