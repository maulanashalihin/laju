# Laju

A high-performance TypeScript web framework combining HyperExpress, Svelte 5, and Inertia.js for building modern full-stack applications. It features fast server-side rendering, modern frontend tooling, and seamless client–server state management.

Visit [https://laju.dev](https://laju.dev)

Documentation [https://github.com/maulanashalihin/laju/tree/main/docs](https://github.com/maulanashalihin/laju/tree/main/docs)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-20--22-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/maulanashalihin/laju?style=social)](https://github.com/maulanashalihin/laju)
[![Website](https://img.shields.io/badge/Website-laju.dev-orange)](https://laju.dev)
[![Sponsor](https://img.shields.io/badge/Sponsor-❤-ff69b4)](https://github.com/sponsors/maulanashalihin)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/maulanashalihin/laju)

## Table of Contents
- [Overview](#laju)
- [Features](#features)
- [Performance Benchmark](#performance-benchmark)
- [Database Performance](#database-performance)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Manual Installation](#manual-installation)
- [Environment Setup (Google OAuth)](#manual-installation)
- [Development](#development)
- [Build for Production](#build-for-production)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Key Dependencies](#key-dependencies)
- [Scripts](#scripts)
- [CLI Commands](#cli-commands)
- [Tutorial: Building Your First App](#tutorial-building-your-first-app)
- [Squirrelly Quick Guide](#squirrelly-quick-guide)
- [Tutorial: S3 Upload (Presigned URL)](#tutorial-s3-upload-presigned-url)
- [Backup & Restore Database](#backup--restore-database)
- [Best Practices](#best-practices)
- [AI-Driven Development: 100% No-Code Workflow](#ai-driven-development-100-no-code-workflow)
- [Contributing](#contributing)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
- [Support](#support)
- [License](#license)

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

## Performance Benchmark

Laju.dev delivers exceptional performance compared to pure Node.js, thanks to HyperExpress's optimized HTTP server implementation.

### Test Configuration
- Tool: `wrk` (12 threads, 400 connections, 30 seconds)
- Hardware: Mac M4
- Endpoint: Simple HTTP response

### Results

#### Laju.dev (HyperExpress)
```bash
wrk -t12 -c400 -d30s http://localhost:3006

Running 30s test @ http://localhost:3006
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.52ms  255.74us  19.51ms   97.84%
    Req/Sec    21.66k   761.99    22.94k    89.11%
  7759334 requests in 30.00s, 569.79MB read
Requests/sec: 258611.37
Transfer/sec:     18.99MB
```

#### Pure Node.js (http module)
```bash
wrk -t12 -c400 -d30s http://localhost:3007

Running 30s test @ http://localhost:3007
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.62ms    8.26ms 347.87ms   99.54%
    Req/Sec    10.42k     1.04k   36.80k    95.42%
  3733218 requests in 30.10s, 569.64MB read
Requests/sec: 124024.65
Transfer/sec:     18.92MB
```

#### Express.js
```bash
wrk -t12 -c400 -d30s http://127.0.0.1:3005

Running 30s test @ http://127.0.0.1:3005
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    26.36ms   80.32ms   1.56s    98.19%
    Req/Sec     1.90k   334.29     8.29k    93.17%
  679206 requests in 30.07s, 154.16MB read
Requests/sec:  22590.84
Transfer/sec:      5.13MB
```

#### Laravel
```bash
wrk -t12 -c400 -d30s http://localhost:8000

Running 30s test @ http://localhost:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   128.72ms  113.14ms 467.29ms   63.69%
    Req/Sec    30.20     35.13   202.00     86.14%
  2418 requests in 30.10s, 2.55MB read
  Socket errors: connect 0, read 3259, write 0, timeout 0
Requests/sec:     80.33
Transfer/sec:     86.76KB
```

#### Pure PHP (stream_socket_server)
```bash
wrk -t12 -c400 -d30s http://localhost:3008

Running 30s test @ http://localhost:3008
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   471.03us    1.07ms  47.72ms   99.74%
    Req/Sec     0.89k     1.33k    6.01k    81.68%
  23699 requests in 30.10s, 1.70MB read
  Socket errors: connect 0, read 24851, write 0, timeout 0
Requests/sec:    787.28
Transfer/sec:     57.66KB
```

### Performance Comparison

| Framework | Requests/sec | Avg Latency | Total Requests (30s) | vs Laju.dev |
|-----------|--------------|-------------|----------------------|-------------|
| **Laju.dev (HyperExpress)** | **258,611** | **1.52ms** | **7,759,334** | **Baseline** |
| Pure Node.js | 124,024 | 3.62ms | 3,733,218 | 2.08x slower |
| Express.js | 22,590 | 26.36ms | 679,206 | 11.45x slower |
| Pure PHP | 787 | 471.03µs | 23,699 | 328x slower |
| Laravel | 80 | 128.72ms | 2,418 | 3,232x slower |

**Key Insights:**
- **vs Pure Node.js**: Laju.dev achieves **2.08x more requests per second** with **58% lower latency**
- **vs Express.js**: Laju.dev is **11.45x faster** than the most popular Node.js framework
- **vs Pure PHP**: Laju.dev handles **328x more requests per second** (258,611 vs 787 req/s)
  - Pure PHP struggles with concurrent connections, resulting in 24,851 socket read errors
  - Single-threaded blocking I/O makes PHP unsuitable for high-concurrency scenarios
- **vs Laravel**: Laju.dev is **3,232x faster** (258,611 vs 80 req/s)
  - Laravel's full-stack framework overhead adds significant latency (128.72ms vs 1.52ms)
  - Laravel processed only 2,418 requests in 30 seconds with 3,259 socket errors
  - Framework layers (routing, middleware, service container, ORM) create massive performance bottlenecks

### Run HTTP Benchmarks Yourself

Want to test HTTP performance on your own machine? Use the benchmark scripts in the `benchmark` folder:

```bash
# Start Laju.dev test server (port 3006)
node benchmark/laju-test.js

# In another terminal, run benchmarks with wrk
# Test Laju.dev
wrk -t12 -c400 -d30s http://localhost:3006
 
```

**Requirements:**
- Install `wrk` benchmark tool: `brew install wrk` (macOS) or check [wrk GitHub](https://github.com/wg/wrk)
- Adjust threads (`-t`) and connections (`-c`) based on your CPU cores

Results will vary based on your hardware configuration.

## Database Performance

Laju.dev uses BetterSQLite3 with WAL (Write-Ahead Logging) journal mode for exceptional database performance. The framework provides both native better-sqlite3 access and Knex.js query builder.

### WAL Journal Mode Performance

WAL mode dramatically improves write performance, especially for concurrent operations. Tested on Mac M4.

#### Single Insert Operations
| Mode | Performance | Improvement |
|------|-------------|-------------|
| Default Journal | 4,678 ops/sec | - |
| **WAL Journal** | **93,287 ops/sec** | **19.9x faster** |

#### Batch Insert Operations (100 records)
| Mode | Performance | Improvement |
|------|-------------|-------------|
| Default Journal | 2,895 ops/sec | - |
| **WAL Journal** | **8,542 ops/sec** | **2.95x faster** |

#### Transaction Insert Operations (1000 records)
| Mode | Performance | Improvement |
|------|-------------|-------------|
| Default Journal | 936 ops/sec | - |
| **WAL Journal** | **1,162 ops/sec** | **1.24x faster** |

#### Concurrent Write Operations
| Mode | Performance | Improvement |
|------|-------------|-------------|
| Default Journal | 89 ops/sec | - |
| **WAL Journal** | **1,302 ops/sec** | **14.6x faster** |

**Key Benefits of WAL Mode:**
- Concurrent reads while writing
- Dramatically reduced write contention
- Better performance for high-concurrency applications
- Minimal disk space overhead

### Native better-sqlite3 vs Knex.js

Laju.dev provides both native better-sqlite3 (`app/services/SQLite.ts`) and Knex.js (`app/services/DB.ts`) for flexibility. Tested on Mac M4.

#### Insert Operations
| Operation | Native | Knex.js | Performance |
|-----------|--------|---------|-------------|
| Single Insert | 4,226 ops/sec | 4,358 ops/sec | Knex 3.1% faster |
| Batch Insert | 4,364 ops/sec | 4,154 ops/sec | Native 5.1% faster |

#### Select Operations
| Operation | Native | Knex.js | Native Advantage |
|-----------|--------|---------|------------------|
| Select All | 70,501 ops/sec | 35,960 ops/sec | **96.0% faster** |
| Select By ID | 290,020 ops/sec | 59,816 ops/sec | **385.0% faster** |
| Select By Condition | 69,976 ops/sec | 34,849 ops/sec | **100.7% faster** |

#### Update Operations
| Operation | Native | Knex.js | Native Advantage |
|-----------|--------|---------|------------------|
| Update Single Record | 5,197 ops/sec | 5,003 ops/sec | 3.9% faster |

#### Delete Operations
| Operation | Native | Knex.js | Native Advantage |
|-----------|--------|---------|------------------|
| Delete Single Record | 227,006 ops/sec | 80,821 ops/sec | **180.9% faster** |

#### Complex Operations
| Operation | Native | Knex.js | Performance |
|-----------|--------|---------|-------------|
| Complex Query | 195 ops/sec | 218 ops/sec | Knex 11.8% faster |

**Recommendations:**
- **Use Native better-sqlite3** (`SQLite.ts`) for:
  - High-performance read operations (2-4x faster)
  - Simple CRUD operations
  - Performance-critical paths
  - Direct SQL control

- **Use Knex.js** (`DB.ts`) for:
  - Complex query building
  - Database migrations
  - Cross-database compatibility
  - Developer productivity with query builder syntax

Both services use WAL journal mode by default for optimal performance.

### Run Database Benchmarks Yourself

Want to test database performance on your own machine? Use our benchmark repository:

```bash
# Clone the benchmark repository
git clone https://github.com/maulanashalihin/knex-vs-native-better-sqlite3
cd knex-vs-native-better-sqlite3

# Install dependencies
npm install

# Run WAL vs Default Journal Mode benchmark
node sqlite-wal-benchmark.js

# Run Native better-sqlite3 vs Knex.js benchmark
node sqlite-benchmark.js
```

The benchmarks will test:
- **WAL Journal Mode**: Single inserts, batch inserts, transactions, and concurrent writes
- **Native vs Knex.js**: Insert, select, update, delete, and complex query operations

Results will vary based on your hardware. Share your results with the community!

## Prerequisites

- Node.js (version 22)
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

## Deployment

### Quick Start (First Time Deploy)

Build di server, bukan di local. Cukup push source code ke GitHub.

```bash
# 1. SSH ke server
ssh root@your-server-ip

# 2. Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22

# 3. Install PM2
npm install -g pm2

# 4. Clone repository & build
cd /root
git clone https://github.com/yourusername/your-app.git laju
cd laju
npm install
npm run build

# 5. Setup environment (.env di root folder)
cp .env.example .env
nano .env  # Edit sesuai kebutuhan

# 6. Run migrations & start PM2
cd build
npx knex migrate:latest --env production
pm2 start server.js --name laju
pm2 save
pm2 startup
```

### Auto Deploy dengan GitHub Actions

Setelah setup pertama, gunakan GitHub Actions untuk auto-deploy. Setiap push ke `main` akan otomatis deploy.

1. Copy workflow: `cp -r github-workflow-sample/workflows .github/`
2. Setup GitHub Secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`
3. Push ke GitHub - deployment otomatis!

Panduan lengkap: [docs/07-GITHUB-ACTIONS-DEPLOY.md](docs/07-GITHUB-ACTIONS-DEPLOY.md)

### PM2 Commands

```bash
pm2 logs laju        # View logs
pm2 restart laju     # Restart application
pm2 stop laju        # Stop application
pm2 status           # View status
pm2 save             # Save PM2 configuration
pm2 startup          # Setup PM2 to start on system boot
```

## Absolute Imports

You can import from the project root without `./`:

- Server/dev with ts-node:
  - `import DB from "app/services/DB";`
  - `import DB from "app/services/DB.ts";` (extension supported in dev)
- Config:
  - `tsconfig.json` sets `"baseUrl": "."` and `paths` for root folders
  - Nodemon uses `ts-node -r tsconfig-paths/register` to resolve aliases at runtime
- Notes:
  - Prefer imports without the `.ts` extension for compatibility with production builds.
  - If you run compiled JS from `build/`, keep using alias imports without extensions or use tools like `tsc-alias` to rewrite paths.

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


## Tutorial: S3 Upload (Presigned URL)

Priority approach in Laju: generate a pre-signed URL on the server, then perform direct upload from browser/client to that URL using `PUT` method. This reduces server load while maintaining security.

### Prerequisites
- Set up Wasabi/S3 credentials in `.env` (see `.env.example`):
  - `WASABI_ACCESS_KEY`, `WASABI_SECRET_KEY`
  - `WASABI_BUCKET` (default: `laju-dev`)
  - `WASABI_REGION` (example: `ap-southeast-1`)
  - `WASABI_ENDPOINT` (example: `https://s3.ap-southeast-1.wasabisys.com`)
  - `CDN_URL` (optional; if using CDN like Bunny, public URL will point to CDN)
- Ensure bucket policy/public access is configured if you want files to be accessible via `publicUrl` (or use CDN in front of bucket).

### Server Endpoint (Signed URL)
- Path: `POST /api/s3/signed-url` (protected by Auth middleware)
- Body:
  ```json
  {
    "filename": "1699999999999-photo.jpg",
    "contentType": "image/jpeg"
  }
  ```
- Response example:
  ```json
  {
    "success": true,
    "data": {
      "signedUrl": "https://...presigned-url...",
      "publicUrl": "https://cdn-or-endpoint/bucket/assets/1699999999999-photo.jpg",
      "fileKey": "assets/1699999999999-photo.jpg",
      "bucket": "laju-dev",
      "expiresIn": 3600
    }
  }
  ```
 

### Upload Flow from Browser
Vanilla JavaScript example:
```js
async function uploadToS3(file) {
  const filename = `${Date.now()}-${file.name}`;
  const payload = { filename, contentType: file.type };

  // 1) Request signed URL from server (requires session cookie, use credentials)
  const res = await fetch('/api/s3/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to get signed URL');
  const { data } = await res.json();

  // 2) Upload directly to S3/Wasabi via PUT
  const put = await fetch(data.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });
  if (!put.ok) throw new Error('Upload failed'); // usually 200 OK

  // 3) Use publicUrl (save to DB or display)
  return { publicUrl: data.publicUrl, fileKey: data.fileKey, bucket: data.bucket };
}
```

Svelte (Inertia) example:
```svelte
<script>
  async function handleFile(file) {
    if (!file) return;
    try {
      const { publicUrl } = await uploadToS3(file);
      // TODO: save publicUrl to server/DB as needed
      console.log('Uploaded:', publicUrl);
    } catch (e) {
      alert(e.message);
    }
  }
</script>

<input type="file" on:change={(e) => handleFile(e.target.files?.[0])} />
```

### Getting Public URL from FileKey
If you store the `fileKey`, you can request the public URL from server:
- Path: `GET /api/s3/public-url/:fileKey`
- Example: `GET /api/s3/public-url/assets/1699999999999-photo.jpg`

### Health Check
- Path: `GET /api/s3/health`
- Returns bucket, endpoint, and region info for configuration verification.

### Important Notes
- `expiresIn` for signed URL defaults to 3600 seconds (1 hour).
- Upload via signed URL does not set ACL in the request; ensure your bucket/CDN allows public read access if you want direct access.
- `publicUrl` is built from `CDN_URL` (if set) or directly from `WASABI_ENDPOINT` + `bucket` + `key`.



## Backup & Restore Database

Documentation for three utility scripts:
- `backup.ts` — creates SQLite backup, compresses with Gzip, encrypts with AES-256-GCM, uploads to Wasabi/S3, and saves metadata to `backup_files` table.
- `restore.ts` — downloads encrypted backup from S3, decrypts with `BACKUP_ENCRYPTION_KEY`, decompresses Gzip, then writes the restored `.db` file.
- `clean-backup.ts` — removes old backups from S3 based on retention policy and marks metadata as `deleted_at`.

### Prerequisites
- Wasabi/S3 credentials must be configured in `.env` (see S3 Upload section or `.env.example`).
- `BACKUP_ENCRYPTION_KEY` must be 32 bytes (base64/hex/utf8). Examples:
  - Base64: `BACKUP_ENCRYPTION_KEY=3q2+7wAAAAAAAAAAAAAAAAAAAA==`
  - Hex: `BACKUP_ENCRYPTION_KEY=00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff`
- Optional: `BACKUP_RETENTION_DAYS` (default 30 days) for `clean-backup.ts`.
- `backup_files` table must exist (example schema below).

### Usage
1) Build first so scripts are ready to run as JS:
```bash
npm run build
```

2) Run backup:
```bash
node build/backup.js
```
- Local output files are stored in `build/backups/` temporarily; after upload, local files are cleaned up.
- Metadata saved: `key`, `file_name`, `file_size`, `compression`, `storage`, `checksum`, `uploaded_at`, `encryption`, `enc_iv`, `enc_tag`.

3) Restore (fetch latest non-deleted backup):
```bash
node build/restore.js
```
Or restore by specific `key`:
```bash
node build/restore.js --key backups/2025-01-10T23:33-<uuid>.db.gz.enc
```
- Restored file will be written to: `build/backups/restored-YYYY-MM-DDTHH:mm.db`.
- To activate restore: stop the application and replace the active SQLite file with the restored file.
- If DB is inaccessible during restore, the script will read `iv/tag` from S3 object metadata.

4) Clean backup (remove older than retention):
```bash
node build/clean-backup.js
```
- Marks `deleted_at` column in `backup_files` and deletes objects from S3 if present.

### Cron Examples
- Daily backup at 01:00:
```
0 1 * * * cd /path/to/app/build && node backup.js >> /var/log/laju-backup.log 2>&1
```
- Weekly cleanup on Sunday at 02:00:
```
0 2 * * 0 cd /path/to/app/build && node clean-backup.js >> /var/log/laju-clean-backup.log 2>&1
```

### `backup_files` Table Schema (Knex)
Example migration to create backup metadata table:
```ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("backup_files", (table) => {
    table.string("id").primary(); // uuid
    table.string("key").notNullable().unique(); // S3 path, e.g. backups/<file>.db.gz.enc
    table.string("file_name").notNullable();
    table.bigInteger("file_size").notNullable();
    table.string("compression").notNullable(); // 'gzip'
    table.string("storage").notNullable(); // 's3'
    table.string("checksum").notNullable(); // md5 hex
    table.bigInteger("uploaded_at").notNullable();
    table.bigInteger("deleted_at").nullable();
    table.string("encryption").notNullable(); // 'aes-256-gcm'
    table.string("enc_iv").notNullable(); // base64
    table.string("enc_tag").notNullable(); // base64
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("backup_files");
}
```

### Notes
- Encryption key must be consistent between backup and restore.
- S3 metadata stores `iv`/`tag` so restore is still possible if DB is temporarily inaccessible.
- Ensure S3 bucket/endpoint policy (Wasabi) is properly configured, including upload size limits and custom metadata.


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

## AI-Driven Development: 100% No-Code Workflow

You can build complete Laju applications using AI coding assistants without writing any code manually. This approach leverages AI editors to handle all implementation details while you focus on requirements and architecture.

### Recommended AI Editors

- **Windsurf** - `https://codeium.com/windsurf`
- **Trae.ai** - `https://trae.ai`
- **Cursor** - `https://cursor.sh`

### Step-by-Step Workflow

#### 1. Initialize Your Project

Start with the Laju scaffolding:

```bash
npx create-laju-app project-name
cd project-name
```

#### 2. Clear and Rebuild README

Delete all existing content from `README.md` and start fresh. In your AI editor's prompt, describe your project in detail:

- What problem does it solve?
- Who are the target users?
- What are the core features? 
- What are the user flows?
- What integrations are needed?
- What are the technical requirements?

**Example prompt:**
```
Write new README.md base on this project description:

I want to build a task management application for small teams.

Target users: 5-20 person teams who need simple project tracking

Project name: TaskEase

Core features: 
- Create/edit/delete projects
- Add tasks to projects with status (todo, in-progress, done)
- Assign tasks to team members
- Real-time notifications
- File attachments for tasks (S3/Wasabi)
- Activity timeline
 
Technical requirements:
- Mobile-responsive UI
- Email notifications for task assignments
- Export projects to PDF
- Dark mode support
```

Continue iterating with the AI until your `README.md` captures all requirements, architecture decisions, and technical specifications. Get AI approval on the complete concept before proceeding.

#### 3. Generate TODOLIST

Once your `README.md` is finalized, ask the AI to create a `TODOLIST.md` based on the requirements:

**Example prompt:**
```
Based on @README.md, create a TODOLIST.md file focusing on the tasks required to build the migrations and pages for this project. Update the progress in TODOLIST.md after completing each task.

Notes:
> **Branding Color**: Orange
> **Theme Support**: Dark Mode & Light Mode
> **Mobile-First**: All pages must be responsive and optimized for mobile devices
```

The AI will generate a structured task list like:

```markdown
# TODOLIST - Laju Task Management Application

> **Branding Color**: Orange (#f97316, #ea580c, #c2410c)
> **Theme Support**: Dark Mode & Light Mode
> **Mobile-First**: All pages must be responsive and optimized for mobile devices

 
## Phase 1: Database Setup

- [ ] Create `projects` table migration
  - id (primary key)
  - name (string, not null)
  - description (text, nullable)
  - color (string, default orange)
  - owner_id (foreign key to users)
  - created_at (timestamp)
  - updated_at (timestamp) 

- [ ] Run all migrations
 
  npx knex migrate:latest
 

## Phase 2: Backend - Controllers

- [ ] Create `ProjectController.ts`
  - index() - list all projects for authenticated user
  - show(id) - get single project with tasks and members
  - store() - create new project
  - update(id) - update project details
  - destroy(id) - delete project
  - addMember(projectId, userId) - add team member to project
  - removeMember(projectId, userId) - remove team member
  - exportPDF(id) - generate PDF report 

## Phase 3: Backend - Services
 

## Phase 4: Backend - Routes

- [ ] Add project routes in `routes/web.ts` 

## Phase 5: Frontend - Theme & Global Styles

- [ ] Configure TailwindCSS with orange as primary color
  - Update `tailwind.config.js`
  - Add orange color palette (#f97316, #ea580c, #c2410c)
  - Configure dark mode class strategy 

## Phase 6: Frontend - Reusable Components

- [ ] Create `ThemeToggle.svelte`
  - Toggle button with sun/moon icon
  - Switch between light/dark mode
  - Save preference to localStorage
  - Smooth transition animation 

## Phase 7: Frontend - Project Components

- [ ] Create `ProjectCard.svelte`
  - Display project name, description, color
  - Show task count and progress bar
  - Team member avatars
  - Actions menu (edit, delete, export)
  - Mobile-responsive card layout
  - Dark mode support
  - Orange accents 

## Phase 12: Frontend - Pages

- [ ] Create `resources/js/Pages/projects/index.svelte`
  - List all projects in grid layout
  - Search projects by name
  - Filter by status/members
  - Sort options
  - Create new project button (opens modal)
  - Empty state when no projects
  - Mobile: Stack cards vertically
  - Dark mode support
  - Orange accents 

## Phase 21: Performance Optimization

- [ ] Optimize frontend bundle
  - Code splitting by route
  - Lazy load components
  - Optimize images 

## Phase 22: Accessibility

- [ ] Keyboard navigation
  - Tab through interactive elements
  - Enter/Space to activate buttons
  - Escape to close modals
  - Arrow keys for dropdowns 

## Phase 23: Testing

- [ ] Test all CRUD operations
  - Create, read, update, delete projects
  - Create, read, update, delete tasks
  - Add/edit/delete comments
  - Upload/delete attachments
  - Add/remove project members 

## Phase 24: Documentation

- [ ] Update README.md
  - Add screenshots
  - Update installation steps
  - Document environment variables
  - Add troubleshooting section 

---

## Progress Tracking

**Total Tasks**: 200+
**Completed**: 0
**In Progress**: 0
**Remaining**: 200+

**Current Phase**: Phase 1 - Database Setup

---

## Notes

- Work through tasks sequentially, one at a time
- Test each feature after implementation
- Mark tasks as `[x]` when completed
- Add new tasks as requirements evolve
- Keep README.md updated with decisions
- Commit frequently with meaningful messages
- Focus on mobile-first responsive design
- Ensure dark mode support for all components
- Use orange (#f97316) as primary branding color
- Prioritize user experience and accessibility

---

**Last Updated**: 2025-01-08

```

#### 4. Execute Tasks One by One

Work through the `TODOLIST.md` sequentially. For each task:

1. **Copy the task** from the list
2. **Paste it into the AI prompt** and ask the AI to implement it
3. **Review the changes** the AI makes
4. **Test the implementation** (run dev server, check functionality)
5. **Ask the AI to update** `TODOLIST.md` by marking the task as done (changing `[ ]` to `[x]`) to track progress

**Example prompts:**
```
Based on TODOLIST.md, what should we work on now?
```

Or be more direct:
```
Implement the user registration feature with email verification. After done, update TODOLIST.md.
```

The AI will implement the task and update the progress in `TODOLIST.md`.

#### 5. Iterate and Refine

As you complete tasks:
- Ask the AI to fix bugs or adjust implementations
- Request code improvements or refactoring
- Add new tasks to `TODOLIST.md` as requirements evolve
- Update `README.md` with new decisions or changes

### Tips for Effective AI-Driven Development

- **Be specific**: The more detailed your requirements, the better the AI output
- **One task at a time**: Don't overwhelm the AI with multiple complex tasks
- **Review everything**: Always understand what the AI generates before approving
- **Use the framework**: Leverage Laju's conventions (controllers, Inertia pages, migrations)
- **Test frequently**: Run `npm run dev` and test after each major change
- **Version control**: Commit after completing each task or feature
- **Ask questions**: If the AI's implementation is unclear, ask for explanations


## Author

**Maulana Shalihin** - Full Stack Developer

With over 15 years of experience in software development, I specialize in building modern SaaS applications and scalable web platforms. My work includes:

- **[tapsite.ai](https://tapsite.ai)** - AI-powered website builder
- **[dripsender.id](https://dripsender.id)** - Email marketing automation platform
- **[Laju.dev](https://laju.dev)** - Modern full-stack TypeScript framework
- **[antre.in](https://antre.in)** - Link in bio untuk antrean yang rapi
- **[slugpost.com](https://slugpost.com)** - Open Source app untuk Publish & Share Markdown Instantly
- **[klikaja.app](https://klikaja.app)** - Smart Link Shortener

### Need Help Building Your Application?

I'm available for consulting and custom development projects. Whether you need:
- 🚀 SaaS application development
- 💼 Full-stack web applications
- 🔧 API development and integration
- 📱 Modern responsive interfaces
- ⚡ Performance optimization

Feel free to reach out at **maulana@drip.id**

### Support This Project

If you find Laju useful, consider supporting its development:

- ⭐ **Star this repository** on GitHub
- 💖 **[Become a Sponsor](https://github.com/sponsors/maulanashalihin)** - Support ongoing development and maintenance
- 🐛 **Report bugs** and suggest features
- 🔧 **Contribute code** via Pull Requests

Your support helps keep this project free and actively maintained!

### Feedback & Contributions

I'm very open to feedback! If you have suggestions, bug reports, or feature requests, feel free to:
- Open an issue on [GitHub](https://github.com/maulanashalihin/laju/issues)
- Or contribute directly via Pull Request

## Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for high-performance TypeScript frameworks
- Thanks to all open-source contributors and the community

## Support

If you have any questions or need help, please:
- Open an issue on [GitHub](https://github.com/maulanashalihin/laju/issues)
- Star the repository if you find it useful ⭐
- Share it with others who might benefit from it

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details
