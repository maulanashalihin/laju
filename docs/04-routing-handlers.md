# Routing & Handlers

Learn how to define routes and create handlers in Laju Framework.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Routing](#basic-routing)
3. [Route Parameters](#route-parameters)
4. [Handlers](#handlers)
5. [Request & Response](#request--response)
6. [Common Patterns](#common-patterns)
7. [Best Practices](#best-practices)

---

## Introduction

Routes define how your application responds to HTTP requests. Handlers handle the business logic for each route.

### Request Flow

```
HTTP Request → Route → Middleware → Handler → Response
```

---

## Basic Routing

### Route Definition

Routes are defined in `routes/web.ts`:

```typescript
import Route from "./Route";
import AppHandler from "../app/handlers/app.handler";
import AuthHandler from "../app/handlers/auth.handler";

// GET request
Route.get("/", AppHandler.homePage);

// POST request
Route.post("/login", AuthHandler.processLogin);

// PUT request
Route.put("/users/:id", AppHandler.changeProfile);

// DELETE request
Route.delete("/users/:id", AppHandler.deleteUsers);
```

### HTTP Methods

```typescript
Route.get("/path", Handler.method);     // GET
Route.post("/path", Handler.method);    // POST
Route.put("/path", Handler.method);     // PUT
Route.patch("/path", Handler.method);   // PATCH
Route.delete("/path", Handler.method);  // DELETE
```

---

## Route Parameters

### URL Parameters

```typescript
// routes/web.ts
Route.get("/users/:id", AppHandler.profilePage);
Route.get("/posts/:postId/comments/:commentId", CommentHandler.show);

// Handler
async show(request: Request, response: Response) {
  const { id } = request.params;
  const user = await DB.selectFrom("users")
  .selectAll()
  .where("id", "=", id)
  .executeTakeFirst();
  return response.json({ user });
}
```

### Query Parameters

```typescript
// URL: /search?q=hello&page=2

async search(request: Request, response: Response) {
  const { q, page } = request.query;

  const results = await DB.selectFrom("posts")
    .selectAll()
    .where("title", "like", `%${q}%`)
    .limit(10)
    .offset((page - 1) * 10)
    .execute();

  return response.json({ results });
}
```

---

## Handlers

### Handler Structure

Handlers are organized by domain in single files:

```
app/handlers/
├── auth.handler.ts         # Authentication (login, register, OAuth, password)
├── app.handler.ts          # Application pages (dashboard, profile)
├── public.handler.ts       # Public pages (home, about)
├── upload.handler.ts       # File upload operations
├── s3.handler.ts           # S3 storage operations
├── storage.handler.ts      # Local storage file serving
└── asset.handler.ts        # Static asset serving
```

### Creating a Handler

**Manual creation** (`app/handlers/posts.handler.ts`):

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";
import Validator from "../services/Validator";
import { createPostSchema, updatePostSchema } from "../validators/post.validator";

export const PostHandler = {
  // List all posts
  async index(request: Request, response: Response) {
    const posts = await DB.selectFrom("posts")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
    return response.inertia("posts/index", { posts });
  },

  // Show create form
  async create(request: Request, response: Response) {
    return response.inertia("posts/create");
  },

  // Store new post
  async store(request: Request, response: Response) {
    const body = await request.json();
    const validationResult = Validator.validate(createPostSchema, body);

    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || "Validation error";
      return response.flash("error", firstError).redirect("/posts/create", 302);
    }

    const { title, content } = validationResult.data!;

    await DB.insertInto("posts").values({
      id: crypto.randomUUID(),
      title,
      content,
      user_id: request.user.id,
      created_at: Date.now(),
      updated_at: Date.now()
    }).execute();

    return response.flash("success", "Post created").redirect("/posts", 302);
  },

  // Show single post
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const post = await DB.selectFrom("posts")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!post) {
      return response.status(404).inertia("errors/404");
    }

    return response.inertia("posts/show", { post });
  },

  // Show edit form
  async edit(request: Request, response: Response) {
    const { id } = request.params;
    const post = await DB.selectFrom("posts")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!post) {
      return response.status(404).inertia("errors/404");
    }

    return response.inertia("posts/edit", { post });
  },

  // Update post
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = await request.json();
    const validationResult = Validator.validate(updatePostSchema, body);

    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || "Validation error";
      return response.flash("error", firstError).redirect(`/posts/${id}/edit`, 303);
    }

    const { title, content } = validationResult.data!;

    await DB.updateTable("posts")
      .set({
        title,
        content,
        updated_at: Date.now()
      })
      .where("id", "=", id)
      .execute();

    return response.flash("success", "Post updated").redirect("/posts", 303);
  },

  // Delete post
  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await DB.deleteFrom("posts").where("id", "=", id).execute();
    return response.flash("success", "Post deleted").redirect("/posts", 303);
  }
};

