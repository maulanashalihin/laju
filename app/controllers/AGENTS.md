# Controller Guide for AI

## Core Principles

1. **Follow REST API standards** - Implement standard RESTful methods
2. **Validate first** - Use `Validator.ts` before any DB operations
3. **Separate concerns** - Complete business logic, then create response
4. **Use proper HTTP status codes** - 302 for store, 303 for update/delete
5. **Never use `this`** - Controllers are exported as instances

## SSR vs Inertia Decision

**Use SSR (`view()`) when:**
- Public pages needing SEO
- Routes WITHOUT `auth` middleware

**Use Inertia (`response.inertia()`) when:**
- Protected routes requiring authentication
- Routes WITH `auth` middleware

| Route Type | Auth | SEO | Use |
|------------|------|-----|-----|
| Public | No | Yes | SSR |
| Public | No | No | Inertia (prefer) |
| Protected | Yes | No | Inertia |

## Method Patterns

### index() - List
```typescript
// SSR
const posts = await DB.from("posts").orderBy("created_at", "desc");
return response.type("html").send(view("posts/index", { posts }));

// Inertia
const posts = await DB.from("posts").orderBy("created_at", "desc");
return response.inertia("posts/index", { posts });
```

### create() - Show Form
```typescript
// SSR
return response.type("html").send(view("posts/create"));

// Inertia
return response.inertia("posts/create");
```

### store() - Create (302)
```typescript
const body = await request.json();
const validationResult = Validator.validate(storeSchema, body);
if (!validationResult.success) {
  const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
  return response.flash("error", firstError).redirect("/posts/create", 302);
}
const { title, content } = validationResult.data!;
await DB.table("posts").insert({ title, content, user_id: request.user.id, created_at: Date.now(), updated_at: Date.now() });
return response.flash("success", "Berhasil dibuat").redirect("/posts", 302);
```

### show() - Single Resource
```typescript
// SSR
const post = await DB.from("posts").where("id", id).first();
if (!post) return response.status(404).type("html").send(view("errors/404"));
return response.type("html").send(view("posts/show", { post }));

// Inertia
const post = await DB.from("posts").where("id", id).first();
if (!post) return response.inertia("errors/404");
return response.inertia("posts/show", { post });
```

### edit() - Show Edit Form
```typescript
// SSR
const post = await DB.from("posts").where("id", id).first();
if (!post) return response.status(404).type("html").send(view("errors/404"));
return response.type("html").send(view("posts/edit", { post }));

// Inertia
const post = await DB.from("posts").where("id", id).first();
if (!post) return response.inertia("errors/404");
return response.inertia("posts/edit", { post });
```

### update() - Update (303)
```typescript
const { id } = request.params;
const body = await request.json();
const validationResult = Validator.validate(updateSchema, body);
if (!validationResult.success) {
  const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
  return response.flash("error", firstError).redirect(`/posts/${id}/edit`, 303);
}
const post = await DB.from("posts").where("id", id).first();
if (!post) return response.flash("error", "Tidak ditemukan").redirect("/posts", 303);
const { title, content } = validationResult.data!;
await DB.from("posts").where("id", id).update({ title, content, updated_at: Date.now() });
return response.flash("success", "Berhasil diperbarui").redirect("/posts", 303);
```

### destroy() - Delete (303)
```typescript
const { id } = request.params;
const post = await DB.from("posts").where("id", id).first();
if (!post) return response.flash("error", "Tidak ditemukan").redirect("/posts", 303);
await DB.from("posts").where("id", id).delete();
return response.flash("success", "Berhasil dihapus").redirect("/posts", 303);
```

## Complete Example

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";
import Validator from "../services/Validator";
import { storeSchema, updateSchema } from "../validators/PostValidator";

class PostController {
  public async index(request: Request, response: Response) {
    const posts = await DB.from("posts").orderBy("created_at", "desc");
    return response.inertia("posts/index", { posts });
  }

  public async create(request: Request, response: Response) {
    return response.inertia("posts/create");
  }

  public async store(request: Request, response: Response) {
    try {
      const body = await request.json();
      const validationResult = Validator.validate(storeSchema, body);
      if (!validationResult.success) {
        const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
        return response.flash("error", firstError).redirect("/posts/create", 302);
      }
      const { title, content } = validationResult.data!;
      await DB.table("posts").insert({ title, content, user_id: request.user.id, created_at: Date.now(), updated_at: Date.now() });
      return response.flash("success", "Berhasil dibuat").redirect("/posts", 302);
    } catch (error: any) {
      console.error("Store error:", error);
      return response.flash("error", "Terjadi kesalahan").redirect("/posts/create", 302);
    }
  }

  public async show(request: Request, response: Response) {
    const { id } = request.params;
    const post = await DB.from("posts").where("id", id).first();
    if (!post) return response.inertia("errors/404");
    return response.inertia("posts/show", { post });
  }

  public async edit(request: Request, response: Response) {
    const { id } = request.params;
    const post = await DB.from("posts").where("id", id).first();
    if (!post) return response.inertia("errors/404");
    return response.inertia("posts/edit", { post });
  }

  public async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const body = await request.json();
      const validationResult = Validator.validate(updateSchema, body);
      if (!validationResult.success) {
        const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
        return response.flash("error", firstError).redirect(`/posts/${id}/edit`, 303);
      }
      const post = await DB.from("posts").where("id", id).first();
      if (!post) return response.flash("error", "Tidak ditemukan").redirect("/posts", 303);
      const { title, content } = validationResult.data!;
      await DB.from("posts").where("id", id).update({ title, content, updated_at: Date.now() });
      return response.flash("success", "Berhasil diperbarui").redirect("/posts", 303);
    } catch (error: any) {
      console.error("Update error:", error);
      return response.flash("error", "Terjadi kesalahan").redirect(`/posts/${id}/edit`, 303);
    }
  }

  public async destroy(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const post = await DB.from("posts").where("id", id).first();
      if (!post) return response.flash("error", "Tidak ditemukan").redirect("/posts", 303);
      await DB.from("posts").where("id", id).delete();
      return response.flash("success", "Berhasil dihapus").redirect("/posts", 303);
    } catch (error: any) {
      console.error("Delete error:", error);
      return response.flash("error", "Terjadi kesalahan").redirect("/posts", 303);
    }
  }
}

export default new PostController();
```

## Quick Reference

| Method | SSR | Inertia | Redirect |
|--------|-----|---------|----------|
| index | `view()` | `response.inertia()` | - |
| create | `view()` | `response.inertia()` | - |
| store | - | - | 302 |
| show | `view()` | `response.inertia()` | - |
| edit | `view()` | `response.inertia()` | - |
| update | - | - | 303 |
| destroy | - | - | 303 |

## Validation Pattern

```typescript
const validationResult = Validator.validate(schema, body);
if (!validationResult.success) {
  const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
  return response.flash("error", firstError).redirect("/path", statusCode);
}
const { field1, field2 } = validationResult.data!;
```

## Error Handling

```typescript
try {
  // Business logic
} catch (error: any) {
  console.error("Method error:", error);
  if (error.code === 'SQLITE_CONSTRAINT') {
    return response.flash("error", "Data sudah ada").redirect("/path", statusCode);
  }
  return response.flash("error", "Terjadi kesalahan").redirect("/path", statusCode);
}
```

## Flash Message Types

- `error` - Validation errors and failures
- `success` - Successful operations
- `info` - Informational messages
- `warning` - Warnings