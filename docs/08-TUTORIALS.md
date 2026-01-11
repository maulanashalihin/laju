# Tutorials

Step-by-step guides for building features with Laju.

## Table of Contents

1. [Building Your First App (CRUD)](#tutorial-building-your-first-app)
2. [Complete CRUD with Edit/Delete](#tutorial-complete-crud)
3. [Protected Routes with Auth](#tutorial-protected-routes)
4. [File Upload with S3](#tutorial-file-upload-with-s3)
5. [Squirrelly Template Engine](#squirrelly-template-engine)
6. [CLI Commands](#cli-commands)

---

## Tutorial: Building Your First App

This tutorial walks you through a simple blog feature using Inertia + Svelte and Knex.

### 1) Routes and Controller

Create `app/controllers/PostController.ts`:

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";

class Controller {
  public async index(request: Request, response: Response) {
    const posts = await DB.from("posts");
    return response.inertia("posts/index", { posts });
  }

  public async create(request: Request, response: Response) {
    return response.inertia("posts/create");
  }

  public async store(request: Request, response: Response) {
    const { title, content } = await request.json();
    await DB.table("posts").insert({
      title,
      content,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    return response.redirect("/posts");
  }
}

export default new Controller();
```

Add routes in `routes/web.ts`:

```typescript
import PostController from "../app/controllers/PostController";

Route.get("/posts", PostController.index);
Route.get("/posts/create", PostController.create);
Route.post("/posts", PostController.store);
```

### 2) Database Migration

Create a migration:

```bash
npx knex migrate:make create_posts_table
```

Migration content:

```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('posts', function (table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.bigInteger('created_at');
    table.bigInteger('updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('posts');
}
```

Run the migration:

```bash
npx knex migrate:latest
```

### 3) Svelte Pages (Inertia)

Create `resources/js/Pages/posts/index.svelte`:

```svelte
<script>
  let { posts } = $props();
</script>

<div class="max-w-4xl mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Blog Posts</h1>
    <a 
      href="/posts/create" 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Create Post
    </a>
  </div>

  <div class="space-y-4">
    {#each posts as post}
      <div class="border p-4 rounded">
        <h2 class="text-xl font-semibold">{post.title}</h2>
        <p class="mt-2 text-gray-600">{post.content}</p>
      </div>
    {/each}
  </div>
</div>
```

Create `resources/js/Pages/posts/create.svelte`:

```svelte
<script>
  import { router } from '@inertiajs/svelte';
  
  let form = $state({ title: '', content: '' });
  
  function handleSubmit() { 
    router.post('/posts', form); 
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Create New Post</h1>

  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Title</label>
      <input type="text" bind:value={form.title} class="w-full px-3 py-2 border rounded focus:outline-none" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Content</label>
      <textarea bind:value={form.content} class="w-full px-3 py-2 border rounded h-32 focus:outline-none"></textarea>
    </div>
    <div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Post</button>
    </div>
  </form>
</div>
```

### 4) Test the App

- Run `npm run dev`
- Visit `http://localhost:5555/posts`
- Create a new post and verify listing on index page

---

## Tutorial: Complete CRUD

Extend the blog app with edit, update, and delete functionality.

### 1) Add Controller Methods

Update `app/controllers/PostController.ts`:

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";

class PostController {
  public async index(request: Request, response: Response) {
    const posts = await DB.from("posts").orderBy("created_at", "desc");
    return response.inertia("posts/index", { posts });
  }

  public async create(request: Request, response: Response) {
    return response.inertia("posts/create");
  }

  public async store(request: Request, response: Response) {
    const { title, content } = await request.json();
    await DB.table("posts").insert({
      title,
      content,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    return response.redirect("/posts");
  }

  public async edit(request: Request, response: Response) {
    const { id } = request.params;
    const post = await DB.from("posts").where("id", id).first();
    
    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }
    
    return response.inertia("posts/edit", { post });
  }

  public async update(request: Request, response: Response) {
    const { id } = request.params;
    const { title, content } = await request.json();
    
    await DB.table("posts").where("id", id).update({
      title,
      content,
      updated_at: Date.now()
    });
    
    return response.redirect("/posts");
  }

  public async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await DB.from("posts").where("id", id).delete();
    return response.json({ success: true });
  }
}

export default new PostController();
```

### 2) Add Routes

```typescript
// routes/web.ts
import PostController from "../app/controllers/PostController";

Route.get("/posts", PostController.index);
Route.get("/posts/create", PostController.create);
Route.post("/posts", PostController.store);
Route.get("/posts/:id/edit", PostController.edit);
Route.post("/posts/:id", PostController.update);
Route.delete("/posts/:id", PostController.destroy);
```

### 3) Create Edit Page

Create `resources/js/Pages/posts/edit.svelte`:

```svelte
<script>
  import { router } from '@inertiajs/svelte';
  
  let { post } = $props();
  let form = $state({ title: post.title, content: post.content });
  
  function handleSubmit() {
    router.post(`/posts/${post.id}`, form);
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Edit Post</h1>

  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Title</label>
      <input type="text" bind:value={form.title} class="w-full px-3 py-2 border rounded focus:outline-none" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Content</label>
      <textarea bind:value={form.content} class="w-full px-3 py-2 border rounded h-32 focus:outline-none"></textarea>
    </div>
    <div class="flex gap-2">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Post
      </button>
      <a href="/posts" class="px-4 py-2 border rounded hover:bg-gray-50">Cancel</a>
    </div>
  </form>
</div>
```

### 4) Update Index with Edit/Delete

Update `resources/js/Pages/posts/index.svelte`:

```svelte
<script>
  import { router } from '@inertiajs/svelte';
  
  let { posts } = $props();
  
  function deletePost(id) {
    if (confirm('Are you sure?')) {
      router.delete(`/posts/${id}`);
    }
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Blog Posts</h1>
    <a href="/posts/create" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Create Post
    </a>
  </div>

  <div class="space-y-4">
    {#each posts as post}
      <div class="border p-4 rounded">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold">{post.title}</h2>
            <p class="mt-2 text-gray-600">{post.content}</p>
          </div>
          <div class="flex gap-2">
            <a href={`/posts/${post.id}/edit`} class="text-blue-500 hover:underline">Edit</a>
            <button onclick={() => deletePost(post.id)} class="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
```

---

## Tutorial: Protected Routes

Add authentication protection to your routes.

### 1) Protect Routes with Auth Middleware

```typescript
// routes/web.ts
import Auth from "../app/middlewares/auth";
import PostController from "../app/controllers/PostController";

// Public routes (no auth required)
Route.get("/posts", PostController.index);

// Protected routes (auth required)
Route.get("/posts/create", [Auth], PostController.create);
Route.post("/posts", [Auth], PostController.store);
Route.get("/posts/:id/edit", [Auth], PostController.edit);
Route.post("/posts/:id", [Auth], PostController.update);
Route.delete("/posts/:id", [Auth], PostController.destroy);
```

### 2) Access User in Controller

```typescript
public async store(request: Request, response: Response) {
  const { title, content } = await request.json();
  
  // Access authenticated user
  const userId = request.user.id;
  
  await DB.table("posts").insert({
    title,
    content,
    user_id: userId,  // Associate post with user
    created_at: Date.now(),
    updated_at: Date.now()
  });
  
  return response.redirect("/posts");
}
```

### 3) Check Ownership Before Edit/Delete

```typescript
public async update(request: Request, response: Response) {
  const { id } = request.params;
  const post = await DB.from("posts").where("id", id).first();
  
  // Check if user owns this post
  if (post.user_id !== request.user.id && !request.user.is_admin) {
    return response.status(403).json({ error: "Unauthorized" });
  }
  
  const { title, content } = await request.json();
  await DB.table("posts").where("id", id).update({ title, content });
  
  return response.redirect("/posts");
}
```

### 4) Access User in Svelte Pages

User data is automatically passed to all Inertia pages via the `user` prop:

```svelte
<script>
  let { user, posts } = $props();
</script>

{#if user?.id}
  <p>Welcome, {user.name}!</p>
  <a href="/posts/create">Create Post</a>
{:else}
  <a href="/login">Login to create posts</a>
{/if}
```

---

## Tutorial: File Upload with S3

Implement file uploads using presigned URLs.

### 1) Create Upload Controller

```typescript
// app/controllers/UploadController.ts
import { Request, Response } from "../../type";
import { getSignedUploadUrl, getPublicUrl } from "../services/S3";
import { randomUUID } from "crypto";

class UploadController {
  public async getSignedUrl(request: Request, response: Response) {
    const { filename, contentType } = await request.json();
    
    // Generate unique key
    const ext = filename.split('.').pop();
    const key = `uploads/${request.user.id}/${randomUUID()}.${ext}`;
    
    // Generate presigned URL (expires in 1 hour)
    const signedUrl = await getSignedUploadUrl(key, contentType, 3600);
    const publicUrl = getPublicUrl(key);
    
    return response.json({
      success: true,
      data: { signedUrl, publicUrl, key }
    });
  }
}

export default new UploadController();
```

### 2) Add Route

```typescript
// routes/web.ts
import UploadController from "../app/controllers/UploadController";
import { uploadRateLimit } from "../app/middlewares/rateLimit";

Route.post("/api/upload/signed-url", [Auth, uploadRateLimit], UploadController.getSignedUrl);
```

### 3) Create Upload Component

```svelte
<!-- resources/js/Components/FileUpload.svelte -->
<script>
  let { onUpload } = $props();
  let uploading = $state(false);
  let progress = $state(0);
  
  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    uploading = true;
    
    try {
      // 1. Get presigned URL from server
      const res = await fetch('/api/upload/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });
      
      const { data } = await res.json();
      
      // 2. Upload directly to S3
      await fetch(data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
      
      // 3. Return public URL
      onUpload?.(data.publicUrl);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      uploading = false;
    }
  }
</script>

<div>
  <input 
    type="file" 
    onchange={handleFileSelect}
    disabled={uploading}
    class="block w-full text-sm border rounded p-2"
  />
  {#if uploading}
    <p class="text-sm text-gray-500 mt-1">Uploading...</p>
  {/if}
</div>
```

### 4) Use in Form

```svelte
<script>
  import FileUpload from '$lib/Components/FileUpload.svelte';
  import { router } from '@inertiajs/svelte';
  
  let form = $state({ title: '', image_url: '' });
  
  function handleImageUpload(url) {
    form.image_url = url;
  }
  
  function handleSubmit() {
    router.post('/posts', form);
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <input type="text" bind:value={form.title} placeholder="Title" />
  
  <FileUpload onUpload={handleImageUpload} />
  
  {#if form.image_url}
    <img src={form.image_url} alt="Preview" class="w-32 h-32 object-cover" />
  {/if}
  
  <button type="submit">Create</button>
</form>
```

---

## Squirrelly Template Engine

Squirrelly is a lightweight and fast template engine used for server-side HTML rendering. Laju provides a `View` service that automatically loads all files from `resources/views` (development) or `dist/views` (production), supports partials, and adjusts asset paths during development.

### Basic Usage

1) Create `resources/views/hello.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>{{it.title}}</title>
    <link rel="stylesheet" href="/js/index.css" />
  </head>
  <body>
    {{@include('partials/header.html')}}
    <main class="p-6">
      <h1 class="text-2xl font-bold">Hello, {{it.name}}!</h1>
    </main>
  </body>
</html>
```

2) Create optional partial `resources/views/partials/header.html`:

```html
<header class="p-4 bg-gray-100 border-b">
  <a href="/" class="text-emerald-600 font-semibold">Home</a>
</header>
```

3) Render from a controller:

```ts
// app/controllers/HomeController.ts
import { Request, Response } from "../../type";
import { view } from "../services/View";

class Controller {
  public async hello(request: Request, response: Response) {
    const html = view("hello.html", { title: "Hello Page", name: "Laju" });
    return response.type("html").send(html);
  }
}

export default new Controller();
```

4) Register the route:

```ts
// routes/web.ts
Route.get("/hello", HomeController.hello);
```

### Template Syntax

- Use `{{it.xxx}}` to access data passed to the template
- Use `{{@include('path/to/partial.html')}}` for partials
- In development, `/js/*` assets are automatically served from the Vite dev server

Reference: [squirrelly.js.org](https://squirrelly.js.org)

---

## CLI Commands

### Create Controller

```bash
node laju make:controller ControllerName
```

Creates a new controller in `app/controllers` with basic CRUD methods.

Example:
```bash
node laju make:controller UserController
```

### Create Command

```bash
node laju make:command CommandName
```

Creates a new command in `commands` that can be scheduled with cron jobs.

Example:
```bash
node laju make:command SendDailyEmails
```

Crontab example:
```bash
# Run every day at midnight
0 0 * * * cd /path/to/your/app/build && node commands/SendDailyEmails.js
```
