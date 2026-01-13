# Laju Framework - Global Rules

## Tech Stack
- **Backend**: HyperExpress, Knex, BetterSQLite3 (WAL mode), Eta
- **Frontend**: Svelte 5 (runes), Inertia.js, TailwindCSS 4, Vite

## Architecture Overview

Controllers → Services → Database
Middlewares intercept requests before Controllers

## Critical References

- **Routing**: See `routes/AGENTS.md` (middleware arrays, catch-all order)
- **Middleware Pattern**: See `app/middlewares/AGENTS.md` (NO `next()`!)
- **Controller Pattern**: See `app/controllers/AGENTS.md` (NO `this`!)
- **Database Operations**: See `app/services/AGENTS.md` (Knex vs Native SQLite)
- **Migrations**: See `migrations/AGENTS.md`

## Cross-Cutting Concerns

### Security
- Always validate input before processing
- Use parameterized queries only
- Apply rate limiting to auth/API routes

### Authentication
- Use `Authenticate.hash()` / `Authenticate.compare()` for passwords
- Check `request.user` in protected routes

### SSR vs Inertia
- **Eta SSR**: Landing pages, SEO, emails
- **Inertia + Svelte**: Dashboard, interactive apps
 

## Frontend Guidelines
- TailwindCSS v4, Svelte 5 (runes), CSS-in-JS
- Custom components over libraries, creative UI/UX
- Modern CSS (Container Queries, Grid), focus:outline-none
- Minimal emoji usage