export default PostHandler;
```

### RESTful Routes

```typescript
// routes/web.ts
import PostHandler from "../app/handlers/posts.handler";
import Auth from "../app/middlewares/auth.middleware";

Route.get("/posts", PostHandler.index);                    // List
Route.get("/posts/create", [Auth], PostHandler.create);    // Create form
Route.post("/posts", [Auth], PostHandler.store);           // Store
Route.get("/posts/:id", PostHandler.show);                 // Show
Route.get("/posts/:id/edit", [Auth], PostHandler.edit);    // Edit form
Route.put("/posts/:id", [Auth], PostHandler.update);       // Update
Route.delete("/posts/:id", [Auth], PostHandler.destroy);   // Delete
```

### ⚠️ Handler Pattern: Plain Objects

**IMPORTANT:** Laju handlers are **plain objects**, not classes. This makes them simpler and more predictable.

#### ✅ Handler Pattern

```typescript
// ✅ CORRECT - Plain object pattern
export const UserHandler = {
  async store(request: Request, response: Response) {
    const body = await request.json();

    // Validate using utility function
    const validated = validateUser(body);

    await DB.insertInto("users").values(validated).execute();
    return response.json({ success: true });
  },

  async index(request: Request, response: Response) {
    const users = await DB.selectFrom("users").selectAll().execute();
    return response.json({ users });
  }
};

export default UserHandler;
```

#### ✅ Use Separate Utility Functions

```typescript
// ✅ ALSO CORRECT - Extract to utility function
import { validateUser } from "../utils/validation";

export const UserHandler = {
  async store(request: Request, response: Response) {
    const body = await request.json();

    // Call utility function
    const validated = validateUser(body);

    await DB.insertInto("users").values(validated).execute();
    return response.json({ success: true });
  }
};

export default UserHandler;

// In utils/validation.ts
export function validateUser(data: any) {
  // Validation logic
  return data;
}
```

#### How It Works

```typescript
// routes/web.ts
import UserHandler from "../app/handlers/user.handler";

// UserHandler is a plain object with methods
Route.post("/users", UserHandler.store);
```

#### Best Practices for Handler Organization

1. **Keep handlers thin** - Move business logic to services
2. **Extract utilities** - Put reusable functions in separate files
3. **Use services** - Business logic goes in `app/services/`

```typescript
// Good handler structure
export const UserHandler = {
  // Main handler - thin, delegates to services
  async store(request: Request, response: Response) {
    const body = await request.json();

    // Validate (utility function)
    const validated = validateInput(body);
    if (!validated) {
      return response.status(400).json({ error: "Invalid input" });
    }

    // Business logic in service
    const user = await UserService.create(validated);

    return response.json({ user });
  }
};

export default UserHandler;

// Utility function (in same file or utils/)
function validateInput(data: any) {
  return data.email && data.password && data.name;
}
```

#### Common Pattern: Service Layer

```typescript
// app/services/UserService.ts
export const UserService = {
  async create(data: any) {
    // Business logic
    const hashedPassword = await Authenticate.hash(data.password);
    const user = { ...data, password: hashedPassword };

    return await DB.insertInto("users").values(user).execute();
  },

  async findByEmail(email: string) {
    return await DB.selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
  }
};

export default UserService;

// In handler
import UserService from "../services/UserService";

export const UserHandler = {
  async store(request: Request, response: Response) {
    const body = await request.json();
    const user = await UserService.create(body);
    return response.json({ user });
  }
};

export default UserHandler;
```

---

## Request & Response

### Request Methods

```typescript
public async store(request: Request, response: Response) {
  // Get JSON body
  const data = await request.json();

  // Get text body
  const text = await request.text();

  // Get headers
  const contentType = request.header("content-type");
  const auth = request.headers.authorization;

  // Get cookies
  const authId = request.cookies.auth_id;

  // Get URL info
  const url = request.originalUrl;
  const method = request.method;
  const ip = request.ip;

  // Get user (from auth middleware)
  const userId = request.user?.id;
}
```

### Response Methods

```typescript
// JSON response
return response.json({ success: true, data: user });

// Inertia response (SPA)
return response.inertia("posts/index", { posts });

// Redirect
return response.redirect("/dashboard");

// HTML response
return response.type("html").send("<h1>Hello</h1>");

// Status code
return response.status(404).json({ error: "Not found" });

