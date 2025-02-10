# Laju

A high-performance TypeScript web framework combining HyperExpress, Svelte 5, and Inertia.js for building modern full-stack applications. Features server-side rendering, real-time capabilities, and seamless client-server state management.

Visit [laju.dev](https://laju.dev)

## Features

- Fast server-side rendering with HyperExpress
- Modern frontend with Svelte 5
- TypeScript support for better type safety
- Inertia.js integration for seamless client-server communication
- Built-in authentication system
- BetterSQLite3 database with Knex query builder
- Email support with Nodemailer
- Google APIs integration
- Redis caching support
- Asset bundling with Vite
- TailwindCSS for styling

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Redis server (optional, for caching)
- Docker & Docker Compose (optional, for development with container)

## Installation

### Menggunakan Docker (Direkomendasikan)

1. Pastikan Docker dan Docker Compose sudah terinstall
2. Clone repository
3. Jalankan dengan Docker Compose:
```bash
docker-compose up -d
```

Aplikasi akan berjalan di:
- Frontend (Vite): http://localhost:5173
- Backend: http://localhost:5555

### Quick Start (Tanpa Docker)
```bash
npx create-laju-app project-name
cd project-name
npm run dev
```

### Manual Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

4. Set up Google OAuth credentials:
   1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project or select an existing one
   3. Enable the Google+ API and Google OAuth2 API
   4. Go to "Credentials" in the left sidebar
   5. Click "Create Credentials" and select "OAuth client ID"
   6. Select "Web application" as the application type
   7. Set the following:
      - Name: Your application name
      - Authorized JavaScript origins: `http://localhost:5555` (for development)
      - Authorized redirect URIs: `http://localhost:5555/google/callback`
   8. Click "Create"
   9. Copy the generated Client ID and Client Secret
   10. Add them to your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

5. Run database migrations:
```bash
npx knex migrate:latest
```

## Development

### Menggunakan Docker

Untuk memulai server development dengan Docker:

```bash
docker-compose up -d
```

Untuk melihat log:
```bash
docker-compose logs -f
```

Untuk menghentikan container:
```bash
docker-compose down
```

### Tanpa Docker

To start the development server:

```bash
npm run dev
```

This will:
- Start the Vite development server for frontend assets
- Run the backend server with nodemon for auto-reloading

## Building for Production

### Build dengan Docker

1. Edit Dockerfile, uncomment baris terakhir untuk menggunakan mode production:
```dockerfile
# CMD [ "npm", "run", "dev", "--", "--host"] ]
CMD [ "pm2-runtime", "start", "./build/server.js" ]
```

2. Build dan jalankan container:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Build tanpa Docker

To build the application for production:

```bash
npm run build
```

This command will:
- Clean the build directory
- Build frontend assets with Vite
- Compile TypeScript files
- Copy necessary files to the build directory

## Project Structure

- `/app` - Core application files
  - `/middlewares` - Custom middleware functions
  - `/services` - Service layer implementations
  - `/controllers` - Application controllers
- `/resources` - Frontend resources
  - `/views` - Svelte components and views
  - `/js` - JavaScript assets and modules
- `/routes` - Route definitions
- `/commands` - Custom CLI commands
- `/migrations` - Database migrations
- `/public` - Static files
- `/dist` - Compiled assets (generated)
- `/build` - Production build output

## Key Dependencies

### Backend
- HyperExpress - High-performance web server
- Knex - SQL query builder
- BetterSQLite3 - Database
- Nodemailer - Email sending
- Redis - Caching (optional)

### Frontend
- Svelte 5 - UI framework
- Inertia.js - Client-server communication
- TailwindCSS - Utility-first CSS framework
- Vite - Build tool and dev server

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production 

## CLI Commands

### Create Controller
```bash
node laju make:controller ControllerName
```
This will create a new controller in `app/controllers` with basic CRUD methods.

Example:
```bash
node laju make:controller UserController
```

### Create Command
```bash
node laju make:command CommandName
```
This will create a new command in `commands` that can be scheduled with cron jobs.

Example:
```bash
node laju make:command SendDailyEmails
```

To schedule the command with cron, add it to your crontab:
```bash
# Run command every day at midnight
0 0 * * * cd /path/to/your/app/build && node commands/SendDailyEmails.js
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License

## Tutorial: Building Your First App

This tutorial will guide you through building a simple application using this framework.

### 1. Setting Up a New Route and Controller

First, let's create a new route and controller for a blog post feature.

1. Create a new controller file `app/controllers/PostController.ts`:

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

2. Add routes in `routes/web.ts`:

```typescript
import PostController from "../app/controllers/PostController";

// Add these routes with your existing routes
Route.get("/posts", PostController.index);
Route.get("/posts/create", PostController.create);
Route.post("/posts", PostController.store);
```

### 2. Creating the Database Migration

Create a migration for the posts table:

```bash
npx knex migrate:make create_posts_table
```

In the generated migration file:

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

### 3. Creating Svelte Components

1. Create `resources/views/posts/index.svelte`:

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

2. Create `resources/views/posts/create.svelte`:

```svelte
<script>
  import { router } from '@inertiajs/svelte';

  let form = {
    title: '',
    content: ''
  };

  function handleSubmit() {
    router.post('/posts', form);
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Create New Post</h1>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Title</label>
      <input
        type="text"
        bind:value={form.title}
        class="w-full px-3 py-2 border rounded"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Content</label>
      <textarea
        bind:value={form.content}
        class="w-full px-3 py-2 border rounded h-32"
      ></textarea>
    </div>

    <div>
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Post
      </button>
    </div>
  </form>
</div>
```

### 4. Testing Your Application

1. Start the development server:
```bash
npm run dev
```

2. Visit `http://localhost:5555/posts` in your browser
3. Try creating a new post using the form
4. View the list of posts on the index page

### Key Concepts

1. **Routing**: Routes are defined in `routes/web.ts` using the HyperExpress router
2. **Controllers**: Handle business logic and return Inertia responses
3. **Database**: Use Knex.js for database operations and migrations
4. **Frontend**: Svelte components with Inertia.js for seamless page transitions
5. **Styling**: TailwindCSS for utility-first styling

### Best Practices

1. **File Organization**
   - Keep controllers in `app/controllers`
   - Create inertia pages in `resources/js/Pages`
   - Place Svelte components in `resources/js/Components`
   - Database migrations in `migrations`

2. **Code Structure**
   - Use TypeScript types for better type safety
   - Keep controllers focused on single responsibilities
   - Use Inertia.js for state management between server and client

3. **Database**
   - Always use migrations for database changes
   - Use the Query Builder for complex queries
   - Include timestamps for tracking record changes

Need help with anything specific? Feel free to ask!
