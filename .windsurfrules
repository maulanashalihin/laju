<frontend_generation_rules>
1. Design Principles:
   - Prioritize unique and creative UI/UX solutions 
   - Support experimental CSS features and animations
   - Encourage use of creative micro-interactions
   - Focus on custom-built components over standard libraries 

2. Technology Stack:
   - TailwindCSS v4 with Vite plugin
   - Svelte 5 Framework with runes
   - CSS-in-JS when needed

3. Styling Approach:
   - Prefer custom design systems
   - Support modern CSS features (Container Queries, CSS Grid, etc)
   - Enable creative responsive design patterns
   - Support advanced theming systems
   - Always use focus:outline-none on form inputs
   - Avoid/minimize emoji usage
</frontend_generation_rules>

# Laju Project Guide

## Tech Stack

### Backend
- **HyperExpress** - High-performance web server (11x faster than Express)
- **Knex** - SQL query builder (for complex queries)
- **BetterSQLite3** - Database with WAL mode
- **Squirrelly** - Fast template engine

### Frontend
- **Svelte 5** - UI framework with runes
- **Inertia.js** - SPA without client-side routing
- **TailwindCSS 4** - Utility-first CSS
- **Vite** - Build tool and dev server

## Project Structure

```
app/
├── controllers/     # Request handlers (split by domain)
├── middlewares/     # Auth, rate limiting
└── services/        # DB, Mailer, Storage

resources/
├── js/
│   ├── Pages/       # Svelte/Inertia pages
│   ├── Components/  # Reusable components
│   ├── app.js       # Entry point
│   └── index.css    # TailwindCSS
└── views/           # Squirrelly templates

routes/              # Route definitions
migrations/          # Database migrations
```

## Development Commands

```bash
npm run dev                    # Start development server
npm run build                  # Production build
npx knex migrate:latest        # Run migrations
npx knex migrate:make <name>   # Create migration
node laju make:controller Name # Generate controller
```

## Middleware Pattern (HyperExpress)

**IMPORTANT**: HyperExpress does NOT use `next()` like Express.js

```typescript
// Correct pattern - no next() needed
export default async (request: Request, response: Response) => {
   if (authenticated) {
      request.user = user;
      // No return = continue to handler
   } else {
      return response.redirect("/login"); // Return = stop here
   }
}
```

## Database Access

Use **DB (Knex)** for complex queries:
```typescript
const users = await DB.from("users").where("active", true).orderBy("name");
```

Use **SQLite (native)** for performance-critical reads:
```typescript
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]);
```

## Controller Pattern

```typescript
import { Request, Response } from "../../type";
import DB from "../services/DB";

class PostController {
  public async index(request: Request, response: Response) {
    const posts = await DB.from("posts");
    return response.inertia("posts/index", { posts });
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

  public async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await DB.from("posts").where("id", id).delete();
    return response.json({ success: true });
  }
}

export default new PostController();
```

## Routes

```typescript
import PostController from "../app/controllers/PostController";
import Auth from "../app/middlewares/auth";

Route.get("/posts", PostController.index);
Route.post("/posts", [Auth], PostController.store);
Route.delete("/posts/:id", [Auth], PostController.destroy);
```

## SSR with Squirrelly

For pure SSR pages (without Inertia/Svelte), use Squirrelly templates.

### Template Location
Templates are stored in `resources/views/` with `.html` extension.

### Template Syntax

```html
<!-- resources/views/landing.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <title>{{it.title}}</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <h1>{{it.heading}}</h1>
    
    <!-- Loop -->
    {{@each(it.items) => item}}
        <div class="item">{{item.name}}</div>
    {{/each}}
    
    <!-- Conditional -->
    {{@if(it.user)}}
        <p>Welcome, {{it.user.name}}</p>
    {{#else}}
        <a href="/login">Login</a>
    {{/if}}
    
    <!-- Include partial -->
    {{@include("partials/footer.html") /}}
</body>
</html>
```

### Controller for SSR

```typescript
import { Request, Response } from "../../type";
import { view } from "../services/View";
import DB from "../services/DB";

class LandingController {
  public async index(request: Request, response: Response) {
    const items = await DB.from("products").limit(10);
    
    const html = view("landing.html", {
      title: "Welcome",
      heading: "Our Products",
      items: items,
      user: request.user || null
    });
    
    return response.type("html").send(html);
  }
}

export default new LandingController();
```

### When to Use SSR vs Inertia

| Use Case | Approach |
|----------|----------|
| Landing pages, SEO-critical | **Squirrelly SSR** |
| Dashboard, interactive apps | **Inertia + Svelte** |
| Email templates | **Squirrelly** |
| Static pages | **Squirrelly SSR** |