// Set cookie
return response.cookie("name", "value", 3600).json({ success: true });

// Set header
return response.setHeader("X-Custom", "value").json({ data });
```

### HTTP Redirect Status Codes

```typescript
// Default 302 (Found) - for GET requests
return response.redirect("/dashboard");

// 303 (See Other) - for POST/PUT/PATCH form submissions
return response.redirect("/profile", 303);

// 301 (Moved Permanently) - for permanent redirects
return response.redirect("/new-path", 301);

// 307 (Temporary Redirect) - for method preservation
return response.redirect("/submit", 307);
```

**⚠️ IMPORTANT**: Always use 303 for form submissions (POST, PUT, PATCH):

```typescript
// ✅ CORRECT - Use 303 for form updates
public async update(request: Request, response: Response) {
  const body = await request.json();

  const validationResult = Validator.validate(updateSchema, body);
  if (!validationResult.success) {
    const errors = validationResult.errors || {};
    const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
    return response.flash("error", firstError).redirect("/profile", 303);
  }

  await DB.updateTable("users")
    .set(body)
    .where("id", "=", request.user.id)
    .execute();

  return response
    .flash("success", "Profile updated successfully")
    .redirect("/profile", 303);
}

// ❌ WRONG - Don't use default 302 for form submissions
public async update(request: Request, response: Response) {
  await DB.updateTable("users")
    .set(data)
    .where("id", "=", id)
    .execute();
  return response.flash("success", "Updated!").redirect("/profile"); // Uses 302
}
```

**Why 303 for form submissions?**

- **303 (See Other)**: Prevents browsers from changing the HTTP method (PUT → GET)
- **302 (Found)**: May cause browsers to change the method to GET, losing form data
- **Method Preservation**: 303 ensures the form data is not lost during redirect
- **HTTP Standard**: RFC 7231 recommends 303 for POST/PUT/PATCH redirects

**When to use each status code:**

| Status Code | Name | Use Case |
|-------------|------|----------|
| 301 | Moved Permanently | Permanent URL changes (SEO) |
| 302 | Found | Temporary GET redirects |
| 303 | See Other | **Form submissions (POST/PUT/PATCH)** |
| 307 | Temporary Redirect | Method preservation (alternative to 303) |
| 308 | Permanent Redirect | Permanent method preservation |

---

## Flash Messages & Error Handling

### Flash Messages

Flash messages allow you to send temporary messages (errors, success, info, warnings) to the next request via cookies. They are automatically parsed by the inertia middleware and passed to page props.

#### Supported Types

- `error` - Error messages
- `success` - Success messages
- `info` - Information messages
- `warning` - Warning messages

#### Usage in Handler

```typescript
// Send error message
return response
   .flash("error", "Email already registered")
   .redirect("/register");

// Send success message
return response
   .flash("success", "Registration successful!")
   .redirect("/login");

// Chain with other methods
return response
   .flash("error", "Incorrect password")
   .redirect("/login");
```

#### Flash Messages in Frontend

Flash messages are automatically available as props in your Svelte components:

```svelte
<script>
let { flash } = $props();
</script>

