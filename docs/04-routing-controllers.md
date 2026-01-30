# Routing & Controllers

Learn how to define routes and create controllers in Laju Framework.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Routing](#basic-routing)
3. [Route Parameters](#route-parameters)
4. [Controllers](#controllers)
5. [Request & Response](#request--response)
6. [Common Patterns](#common-patterns)
7. [Best Practices](#best-practices)

---

## Introduction

Routes define how your application responds to HTTP requests. Controllers handle the business logic for each route.

### Request Flow

```
HTTP Request → Route → Middleware → Controller → Response
```

---

## Basic Routing

### Route Definition

Routes are defined in `routes/web.ts`:

```typescript
import Route from "./Route";
import HomeController from "../app/controllers/HomeController";

// GET request
Route.get("/", HomeController.index);

// POST request
Route.post("/contact", HomeController.contact);

// PUT request
Route.put("/users/:id", UserController.update);

// DELETE request
Route.delete("/posts/:id", PostController.destroy);
```

### HTTP Methods

```typescript
Route.get("/path", Controller.method);     // GET
Route.post("/path", Controller.method);    // POST
Route.put("/path", Controller.method);     // PUT
Route.patch("/path", Controller.method);   // PATCH
Route.delete("/path", Controller.method);  // DELETE
```

---

## Route Parameters

### URL Parameters

```typescript
// routes/web.ts
Route.get("/users/:id", UserController.show);
Route.get("/posts/:postId/comments/:commentId", CommentController.show);

// Controller
public async show(request: Request, response: Response) {
  const { id } = request.params;
  const user = await DB.from("users").where("id", id).first();
  return response.json({ user });
}
```

### Query Parameters

```typescript
// URL: /search?q=hello&page=2

public async search(request: Request, response: Response) {
  const { q, page } = request.query;
  
  const results = await DB.from("posts")
    .where("title", "like", `%${q}%`)
    .limit(10)
    .offset((page - 1) * 10);
  
  return response.json({ results });
}
```

---

## Controllers

### Creating a Controller

**Using CLI:**
```bash
node laju make:controller PostController
```

**Manual creation** (`app/controllers/PostController.ts`):

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";

class PostController {
  // List all posts
  public async index(request: Request, response: Response) {
    const posts = await DB.from("posts").orderBy("created_at", "desc");
    return response.inertia("posts/index", { posts });
  }

  // Show create form
  public async create(request: Request, response: Response) {
    return response.inertia("posts/create");
  }

  // Store new post
  public async store(request: Request, response: Response) {
    const { title, content } = await request.json();
    
    await DB.table("posts").insert({
      title,
      content,
      user_id: request.user.id,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    
    return response.redirect("/posts");
  }

  // Show single post
  public async show(request: Request, response: Response) {
    const { id } = request.params;
    const post = await DB.from("posts").where("id", id).first();
    
    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }
    
    return response.inertia("posts/show", { post });
  }

  // Show edit form
  public async edit(request: Request, response: Response) {
    const { id } = request.params;
    const post = await DB.from("posts").where("id", id).first();
    
    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }
    
    return response.inertia("posts/edit", { post });
  }

  // Update post
  public async update(request: Request, response: Response) {
    const { id } = request.params;
    const { title, content } = await request.json();
    
    await DB.from("posts").where("id", id).update({
      title,
      content,
      updated_at: Date.now()
    });
    
    return response.redirect("/posts");
  }

  // Delete post
  public async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await DB.from("posts").where("id", id).delete();
    return response.json({ success: true });
  }
}

export default new PostController();
```

### RESTful Routes

```typescript
// routes/web.ts
import PostController from "../app/controllers/PostController";

Route.get("/posts", PostController.index);           // List
Route.get("/posts/create", PostController.create);   // Create form
Route.post("/posts", PostController.store);          // Store
Route.get("/posts/:id", PostController.show);        // Show
Route.get("/posts/:id/edit", PostController.edit);   // Edit form
Route.put("/posts/:id", PostController.update);      // Update
Route.delete("/posts/:id", PostController.destroy);  // Delete
```

### ⚠️ Controller Organization & Method Calls

**CRITICAL:** Laju exports controller **instances**, not classes. This affects how you organize controller code.

#### ❌ DON'T: Use `this` for internal methods

```typescript
// ❌ WRONG - this.method() doesn't work
class UserController {
  public async store(request: Request, response: Response) {
    const body = await request.json();

    // This will fail because 'this' doesn't work with exported instances
    const validated = this.validateUser(body);

    await DB.table("users").insert(validated);
    return response.json({ success: true });
  }

  private validateUser(data: any) {
    // Validation logic
    return data;
  }
}

export default new UserController();
```

#### ✅ DO: Use Static Methods

```typescript
// ✅ CORRECT - Use static methods
class UserController {
  public async store(request: Request, response: Response) {
    const body = await request.json();

    // Call static method
    const validated = UserController.validateUser(body);

    await DB.table("users").insert(validated);
    return response.json({ success: true });
  }

  private static validateUser(data: any) {
    // Validation logic
    return data;
  }
}

export default new UserController();
```

#### ✅ DO: Use Separate Utility Functions

```typescript
// ✅ ALSO CORRECT - Extract to utility function
import { validateUser } from "../utils/validation";

class UserController {
  public async store(request: Request, response: Response) {
    const body = await request.json();

    // Call utility function
    const validated = validateUser(body);

    await DB.table("users").insert(validated);
    return response.json({ success: true });
  }
}

export default new UserController();

// In utils/validation.ts
export function validateUser(data: any) {
  // Validation logic
  return data;
}
```

#### Why This Happens

Laju controllers are exported as **instances**, not classes:

```typescript
// routes/web.ts
import UserController from "../app/controllers/UserController";

// UserController is already an instance (new UserController())
Route.post("/users", UserController.store);
```

When methods are called, the context (`this`) is lost because methods are referenced by reference:

```typescript
// The method is extracted as a function reference
Route.post("/users", UserController.store);
// Same as: const handler = UserController.store;
// When called: handler(request, response) → 'this' is undefined
```

#### Best Practices for Controller Organization

1. **Keep controllers thin** - Move business logic to services
2. **Use static methods** for helper functions within controllers
3. **Extract utilities** - Put reusable functions in separate files
4. **Use services** - Business logic goes in `app/services/`

```typescript
// Good controller structure
class UserController {
  // Main handler - thin, delegates to services
  public async store(request: Request, response: Response) {
    const body = await request.json();

    // Validate (static method or utility)
    const validated = UserController.validateInput(body);
    if (!validated) {
      return response.status(400).json({ error: "Invalid input" });
    }

    // Business logic in service
    const user = await UserService.create(validated);

    return response.json({ user });
  }

  // Static validation method
  private static validateInput(data: any) {
    return data.email && data.password && data.name;
  }
}

export default new UserController();
```

#### Common Pattern: Service Layer

```typescript
// app/services/UserService.ts
class UserService {
  async create(data: any) {
    // Business logic
    const hashedPassword = await Authenticate.hash(data.password);
    const user = { ...data, password: hashedPassword };

    return await DB.table("users").insert(user);
  }

  async findByEmail(email: string) {
    return await DB.table("users").where("email", email).first();
  }
}

export default new UserService();

// In controller
import UserService from "../services/UserService";

class UserController {
  public async store(request: Request, response: Response) {
    const body = await request.json();
    const user = await UserService.create(body);
    return response.json({ user });
  }
}

export default new UserController();
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
    const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
    return response.flash("error", firstError).redirect("/profile", 303);
  }
  
  await DB.from("users").where("id", request.user.id).update(body);
  
  return response
    .flash("success", "Profile updated successfully")
    .redirect("/profile", 303);
}

// ❌ WRONG - Don't use default 302 for form submissions
public async update(request: Request, response: Response) {
  await DB.from("users").where("id", id).update(data);
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

#### Usage in Controller

```typescript
// Send error message
return response
   .flash("error", "Email sudah terdaftar")
   .redirect("/register");

// Send success message
return response
   .flash("success", "Registrasi berhasil!")
   .redirect("/login");

// Chain with other methods
return response
   .flash("error", "Password salah")
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
import { registerSchema } from "../validators/AuthValidator";

public async processRegister(request: Request, response: Response) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = Validator.validate(registerSchema, body);
    
    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
      return response
         .flash("error", firstError)
         .redirect("/register");
    }
    
    const { email, password, name } = validationResult.data!;
    
    // Business logic
    const existingUser = await DB.from("users").where("email", email).first();
    if (existingUser) {
      return response
         .flash("error", "Email sudah terdaftar")
         .redirect("/register");
    }
    
    // Success
    return response.redirect("/success");
    
  } catch (error: any) {
    console.error("Error:", error);
    
    // Handle specific database errors
    if (error.code === 'SQLITE_CONSTRAINT') {
      return response.flash("error", "Data sudah ada").redirect("/path");
    }
    
    // Generic error
    return response.flash("error", "Terjadi kesalahan. Silakan coba lagi nanti.").redirect("/path");
  }
}
```

---

### Complete Error Handling Pattern

Here's a complete example showing all aspects of error handling:

```typescript
public async processRequest(request: Request, response: Response) {
  try {
    const body = await request.json();
    
    // 1. Validation
    const validationResult = Validator.validate(schema, body);
    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
      return response.flash("error", firstError).redirect("/path");
    }
    
    // 2. Business logic
    const { email } = validationResult.data!;
    
    // 3. Database operations
    const existing = await DB.from("users").where("email", email).first();
    if (existing) {
      return response.flash("error", "Email sudah terdaftar").redirect("/path");
    }
    
    // 4. Success
    return response.redirect("/success");
    
  } catch (error: any) {
    console.error("Error:", error);
    
    // Handle specific database errors
    if (error.code === 'SQLITE_CONSTRAINT') {
      return response.flash("error", "Data sudah ada").redirect("/path");
    }
    
    // Generic error
    return response.flash("error", "Terjadi kesalahan. Silakan coba lagi nanti.").redirect("/path");
  }
}
```

---

### Validation with JSON Response (For API Endpoints)

For API endpoints (not Inertia forms), use `validateOrFail()`:

```typescript
const validated = Validator.validateOrFail(schema, body, response);
if (!validated) return; // Validation failed, response already sent
```

---

## Common Patterns

### Pattern 1: List with Pagination

```typescript
public async index(request: Request, response: Response) {
  const page = parseInt(request.query.page || "1");
  const perPage = 10;
  const offset = (page - 1) * perPage;
  
  const posts = await DB.from("posts")
    .orderBy("created_at", "desc")
    .limit(perPage)
    .offset(offset);
  
  const total = await DB.from("posts").count("* as count").first();
  
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
public async index(request: Request, response: Response) {
  const { search, status, sort } = request.query;
  
  let query = DB.from("posts");
  
  // Search
  if (search) {
    query = query.where("title", "like", `%${search}%`);
  }
  
  // Filter
  if (status) {
    query = query.where("status", status);
  }
  
  // Sort
  const sortBy = sort || "created_at";
  query = query.orderBy(sortBy, "desc");
  
  const posts = await query;
  
  return response.inertia("posts/index", { posts, search, status, sort });
}
```

### Pattern 3: Form Validation

```typescript
public async store(request: Request, response: Response) {
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
  await DB.table("posts").insert({
    title,
    content,
    created_at: Date.now(),
    updated_at: Date.now()
  });
  
  return response.redirect("/posts");
}
```

### Pattern 4: API Response

```typescript
public async index(request: Request, response: Response) {
  try {
    const posts = await DB.from("posts");
    
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

### Pattern 5: File Upload

Laju provides two separate upload endpoints for different file types:

#### Upload Routes

```typescript
// routes/web.ts
import UploadController from "../app/controllers/UploadController";
import Auth from "../app/middlewares/auth";
import { uploadRateLimit } from "../app/middlewares/rateLimit";

// Upload images with processing (resize, convert to WebP)
Route.post("/api/upload/image", [Auth, uploadRateLimit], UploadController.uploadImage);

// Upload files without processing (PDF, Word, Excel, etc.)
Route.post("/api/upload/file", [Auth, uploadRateLimit], UploadController.uploadFile);
```

#### Image Upload with Processing

```typescript
// app/controllers/UploadController.ts
import { uuidv7 } from "uuidv7";
import sharp from "sharp";
import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";

public async uploadImage(request: Request, response: Response) {
   if (!request.user) {
      return response.status(401).json({ error: 'Unauthorized' });
   }

   const userId = request.user.id;
   let uploadedAsset: any = null;

   await request.multipart(async (field: unknown) => {
      if (field && typeof field === 'object' && 'file' in field && field.file) {
         const file = field.file as { stream: NodeJS.ReadableStream; mime_type: string };
         
         // Validate file type
         const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
         if (!allowedTypes.includes(file.mime_type)) {
            return response.status(400).json({ 
               success: false, 
               error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
            });
         }

         // Convert stream to buffer
         const chunks: Buffer[] = [];
         file.stream.on('data', (chunk: Buffer) => chunks.push(chunk));
         
         await new Promise((resolve) => {
            file.stream.on('end', resolve);
         });
         
         const buffer = Buffer.concat(chunks);

         // Process image with Sharp
         const processedBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .toBuffer();

         // Upload to storage
         const id = uuidv7();
         const fileName = `${id}.webp`;
         const storageKey = `assets/${fileName}`;
         
         await uploadBuffer(storageKey, processedBuffer, 'image/webp');
         const publicUrl = getPublicUrl(storageKey);

         // Save to database
         uploadedAsset = {
            id,
            type: 'image',
            url: publicUrl,
            mime_type: 'image/webp',
            name: fileName,
            size: processedBuffer.length,
            user_id: userId,
            storage_key: storageKey,
            created_at: Date.now(),
            updated_at: Date.now()
         };

         await DB.from("assets").insert(uploadedAsset);
         response.json({ success: true, data: uploadedAsset });
      }
   });
}
```

#### File Upload (Non-Image)

```typescript
public async uploadFile(request: Request, response: Response) {
   if (!request.user) {
      return response.status(401).json({ error: 'Unauthorized' });
   }

   const userId = request.user.id;

   await request.multipart(async (field: unknown) => {
      if (field && typeof field === 'object' && 'file' in field && field.file) {
         const file = field.file as { stream: NodeJS.ReadableStream; mime_type: string; name: string };
         
         // Validate file type
         const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv'
         ];
         
         if (!allowedTypes.includes(file.mime_type)) {
            return response.status(400).json({ 
               success: false, 
               error: 'Invalid file type. Allowed types: PDF, Word, Excel, Text, CSV' 
            });
         }

         // Convert stream to buffer
         const chunks: Buffer[] = [];
         file.stream.on('data', (chunk: Buffer) => chunks.push(chunk));
         
         await new Promise((resolve) => {
            file.stream.on('end', resolve);
         });
         
         const buffer = Buffer.concat(chunks);

         // Upload directly without processing
         const id = uuidv7();
         const ext = file.name.split('.').pop();
         const fileName = `${id}.${ext}`;
         const storageKey = `files/${userId}/${fileName}`;
         
         await uploadBuffer(storageKey, buffer, file.mime_type);
         const publicUrl = getPublicUrl(storageKey);

         // Save to database
         const uploadedAsset = {
            id,
            type: 'file',
            url: publicUrl,
            mime_type: file.mime_type,
            name: file.name,
            size: buffer.length,
            user_id: userId,
            storage_key: storageKey,
            created_at: Date.now(),
            updated_at: Date.now()
         };

         await DB.from("assets").insert(uploadedAsset);
         response.json({ success: true, data: uploadedAsset });
      }
   });
}
```

#### Storage Service Selection

Choose between S3 and Local Storage by changing the import:

```typescript
// For S3 Storage
import { getPublicUrl, uploadBuffer } from "app/services/S3";

// For Local Storage
import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";
```

Both services have the same API, making it easy to switch between them.

#### Client-Side Upload Example

```javascript
// Upload image
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData
});

const { success, data } = await response.json();
console.log(data.url); // Public URL of uploaded image
```

---

## Best Practices

### ✅ DO

**1. Keep controllers thin**
```typescript
// ✅ Good - Delegate to services
public async store(request: Request, response: Response) {
  const data = await request.json();
  const post = await PostService.create(data);
  return response.json({ success: true, data: post });
}
```

**2. Use try-catch for error handling**
```typescript
// ✅ Good
public async store(request: Request, response: Response) {
  try {
    const data = await request.json();
    await DB.table("posts").insert(data);
    return response.json({ success: true });
  } catch (error) {
    return response.status(500).json({ error: "Failed to create post" });
  }
}
```

**3. Validate input**
```typescript
// ✅ Good
const { email } = await request.json();

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return response.status(422).json({ error: "Invalid email" });
}
```

**4. Use proper HTTP status codes**
```typescript
// ✅ Good
200 // OK
201 // Created
400 // Bad Request
401 // Unauthorized
404 // Not Found
422 // Validation Error
500 // Server Error
```

**5. Return consistent response format**
```typescript
// ✅ Good - Success
{ success: true, data: { ... } }

