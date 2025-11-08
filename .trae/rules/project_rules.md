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
- [HyperExpress](https://github.com/kartikk221/hyper-express) - High-performance web server
- [Knex](https://knexjs.org) - SQL query builder
- [BetterSQLite3](https://github.com/WiseLibs/better-sqlite3) - Database
- [Nodemailer](https://nodemailer.com/) - Email sending
- [Redis](https://redis.io/) - Caching (optional)
- [Squirrelly](https://squirrelly.js.org/) - Fast template engine

### Frontend
- [Svelte 5](https://svelte.dev) - UI framework
- [Inertia.js](https://inertiajs.com) - Client-server communication
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [Vite](https://vitejs.dev) - Build tool and dev server
 
## Project Structure

- `/app` - Core application files
  - `/middlewares` - Custom middleware functions
  - `/services` - Service layer implementations
  - `/controllers` - Application controllers
- `/resources` - Frontend resources
  - `/views` - Template HTML menggunakan Squirrelly
    - `/Users/maulanashalihin/Project/laju/resources/views/index.html`
    - `/Users/maulanashalihin/Project/laju/resources/views/inertia.html`
  - `/js` - JavaScript assets and modules
    - `Pages/` - Halaman Svelte/Inertia
    - `Components/` - Komponen UI reusable
    - `app.js` - Entry point aplikasi (Inertia/Svelte via Vite)
    - `index.css` - Styles utama (TailwindCSS)
- `/routes` - Route definitions
- `/commands` - Custom CLI commands
- `/migrations` - Database migrations
- `/public` - Static files
- `/dist` - Compiled assets (generated)
- `/build` - Production build output

 

## Development Commands

bash
# Start development server
npm run dev

# Build for production
npm run build

# Run database migrations
npx knex migrate:latest
 

## Best Practices

1. Menggunakan arsitektur MVC untuk organisasi kode
2. Pemisahan concerns antara controllers dan services
3. Type safety dengan TypeScript
4. Modern frontend dengan Svelte dan Tailwind
5. Database migrations untuk version control schema
6. Environment configuration (.env)
7. Gunakan Squirrelly sebagai template engine untuk server side rendering HTML

 
## Controller & Routes Concept 

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

  public async edit(request: Request, response: Response) {
     
  }

  public async update(request: Request, response: Response) {
     
  }

  public async destroy(request: Request, response: Response) {
     
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

