# Validation Guide

Laju menggunakan **Zod** untuk validasi input yang type-safe dan mudah digunakan.

## Instalasi

Zod sudah termasuk dalam dependencies Laju. Jika belum ada:

```bash
npm install zod
```

## Kenapa Zod?

| Fitur | Zod | Yup |
|-------|-----|-----|
| Bundle Size | **8KB** | 15KB |
| TypeScript | Native | Via types |
| Learning Curve | **Lebih mudah** | Sedang |
| Type Inference | ✅ Otomatis | ❌ Manual |
| Zero Dependencies | ✅ | ❌ |

## Quick Start

### 1. Buat Validation Schema

```typescript
// app/validators/PostValidator.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  content: z
    .string()
    .min(10, 'Konten minimal 10 karakter'),
  published: z.boolean().optional(),
});

export const updatePostSchema = createPostSchema.partial();
```

### 2. Gunakan di Controller

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

Validasi data dan return result object.

```typescript
const result = Validator.validate(loginSchema, body);

if (result.success) {
  console.log(result.data); // Typed data
} else {
  console.log(result.errors); // Error messages
}
```

### `validateOrFail(schema, data, response)`

Validasi dan otomatis kirim error response jika gagal.

```typescript
const validatedData = Validator.validateOrFail(schema, body, response);
if (!validatedData) return; // Validation failed, response already sent

// Continue with validated data
```

## Common Schemas

Validator service menyediakan schema umum yang siap pakai:

```typescript
import Validator from "../services/Validator";

// Email
Validator.schemas.email

// Password (min 8 chars, 1 number)
Validator.schemas.password

// Phone (Indonesian format)
Validator.schemas.phone

// Required string
Validator.schemas.requiredString('Nama')

// URL
Validator.schemas.url

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
    message: 'Password tidak cocok',
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
  { message: 'Email sudah terdaftar' }
);
```

## Validation Examples

### Login Validation

```typescript
// app/validators/LoginValidator.ts
export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Email atau nomor telepon wajib diisi',
    path: ['email'],
  }
);
```

### Register Validation

```typescript
export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  password_confirmation: z.string(),
}).refine(
  (data) => data.password === data.password_confirmation,
  {
    message: 'Konfirmasi password tidak cocok',
    path: ['password_confirmation'],
  }
);
```

### File Upload Validation

```typescript
export const uploadSchema = z.object({
  file_name: z.string(),
  file_size: z.number().max(5 * 1024 * 1024, 'File maksimal 5MB'),
  file_type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    errorMap: () => ({ message: 'Hanya JPG, PNG, WEBP yang diperbolehkan' }),
  }),
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

Ketika validasi gagal, response format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email tidak valid"],
    "password": ["Password minimal 8 karakter", "Password harus mengandung angka"]
  }
}
```

## Best Practices

### 1. Pisahkan Validator per Feature

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
    required_error: 'Email wajib diisi',
    invalid_type_error: 'Email harus berupa string',
  }).email('Format email tidak valid'),
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

Zod otomatis generate TypeScript types:

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

Laju sudah menyediakan validators untuk controllers yang ada:

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
