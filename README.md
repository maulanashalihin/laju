# Laju

A high-performance TypeScript web framework combining HyperExpress, Svelte 5, and Inertia.js for building modern full-stack applications. It features fast server-side rendering, modern frontend tooling, and seamless client–server state management.

Visit `https://laju.dev`

## Table of Contents
- Overview
- Features
- Prerequisites
- Quick Start
- Manual Installation
- Environment Setup (Google OAuth)
- Development
- Build for Production
- Project Structure
- Key Dependencies
- Scripts
- CLI Commands
- Tutorial: Building Your First App
- Squirrelly Quick Guide
- Best Practices
- Contributing
- License

## Features

- Fast server-side rendering with `HyperExpress`
- Modern frontend with `Svelte 5`
- TypeScript support for better type safety
- Inertia.js integration for seamless client–server communication
- Built-in authentication system
- BetterSQLite3 database with Knex query builder
- Email support with Nodemailer
- Google APIs integration
- Redis caching support
- Asset bundling with Vite
- Squirrelly template engine for fast server-side HTML rendering
- TailwindCSS for styling

## Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn

## Quick Start

```bash
npx create-laju-app project-name
cd project-name
npm run dev
```

## Manual Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your variables:
   ```bash
   cp .env.example .env
   ```
4. Set up Google OAuth credentials:
   1. Go to the Google Cloud Console: `https://console.cloud.google.com/`
   2. Create/select a project
   3. Enable Google OAuth2 API
   4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   5. Choose "Web application"
   6. Use:
      - Authorized JavaScript origins: `http://localhost:5555`
      - Authorized redirect URIs: `http://localhost:5555/google/callback`
   7. Copy the Client ID and Client Secret
   8. Add them to `.env`:
      ```
      GOOGLE_CLIENT_ID=your_client_id_here
      GOOGLE_CLIENT_SECRET=your_client_secret_here
      ```
5. Run database migrations:
   ```bash
   npx knex migrate:latest
   ```

## Development

Run the development servers:

```bash
npm run dev
```

- Starts the Vite dev server for frontend assets
- Runs the backend server with nodemon (auto-reload)

## Build for Production

```bash
npm run build
```

- Cleans the build directory
- Builds frontend assets with Vite
- Compiles TypeScript files
- Copies required files to the build directory

## Project Structure

- `app/` — Core application code
  - `middlewares/` — Custom middleware functions
  - `services/` — Service layer implementations (DB, Mailer, Redis, View, etc.)
  - `controllers/` — Application controllers
- `resources/` — Frontend resources
  - `views/` — Squirrelly HTML templates
    - `resources/views/index.html`
    - `resources/views/inertia.html`
  - `js/` — JavaScript assets and modules
    - `Pages/` — Svelte/Inertia pages
    - `Components/` — Reusable UI components
    - `app.js` — Inertia/Svelte entry (via Vite)
    - `index.css` — Global styles (TailwindCSS)
- `routes/` — Route definitions
- `commands/` — Custom CLI commands
- `migrations/` — Database migrations
- `public/` — Static files
- `dist/` — Compiled assets (generated)
- `build/` — Production build output

## Key Dependencies

- Backend:
  - `HyperExpress` — High-performance web server
  - `Knex` — SQL query builder
  - `BetterSQLite3` — Embedded database
  - `Nodemailer` — Email sending
  - `Redis` — Caching (optional)
  - `Squirrelly` — Fast template engine
- Frontend:
  - `Svelte 5` — UI framework
  - `Inertia.js` — Client–server communication (modern monolith)
  - `TailwindCSS` — Utility-first CSS
  - `Vite` — Dev server and bundler

## Scripts

- `npm run dev` — Start development servers
- `npm run build` — Build for production

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
  export let posts = [];
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
  let form = { title: '', content: '' };
  function handleSubmit() { router.post('/posts', form); }
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Create New Post</h1>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Title</label>
      <input type="text" bind:value={form.title} class="w-full px-3 py-2 border rounded" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Content</label>
      <textarea bind:value={form.content} class="w-full px-3 py-2 border rounded h-32"></textarea>
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

## Squirrelly Quick Guide

Squirrelly is a lightweight and fast template engine used for server-side HTML rendering. Laju provides a `View` service that automatically loads all files from `resources/views` (development) or `dist/views` (production), supports partials, and adjusts asset paths during development.

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
import HyperExpress from "hyper-express";
import HomeController from "../app/controllers/HomeController";
const Route = new HyperExpress.Router();

Route.get("/hello", HomeController.hello);
```

Notes:
- Use `{{it.xxx}}` to access data passed to the template
- In development, `/js/*` assets are automatically served from the Vite dev server (`VITE_PORT`)
- For Inertia, `resources/views/inertia.html` already uses Squirrelly (`{{it.title}}`, `{{it.page}}`)

Reference: `https://squirrelly.js.org`

## Best Practices

- File Organization
  - Keep controllers in `app/controllers`
  - Create Inertia pages in `resources/js/Pages`
  - Place Svelte components in `resources/js/Components`
  - Database migrations in `migrations`
- Code Structure
  - Use TypeScript types for safety and clarity
  - Keep controllers focused on single responsibilities
  - Use Inertia.js for state management between server and client
- Database
  - Always use migrations for schema changes
  - Use the Query Builder for complex queries
  - Include timestamps for tracking record changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC License
