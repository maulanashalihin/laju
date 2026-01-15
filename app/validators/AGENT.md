# Validator Guide for AI

## Core Principles

1. **One schema per action** - Create separate schemas for store/update
2. **Reuse common fields** - Import from `CommonValidator.ts`
3. **Export schemas** - Export all schemas for controller imports
4. **Use Zod** - All schemas use Zod for type-safe validation

## Basic Pattern

```typescript
import { z } from 'zod';
import { field } from './CommonValidator';

// Store schema - all fields required
export const storeSchema = z.object({
  title: field.requiredString('Title', 3),
  content: field.requiredString('Content', 10),
});

// Update schema - all fields optional
export const updateSchema = z.object({
  title: field.requiredString('Title', 3).optional(),
  content: field.requiredString('Content', 10).optional(),
});
```

## Common Fields

```typescript
import { field } from './CommonValidator';

email: field.email              // Email (auto lowercase)
password: field.password        // Password (min 8 chars, 1 number)
phone: field.phone              // Phone (Indonesian format)
name: field.name                // Name (2-100 chars)
uuid: field.uuid                // UUID
url: field.url                  // URL
slug: field.slug                // Slug
requiredString: field.requiredString('Field Name', minLength)  // Required string
optionalString: field.optionalString  // Optional string
```

## Store vs Update Schemas

**Store schema** - All fields required:
```typescript
export const storeSchema = z.object({
  title: field.requiredString('Title', 3),
  content: field.requiredString('Content', 10),
  status: z.enum(['draft', 'published']).default('draft'),
});
```

**Update schema** - All fields optional:
```typescript
export const updateSchema = z.object({
  title: field.requiredString('Title', 3).optional(),
  content: field.requiredString('Content', 10).optional(),
  status: z.enum(['draft', 'published']).optional(),
});
```

## Custom Validation

```typescript
export const loginSchema = z.object({
  email_or_phone: field.requiredString('Email or Phone', 3),
  password: field.password,
}).refine(
  (data) => field.email.safeParse(data.email_or_phone).success || 
           field.phone.safeParse(data.email_or_phone).success,
  { message: "Invalid email or phone" }
);
```

## Conditional Fields

```typescript
export const registerSchema = z.object({
  email: field.email,
  phone: field.phone.optional(),
}).refine(
  (data) => data.email || data.phone,
  { message: "Email or phone is required" }
);
```

## Usage in Controller

```typescript
import Validator from "../services/Validator"
import { storeSchema, updateSchema } from "../validators/PostValidator"

const validationResult = Validator.validate(storeSchema, body);
if (!validationResult.success) {
  const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
  return response.flash("error", firstError).redirect("/path", 302);
}
const { title, content } = validationResult.data!;
```

## Common Zod Methods

```typescript
z.string()                    // String type
z.number()                    // Number type
z.boolean()                   // Boolean type
z.enum(['a', 'b'])           // Enum values
z.array(z.string())          // Array of strings
.optional()                   // Optional field
.nullable()                   // Nullable field
.min(3)                      // Minimum length
.max(100)                    // Maximum length
.email()                     // Email validation
.url()                       // URL validation
.refine()                    // Custom validation
```

## Validation Flow

1. Import schema from validator file
2. Use `Validator.validate(schema, data)`
3. Check `validationResult.success`
4. Extract errors or data
5. Return appropriate response

## Complete Example

```typescript
/**
 * Post Validation Schemas
 * Schemas for PostController
 */

import { z } from 'zod';
import { field } from './CommonValidator';

/**
 * Store schema
 * Used by: PostController.store
 */
export const storeSchema = z.object({
  title: field.requiredString('Title', 3),
  content: field.requiredString('Content', 10),
  status: z.enum(['draft', 'published']).default('draft'),
});

/**
 * Update schema
 * Used by: PostController.update
 */
export const updateSchema = z.object({
  title: field.requiredString('Title', 3).optional(),
  content: field.requiredString('Content', 10).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

/**
 * Bulk delete schema
 * Used by: PostController.bulkDelete
 */
export const bulkDeleteSchema = z.object({
  ids: z.array(field.uuid).min(1, 'Select at least 1 post'),
});
```

## Common Zod Methods

```typescript
// Required
z.string().min(1, 'Required')

// Optional
z.string().optional()

// Nullable
z.string().nullish()

// Default value
z.string().default('default')

// Enum
z.enum(['option1', 'option2'])

// Number validation
z.number().int().positive('Must be positive')

// Transform
z.string().transform((val) => val.toLowerCase())

// Custom validation
z.string().refine((val) => condition, { message: 'Error message' })
```

## Validation Flow

```
1. Controller receives request
2. Get body: await request.json()
3. Validate: Validator.validate(schema, body)
4. Check success: if (!validationResult.success)
5. Get errors: validationResult.errors
6. Get data: validationResult.data
7. Use validated data in business logic
```

## Quick Reference

| Schema Type | Pattern | Example |
|-------------|---------|---------|
| Store | All required | `z.object({ title: field.requiredString('Title', 3) })` |
| Update | All optional | `z.object({ title: field.requiredString('Title', 3).optional() })` |
| Enum | Fixed options | `z.enum(['draft', 'published'])` |
| Array | List of items | `z.array(field.uuid).min(1, 'Required')` |
| Custom | Refine | `.refine((val) => condition, { message: 'Error' })` |

## Best Practices

1. **Use common fields** - Import from `CommonValidator.ts` when possible
2. **Document usage** - Comment which controller method uses each schema
3. **Separate store/update** - Store requires all fields, update makes them optional
4. **Type safety** - Let Zod infer types from schemas
5. **Clear errors** - Provide descriptive error messages
6. **Validate early** - Always validate before database operations