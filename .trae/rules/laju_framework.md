<frontend_generation_rules>
- TailwindCSS v4, Svelte 5 (runes), CSS-in-JS
- Custom components over libraries, creative UI/UX
- Modern CSS (Container Queries, Grid), focus:outline-none
- Minimal emoji usage
</frontend_generation_rules>

# Laju Framework - Complete Reference

## Tech Stack
- **Backend**: HyperExpress, Knex, BetterSQLite3 (WAL mode), Squirrelly, Redis (optional)
- **Frontend**: Svelte 5 (runes), Inertia.js, TailwindCSS 4, Vite

## CRITICAL: HyperExpress Middleware

**NO `next()` - Different from Express.js!**
- No return = continue to next handler
- `return response.xxx()` = stop execution

```typescript
export default async (request: Request, response: Response) => {
   if (!authenticated) return response.redirect("/login");
   request.user = user; // continues to handler
}
```

## Database

- **Knex**: complex queries, joins, transactions
- **Native SQLite**: simple reads (385% faster)

```typescript
const users = await DB.from("users").where("active", true); // Knex
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]); // Native
```

## Svelte 5 Runes

```svelte
let count = $state(0);                    // State
let total = $derived(a + b);              // Computed
let { title } = $props();                 // Props
let { value = $bindable('') } = $props(); // Two-way binding
$effect(() => { /* side effects */ });    // Effects
```

## Security

- **Input validation**: Always validate before processing
- **SQL**: Use parameterized queries only (`?` placeholders)
- **Password**: `Authenticate.hash()` / `Authenticate.compare()`
- **Rate limiting**: Apply to auth/API routes

## Error Handling

Always wrap in try-catch, validate input, return appropriate status codes.

## SSR vs Inertia

- **Squirrelly SSR**: Landing pages, SEO, emails
- **Inertia + Svelte**: Dashboard, interactive apps

**Squirrelly**: NO `||` operator! Use ternary `? :` or set defaults in controller.

## Avoid

- `next()` in middleware → double execution
- SQL string concatenation → injection
- No input validation
- Knex for simple reads → use native SQLite
- Missing try-catch
- Not returning response in middleware