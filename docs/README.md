# Laju Framework Documentation

Complete documentation for the Laju high-performance TypeScript web framework.

**Organized for progressive learning from beginner to advanced topics.**

---

## 🚀 Choose Your Starting Point

<div align="center">

### 👉 **New to Laju?** [5-Minute Quick Start →](00-quickstart.md)

### 🤖 **Want AI to Code for You?** [AI Development Guide →](24-ai-development.md)

### 💻 **Prefer Manual Coding?** [Introduction →](01-introduction.md)

</div>

---

## 🎯 TL;DR — The Fastest Way to Start

```bash
# Create project
npx create-laju-app my-project && cd my-project

# Setup database
npm run migrate

# Start development
npm run dev
```

Visit `http://localhost:5555`

**Want AI to build everything?** Just mention `@workflow/INIT_AGENT.md` in your AI assistant! 🤖

---

## 📚 Learning Paths

### **Path A: AI-Assisted Development** (Beginner-Friendly)

Build apps by describing what you want. No coding required!

1. **[5-Minute Quick Start](00-quickstart.md)** — Get running in 5 minutes
2. **[AI Development](24-ai-development.md)** — Master AI workflows
3. **[Project Structure](02-project-structure.md)** — Understand the layout
4. **[Troubleshooting](99-troubleshooting.md)** — Fix common issues

### **Path B: Manual Development** (Full Control)

Write every line of code yourself.

#### **Phase 1: Getting Started** (01-03)

Start here if you're new to Laju. Learn the basics and set up your first project.

1. **[Introduction](01-introduction.md)** — Framework overview, tech stack, quick start
2. **[Project Structure](02-project-structure.md)** — Directory layout, conventions, imports
3. **[Database Guide](03-database.md)** — Kysely, Native SQLite, Migrations, Performance

#### **Phase 2: Core Features** (04-09)

Build your first features with routing, frontend, and authentication.

4. **[Routing & Controllers](04-routing-controllers.md)** — Routes, controllers, request/response
5. **[Frontend (Svelte 5)](05-frontend-svelte.md)** — Runes, State, Forms, Inertia.js
6. **[Authentication](06-authentication.md)** — Sessions, OAuth, Password Reset, Email Verification
7. **[Middleware](07-middleware.md)** — Auth, Rate limiting, Custom middleware, Patterns
8. **[Validation](08-validation.md)** — Zod schemas, Input validation, Type-safe forms
9. **[Email](09-email.md)** — Nodemailer, Resend, Email Templates

#### **Phase 3: Advanced Features** (10-15)

Add file uploads, caching, background jobs, and internationalization.

10. **[Storage (S3)](10-storage.md)** — S3/Wasabi, Presigned URLs, File Uploads
11. **[Caching](11-caching.md)** — Database Cache vs Redis, Strategies, Performance
12. **[Background Jobs](13-background-jobs.md)** — Cron jobs, Task scheduling, Commands
13. **[CSRF Protection](14-csrf.md)** — Token generation, Form protection, AJAX requests
14. **[Translation (i18n)](15-translation.md)** — Multi-language, Interpolation, Nested keys
15. **[Eta Templates](16-eta.md)** — SSR, Partials, Filters, Helpers

#### **Phase 4: Best Practices** (16-18)

Learn production-ready patterns, security, and performance optimization.

16. **[Best Practices](17-best-practices.md)** — Code organization, patterns, conventions
17. **[Security Guide](18-security.md)** — Authentication, Validation, XSS, CSRF, CSP, SQL Injection
18. **[Performance Guide](19-performance.md)** — Database, Caching, File Uploads, Monitoring

#### **Phase 5: Testing & Deployment** (19-22)

Test your application and deploy to production.

19. **[Testing Guide](20-testing.md)** — Unit tests, Integration tests, Vitest, Best practices
20. **[Deployment Guide](21-deployment.md)** — Production build, server setup, PM2, HTTPS
21. **[GitHub Actions](22-github-actions.md)** — CI/CD, Auto deploy, Testing automation
22. **[Backup & Restore](23-backup-restore.md)** — Database backup automation, S3 storage

#### **Phase 6: Advanced Topics** (23-26)

Deep dive into advanced features, API reference, and guides.

23. **[AI Development](24-ai-development.md)** — Build apps with AI assistants
24. **[API Reference](25-api-reference.md)** — Complete API documentation, Types, Methods
25. **[TypeScript Guide](26-typescript.md)** — TypeScript configuration, Strict mode, Type safety
26. **[Tailwind CSS Migration](27-tailwind-migration.md)** — Migrate between Tailwind v3 and v4

---

## 🆘 Quick Help

### Common Issues

| Issue | Solution |
|-------|----------|
| `database is locked` | WAL mode handles this — just retry |
| `Port 5555 in use` | Change `PORT` in `.env` or kill existing process |
| `Cannot find module` | Run `npm install` |
| `Migration failed` | Run `npm run refresh` to reset DB |
| AI not following conventions | Make sure you mentioned `@workflow/INIT_AGENT.md` |

