# Laju Framework Documentation

Complete documentation for the Laju high-performance TypeScript web framework.

## Documentation Index

### Getting Started

1. **[Introduction](01-INTRODUCTION.md)** - Framework overview, tech stack, quick start
2. **[Project Structure](02-PROJECT-STRUCTURE.md)** - Directory layout, conventions, imports
3. **[Backend Services](03-BACKEND-SERVICES.md)** - Overview of all services
   - **[Database Guide](03a-DATABASE.md)** - Knex.js, Native SQLite, Migrations
   - **[Authentication Guide](03b-AUTHENTICATION.md)** - Auth, Sessions, OAuth
   - **[Storage & Email Guide](03c-STORAGE-EMAIL.md)** - S3, Email, Templates
4. **[API Reference](04-API-REFERENCE.md)** - Request/Response types, middleware

### Deployment & Best Practices

5. **[Deployment Guide](05-DEPLOYMENT.md)** - Production build, server setup, PM2
6. **[Best Practices](06-BEST-PRACTICES.md)** - Code organization, patterns
   - **[Security Guide](06a-SECURITY.md)** - Authentication, Validation, XSS, CSRF
   - **[Performance Guide](06b-PERFORMANCE.md)** - Database, Caching, Optimization
7. **[GitHub Actions Deploy](07-GITHUB-ACTIONS-DEPLOY.md)** - Auto deploy setup

### Tutorials & Guides

8. **[Tutorials](08-TUTORIALS.md)** - CRUD, File Upload, Protected Routes, CLI
9. **[S3 Storage](09-S3-STORAGE.md)** - File uploads with presigned URLs
10. **[Backup & Restore](10-BACKUP-RESTORE.md)** - Database backup automation
11. **[AI Development](11-AI-DEVELOPMENT.md)** - Build apps with AI assistants

### Advanced Topics

12. **[Testing Guide](12-TESTING.md)** - Unit tests, Integration tests, Vitest
13. **[Svelte 5 Patterns](13-SVELTE5-PATTERNS.md)** - Runes, State, Forms, Inertia
14. **[Squirrelly Templates](14-SQUIRRELLY.md)** - SSR, Partials, Filters, Helpers

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
