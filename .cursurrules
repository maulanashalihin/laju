<frontend_generation_rules>
1. Design Principles:
   - Prioritize unique and creative UI/UX solutions 
   - Support experimental CSS features and animations
   - Encourage use of creative micro-interactions
   - Focus on custom-built components over standard libraries 

2. Technology Stack Flexibility:
   - Prioritize using tailwindcss
   - Using Svelte Framework 
   - Incorporate CSS-in-JS solutions 
 

3. Styling Approach:
   - Prefer custom design systems
   - Support modern CSS features (Container Queries, CSS Grid, etc)
   - Enable creative responsive design patterns
   - Support advanced theming systems
   - Encourage CSS art and creative visuals
</frontend_generation_rules>
 

# Studio Project Guide

## Tech Stack Overview

### Backend
- *Runtime*: Node.js dengan TypeScript
- *Web Server*: HyperExpress
- *Database*: SQLite dengan Knex.js (migrations)
- *Caching*: Redis (ioredis)

### Frontend
- *Framework*: Svelte 5 (beta)
- *Styling*: Tailwind CSS
- *State Management*: Inertia.js
- *Build Tool*: Vite

## Project Structure


studio/
├── app/                    # Core application code
│   ├── controllers/        # Request handlers
│   ├── middlewares/       # Authentication & validation
│   └── services/          # Business logic
├── resources/             # Frontend resources
├── routes/                # Route definitions
├── migrations/            # Database migrations
├── public/               # Static assets
└── build/, dist/         # Compiled output


## Key Dependencies

### Production
- @inertiajs/svelte: Frontend-backend integration
- hyper-express: High-performance web server
- better-sqlite3: SQLite database driver
- bcrypt: Password hashing
- nodemailer: Email functionality
- googleapis: Google API integration
- dayjs: Date manipulation
- squirrelly: Template engine

### Development
- typescript: Type safety
- vite: Build tooling
- tailwindcss: Utility-first CSS
- nodemon: Development server
- ts-node: TypeScript execution

## Development Commands

bash
# Start development server
npm run dev

# Build for production
npm run build


## Project Features

1. Full-stack TypeScript support
2. Server-side rendering capabilities
3. Real-time features support
4. Modern component-based UI with Svelte
5. Robust database migrations
6. Integrated caching system
7. Email functionality
8. Google API integration
9. Secure authentication system

## Best Practices

1. Menggunakan arsitektur MVC untuk organisasi kode
2. Pemisahan concerns antara controllers dan services
3. Type safety dengan TypeScript
4. Modern frontend dengan Svelte dan Tailwind
5. Database migrations untuk version control schema
6. Environment configuration (.env)


## Controller Sample

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

## Svelte Component and form Sample Page

```svelte
<script>
  import { router } from '@inertiajs/svelte';

  let form = {
    email : '',
    password: ''
  };

  function submitForm() {
    router.post('/login', form);
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Login</h1>

   
                <form class="space-y-4 md:space-y-6" on:submit|preventDefault={submitForm}>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input bind:value={form.email} required type="text" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="maulanaibrahim@gmail.com" >
                     
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input bind:value={form.password} required type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" >
                    </div>  
                    <div class="flex items-center justify-end">
                        <a href="/forgot-password" use:inertia class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">Lupa Password?</a>
                    </div>
                    <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Belum punya akun?   <a href="/register" use:inertia class="font-medium text-blue-600 hover:underline dark:text-blue-400">Buat disini</a>
                    </p>
                    
                </form>
</div>
```

Standar input form class
```html  <input bind:value={form.email} required type="text" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-blue-600 focus:outline-none block w-full py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="maulanaibrahim@gmail.com" >```
