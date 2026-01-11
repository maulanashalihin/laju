# Laju Framework Documentation

Complete documentation for the Laju high-performance TypeScript web framework.

## Documentation Index

### Getting Started

1. **[Introduction](01-INTRODUCTION.md)** - Framework overview, tech stack, quick start
2. **[Project Structure](02-PROJECT-STRUCTURE.md)** - Directory layout, conventions, imports

### Core Services

3. **[Database Guide](03-DATABASE.md)** - Knex.js, Native SQLite, Migrations, Performance
4. **[Authentication Guide](04-AUTHENTICATION.md)** - Auth, Sessions, OAuth, Password Reset
5. **[Storage Guide](05-STORAGE.md)** - S3, Presigned URLs, File Uploads
6. **[Email Guide](06-EMAIL.md)** - Nodemailer, Resend, Email Templates
7. **[API Reference](07-API-REFERENCE.md)** - Request/Response types, middleware

### Deployment & Best Practices

8. **[Deployment Guide](08-DEPLOYMENT.md)** - Production build, server setup, PM2
9. **[Best Practices](09-BEST-PRACTICES.md)** - Code organization, patterns
   - **[Security Guide](09a-SECURITY.md)** - Authentication, Validation, XSS, CSRF
   - **[Performance Guide](09b-PERFORMANCE.md)** - Database, Caching, Optimization
10. **[GitHub Actions](10-GITHUB-ACTIONS.md)** - Auto deploy setup

### Tutorials & Guides

11. **[Tutorials](11-TUTORIALS.md)** - CRUD, File Upload, Protected Routes, CLI
12. **[Backup & Restore](12-BACKUP-RESTORE.md)** - Database backup automation
13. **[AI Development](13-AI-DEVELOPMENT.md)** - Build apps with AI assistants

### Advanced Topics

14. **[Testing Guide](14-TESTING.md)** - Unit tests, Integration tests, Vitest
15. **[Svelte 5 Patterns](15-SVELTE5-PATTERNS.md)** - Runes, State, Forms, Inertia
16. **[Squirrelly Templates](16-SQUIRRELLY.md)** - SSR, Partials, Filters, Helpers
17. **[Caching Guide](17-CACHING.md)** - Database Cache vs Redis, Strategies

## Quick Start

```bash
npx create-laju-app my-project
cd my-project
npm install
cp .env.example .env
npx knex migrate:latest
npm run dev
```

Visit `http://localhost:5555`

## Quick Reference

### Create Feature

```bash
npx knex migrate:make create_posts_table  # Migration
node laju make:controller PostController   # Controller
# Create: resources/js/Pages/posts/index.svelte
```

### Database

```typescript
// Knex.js
const posts = await DB.from("posts");

// Native SQLite (faster reads)
const post = SQLite.get("SELECT * FROM posts WHERE id = ?", [id]);
```

### Authentication

```typescript
const hashed = await Authenticate.hash(password);
const valid = await Authenticate.compare(password, hashed);
await Authenticate.process(user, request, response);
```

## Resources

- **Website:** [laju.dev](https://laju.dev)
- **GitHub:** [github.com/maulanashalihin/laju](https://github.com/maulanashalihin/laju)
- **NPM:** [create-laju-app](https://www.npmjs.com/package/create-laju-app)

---

**Built with ❤️ by [Maulana Shalihin](https://github.com/maulanashalihin)**
