# Tutorials

Step-by-step guides for building features with Laju.

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