[Full Troubleshooting Guide →](99-troubleshooting.md)

---

## 💡 Quick Reference by Topic

### **Getting Started**
- [5-Minute Quick Start](00-quickstart.md) — Get running in 5 minutes
- [AI Development](24-ai-development.md) — Build with AI assistance
- [Introduction](01-introduction.md) — Framework overview
- [Project Structure](02-project-structure.md) — Directory layout

### **Building Features**
- [Routing & Controllers](04-routing-controllers.md) — Handle HTTP requests
- [Frontend (Svelte 5)](05-frontend-svelte.md) — Build reactive UI
- [Database](03-database.md) — Store and query data
- [Validation](08-validation.md) — Validate user input
- [Email](09-email.md) — Send emails

### **User Management**
- [Authentication](06-authentication.md) — Login, register, OAuth
- [Middleware](07-middleware.md) — Protect routes
- [CSRF Protection](14-csrf.md) — Prevent CSRF attacks

### **File & Data Management**
- [Storage (S3)](10-storage.md) — Upload files
- [Caching](11-caching.md) — Speed up queries
- [Background Jobs](13-background-jobs.md) — Run scheduled tasks
- [Backup & Restore](23-backup-restore.md) — Backup database

### **Production Ready**
- [Best Practices](17-best-practices.md) — Code quality
- [Security Guide](18-security.md) — Secure your app
- [Performance Guide](19-performance.md) — Optimize speed
- [Testing](20-testing.md) — Test your code
- [Deployment](21-deployment.md) — Deploy to production
- [Troubleshooting](99-troubleshooting.md) — Fix issues

---

## 🎯 Common Tasks

### Create a CRUD Feature

**With AI:**
```
@workflow/TASK_AGENT.md
"Create a complete CRUD for Posts with title, content, and author"
```

**Manual:**
1. [Create migration](03-database.md#migrations) — Create file in `migrations/` folder
2. [Create controller](04-routing-controllers.md#creating-a-controller) — `node laju make:controller PostController`
3. [Define routes](04-routing-controllers.md#restful-routes)
4. [Create Svelte pages](05-frontend-svelte.md)

### Add Authentication

**With AI:**
```
@workflow/INIT_AGENT.md
"Setup authentication with Google OAuth and email verification"
```

**Manual:**
1. [Set up auth routes](06-authentication.md#basic-authentication)
2. [Protect routes with middleware](07-middleware.md#auth-middleware)
3. [Add rate limiting](07-middleware.md#rate-limit-middleware)

### Deploy to Production

1. [Build for production](21-deployment.md#building-for-production)
2. [Set up server](21-deployment.md#server-setup)
3. [Configure PM2](21-deployment.md#pm2-process-manager)
4. [Set up HTTPS](21-deployment.md#https-setup)
5. [Automate with GitHub Actions](22-github-actions.md)

---

## 🤖 AI Agent Quick Reference

### INIT_AGENT — Project Setup
```
@workflow/INIT_AGENT.md

"I want to build [app description]"
```

**Creates:**
- README, PRD, TDD, PROGRESS docs
- Design system configuration
- Database migrations
- GitHub Actions CI/CD

### TASK_AGENT — Build Features
```
@workflow/TASK_AGENT.md

"Create [feature description]"
```

**Builds:**
- Controllers & routes
- Svelte pages
- Database queries
- Feature implementation

### MANAGER_AGENT — Review & Deploy
```
@workflow/MANAGER_AGENT.md

"Review code and create release notes"
```

**Handles:**
- Code review
- Test coverage check
- Deployment approval
- Release notes

---

## 📦 Resources

- **Website:** [laju.dev](https://laju.dev)
- **GitHub:** [github.com/maulanashalihin/laju](https://github.com/maulanashalihin/laju)
- **NPM:** [create-laju-app](https://www.npmjs.com/package/create-laju-app)

---

## 🎓 Recommended Learning Order

### **For Complete Beginners:**
1. Start with [5-Minute Quick Start](00-quickstart.md)
2. Try [AI Development](24-ai-development.md)
3. Learn [Project Structure](02-project-structure.md)
4. Understand [Database Basics](03-database.md)
5. Build with [Routing & Controllers](04-routing-controllers.md)

### **For Experienced Developers:**
1. Skim [5-Minute Quick Start](00-quickstart.md)
2. Review [Project Structure](02-project-structure.md)
3. Jump to specific topics you need
4. Reference [API Reference](25-api-reference.md) as needed
5. Check [Best Practices](17-best-practices.md) before production

### **For Production Deployment:**
1. Review [Security Guide](18-security.md)
2. Optimize with [Performance Guide](19-performance.md)
3. Set up [Testing](20-testing.md)
4. Follow [Deployment Guide](21-deployment.md)
5. Automate with [GitHub Actions](22-github-actions.md)

---

**Built with ❤️ by [Maulana Shalihin](https://github.com/maulanashalihin)**

**Questions?** Check [Troubleshooting](99-troubleshooting.md) or ask AI with `@workflow/TASK_AGENT.md`