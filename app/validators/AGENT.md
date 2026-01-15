# Validator Guide for AI

## Core Principles

1. **One schema per action** - Create separate schemas for store/update
2. **Reuse common fields** - Import from `CommonValidator.ts`
3. **Clear documentation** - Comment which controller method uses each schema
4. **Export schemas** - Export all schemas for controller imports
5. **Use Zod** - All schemas use Zod for type-safe validation

## File Structure

```
app/validators/
├── CommonValidator.ts    # Reusable field schemas
├── AuthValidator.ts      # Auth-related schemas
├── ProfileValidator.ts   # Profile-related schemas
├── PostValidator.ts      # Post-related schemas (your custom validators)
└── ...
```

## Basic Pattern

```typescript
import { z } from 'zod';
import { field } from './CommonValidator';

/**
 * Store schema
 * Used by: PostController.store
 */
export const storeSchema = z.object({
  title: field.requiredString('Title', 3),
  content: field.requiredString('Content', 10),
});

/**
 * Update schema
 * Used by: PostController.update
 */
export const updateSchema = z.object({
  title: field.requiredString('Title', 3).optional(),
  content: field.requiredString('Content', 10).optional(),
});
```

## Common Fields

Import reusable fields from `CommonValidator.ts`:

```typescript
import { field } from './CommonValidator';

// Email (auto lowercase)
email: field.email

// Password (min 8 chars, 1 number)
password: field.password

// Phone (Indonesian format)
phone: field.phone

// Name (2-100 chars)
name: field.name

// UUID
uuid: field.uuid

// URL
url: field.url

// Slug
slug: field.slug

// Required string (customizable)
requiredString: field.requiredString('Field Name', minLength)

// Optional string
optionalString: field.optionalString
```

## Store vs Update Schemas

**Store schema** - All fields required:
```typescript
export const storeSchema = z.object({
  title: field.requiredString('Title', 3),
  content: field.requiredString('Content', 10),
  status: z.enum(['draft', 'published']),
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

Add custom validation with `refine`:

```typescript
// Email OR phone required
export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
}).refine(
  (data) => data.email || data.phone,
  { message: 'Email or phone is required', path: ['email'] }
);

// Password confirmation
export const registerSchema = z.object({
  password: field.password,
  password_confirmation: z.string(),
}).refine(
  (data) => data.password === data.password_confirmation,
  { message: 'Password confirmation does not match', path: ['password_confirmation'] }
);
```

## Conditional Fields

Make fields optional based on conditions:

```typescript
export const updateProfileSchema = z.object({
  phone: z.string().nullish().refine(
    (val) => !val || /^(\+62|62|0)[0-9]{9,12}$/.test(val),
    'Invalid phone number format'
  ),
  avatar: z.string().nullish(),
});
```

## Using in Controller

Import schema and use with `Validator.validate()`:

```typescript
import Validator from "../services/Validator";
import { storeSchema, updateSchema } from "../validators/PostValidator";

// In store method
const body = await request.json();
const validationResult = Validator.validate(storeSchema, body);
if (!validationResult.success) {
  const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
  return response.flash("error", firstError).redirect("/posts/create", 302);
}
const { title, content } = validationResult.data!;
```

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