// ✅ Good - Error
{ error: "Message", details: { ... } }
```

---

### ❌ DON'T

**1. Don't put business logic in controllers**
```typescript
// ❌ Bad
public async store(request: Request, response: Response) {
  const data = await request.json();
  // Complex validation logic
  // Complex business rules
  // Complex data transformation
  await DB.table("posts").insert(data);
}
```

**2. Don't forget error handling**
```typescript
// ❌ Bad - No error handling
public async store(request: Request, response: Response) {
  const data = await request.json();
  await DB.table("posts").insert(data);
  return response.json({ success: true });
}
```

**3. Don't expose sensitive data**
```typescript
// ❌ Bad
const user = await DB.from("users").where("id", id).first();
return response.json({ user }); // Includes password hash!

// ✅ Good
const user = await DB.from("users")
  .where("id", id)
  .select("id", "name", "email")
  .first();
return response.json({ user });
```

**4. Don't use synchronous operations**
```typescript
// ❌ Bad
const data = fs.readFileSync("file.txt");

// ✅ Good
const data = await fs.promises.readFile("file.txt");
```

---

## Summary

### Key Takeaways

1. **Routes connect URLs to controllers** - Define in `routes/web.ts`
2. **Controllers handle business logic** - Keep them thin and focused
3. **Use proper HTTP methods** - GET, POST, PUT, DELETE
4. **Validate input** - Always validate user data
5. **Handle errors** - Use try-catch blocks
6. **Return consistent responses** - Use standard format

### Quick Reference

```typescript
// Define route
Route.get("/posts", PostController.index);
Route.post("/posts", PostController.store);

// Controller method
public async index(request: Request, response: Response) {
  const posts = await DB.from("posts");
  return response.inertia("posts/index", { posts });
}

// Get request data
const data = await request.json();
const { id } = request.params;
const { page } = request.query;

// Send response
return response.json({ data });
return response.inertia("page", { props });
return response.redirect("/path");
```

---

## Next Steps

- [Frontend (Svelte 5)](05-FRONTEND-SVELTE.md) - Build UI with Svelte
- [Middleware Guide](07-MIDDLEWARE.md) - Add authentication & validation
- [Database Guide](03-DATABASE.md) - Learn database operations
- [Validation Guide](08-VALIDATION.md) - Input validation with Zod
