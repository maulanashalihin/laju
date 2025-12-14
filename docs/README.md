# Laju Framework Documentation

Complete documentation for the Laju high-performance TypeScript web framework.

## Documentation Index

### Getting Started

1. **[Introduction](01-INTRODUCTION.md)** - Framework overview, tech stack, quick start
2. **[Project Structure](02-PROJECT-STRUCTURE.md)** - Directory layout, conventions, imports
3. **[Backend Services](03-BACKEND-SERVICES.md)** - Database, Auth, Storage, Email, Cache
4. **[API Reference](04-API-REFERENCE.md)** - Request/Response types, middleware

### Deployment

5. **[Deployment Guide](05-DEPLOYMENT.md)** - Production build, server setup, PM2
6. **[Best Practices](06-BEST-PRACTICES.md)** - Code organization, security, performance
7. **[GitHub Actions Deploy](07-GITHUB-ACTIONS-DEPLOY.md)** - Auto deploy setup

### Tutorials & Guides

8. **[Tutorials](08-TUTORIALS.md)** - Build your first app, Squirrelly templates, CLI
9. **[S3 Storage](09-S3-STORAGE.md)** - File uploads with presigned URLs
10. **[Backup & Restore](10-BACKUP-RESTORE.md)** - Database backup automation
11. **[AI Development](11-AI-DEVELOPMENT.md)** - Build apps with AI assistants

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