{#if flash?.error}
  <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
    <span class="text-red-400">{flash.error}</span>
  </div>
{/if}
```

---

### Validation with Flash Messages (Recommended for Inertia Forms)

**⚠️ IMPORTANT**: For Inertia forms, use `validate()` instead of `validateOrFail()` to avoid JSON response modal errors.

```typescript
import Validator from "../services/Validator";
import { registerSchema } from "../validators/auth.validator";

async processRegister(request: Request, response: Response) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = Validator.validate(registerSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
      return response
         .flash("error", firstError)
         .redirect("/register");
    }

    const { email, password, name } = validationResult.data!;

    // Business logic
    const existingUser = await DB.selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
    if (existingUser) {
      return response
         .flash("error", "Email already registered")
         .redirect("/register");
    }

    // Success
    return response.redirect("/success");

  } catch (error: any) {
    console.error("Error:", error);

    // Handle specific database errors
    if (error.code === 'SQLITE_CONSTRAINT') {
      return response.flash("error", "Data already exists").redirect("/path");
    }

    // Generic error
    return response.flash("error", "An error occurred. Please try again later.").redirect("/path");
  }
}
```

---

### Complete Error Handling Pattern

Here's a complete example showing all aspects of error handling:

```typescript
async processRequest(request: Request, response: Response) {
  try {
    const body = await request.json();

    // 1. Validation
    const validationResult = Validator.validate(schema, body);
    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
      return response.flash("error", firstError).redirect("/path");
    }

    // 2. Business logic
    const { email } = validationResult.data!;

    // 3. Database operations
    const existing = await DB.selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
    if (existing) {
      return response.flash("error", "Email already registered").redirect("/path");
    }

    // 4. Success
    return response.redirect("/success");

  } catch (error: any) {
    console.error("Error:", error);

    // Handle specific database errors
    if (error.code === 'SQLITE_CONSTRAINT') {
      return response.flash("error", "Data already exists").redirect("/path");
    }

    // Generic error
    return response.flash("error", "An error occurred. Please try again later.").redirect("/path");
  }
}
```

---

## Common Patterns

### Pattern 1: List with Pagination

```typescript
async index(request: Request, response: Response) {
  const page = parseInt(request.query.page || "1");
  const perPage = 10;
  const offset = (page - 1) * perPage;

  const posts = await DB.selectFrom("posts")
    .selectAll()
    .orderBy("created_at", "desc")
    .limit(perPage)
    .offset(offset)
    .execute();

  const total = await DB.selectFrom("posts")
    .select(({ fn }) => [fn.count("*").as("count")])
    .executeTakeFirst();

  return response.inertia("posts/index", {
    posts,
    pagination: {
      page,
      perPage,
      total: total.count,
      totalPages: Math.ceil(total.count / perPage)
    }
  });
}
```

### Pattern 2: Search & Filter

```typescript
async index(request: Request, response: Response) {
  const { search, status, sort } = request.query;

  let query = DB.selectFrom("posts").selectAll();

  // Search
  if (search) {
    query = query.where("title", "like", `%${search}%`) as any;
  }

  // Filter
  if (status) {
    query = query.where("status", "=", status) as any;
  }

  // Sort
  const sortBy = sort || "created_at";
  query = query.orderBy(sortBy, "desc") as any;

  const posts = await query.execute();

  return response.inertia("posts/index", { posts, search, status, sort });
}
```

### Pattern 3: Form Validation

```typescript
async store(request: Request, response: Response) {
  const { title, content } = await request.json();

  // Validate
  const errors: any = {};

  if (!title || title.trim().length === 0) {
    errors.title = "Title is required";
  }

  if (!content || content.trim().length < 10) {
    errors.content = "Content must be at least 10 characters";
  }

  if (Object.keys(errors).length > 0) {
    return response.status(422).json({
      error: "Validation failed",
      details: errors
    });
  }

  // Store
  await DB.insertInto("posts").values({
    title,
    content,
    created_at: Date.now(),
    updated_at: Date.now()
  }).execute();

  return response.redirect("/posts");
}
```

### Pattern 4: API Response

```typescript
async index(request: Request, response: Response) {
  try {
    const posts = await DB.selectFrom("posts").selectAll().execute();

    return response.json({
      success: true,
      data: posts,
      meta: {
        total: posts.length,
        timestamp: Date.now()
      }
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Failed to fetch posts",
      message: error.message
    });
  }
}
```

---

## Best Practices

### ✅ DO

**1. Keep handlers thin**
```typescript
// ✅ Good - Delegate to services
public async store(request: Request, response: Response) {
  const data = await request.json();
  const user = await UserService.create(data);
  return response.json({ user });
}
```

**2. Use absolute imports**
```typescript
// ✅ Good
import DB from "app/services/DB";
import AuthHandler from "app/handlers/auth.handler";

// ❌ Avoid
import DB from "../../app/services/DB";
```

**3. Validate input first**
```typescript
// ✅ Good
const validationResult = Validator.validate(schema, body);
if (!validationResult.success) {
  return response.flash("error", "Validation failed").redirect("/path");
}
```

**4. Use flash messages for user feedback**
```typescript
// ✅ Good
return response
  .flash("success", "Profile updated successfully")
  .redirect("/profile", 303);
```

### ❌ DON'T

**1. Don't put business logic in handlers**
```typescript
// ❌ Bad - Business logic in handler
public async store(request: Request, response: Response) {
  const { email, password } = await request.json();
  const hashed = await crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  // ... more logic
}

// ✅ Good - Use service
public async store(request: Request, response: Response) {
  const { email, password } = await request.json();
  const user = await UserService.create({ email, password });
  return response.json({ user });
}
```

**2. Don't use 302 for form submissions**
```typescript
// ❌ Bad
return response.redirect("/profile"); // 302

// ✅ Good
return response.redirect("/profile", 303);
```

---

## Next Steps

- [Frontend (Svelte 5)](05-frontend-svelte.md) - Build reactive UIs
- [Validation](08-validation.md) - Input validation with Zod
- [Middleware](07-middleware.md) - Custom middleware patterns
