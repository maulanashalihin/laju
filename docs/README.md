# Laju Framework Documentation

Complete documentation for the Laju high-performance TypeScript web framework.

**Organized for progressive learning from beginner to advanced topics.**

---

## 📚 Learning Path

### **Phase 1: Getting Started** (01-03)

Start here if you're new to Laju. Learn the basics and set up your first project.

1. **[Introduction](01-INTRODUCTION.md)** - Framework overview, tech stack, quick start
2. **[Project Structure](02-PROJECT-STRUCTURE.md)** - Directory layout, conventions, imports
3. **[Database Guide](03-DATABASE.md)** - Knex.js, Native SQLite, Migrations, Performance

---

### **Phase 2: Core Features** (04-09)

Build your first features with routing, frontend, and authentication.

4. **[Routing & Controllers](04-ROUTING-CONTROLLERS.md)** - Routes, controllers, request/response
5. **[Frontend (Svelte 5)](05-FRONTEND-SVELTE.md)** - Runes, State, Forms, Inertia.js
6. **[Authentication](06-AUTHENTICATION.md)** - Sessions, OAuth, Password Reset, Email Verification
7. **[Middleware](07-MIDDLEWARE.md)** - Auth, Rate limiting, Custom middleware, Patterns
8. **[Validation](08-VALIDATION.md)** - Zod schemas, Input validation, Type-safe forms
9. **[Email](09-EMAIL.md)** - Nodemailer, Resend, Email Templates

---

### **Phase 3: Advanced Features** (10-15)

Add file uploads, caching, background jobs, and internationalization.

10. **[Storage (S3)](10-STORAGE.md)** - S3/Wasabi, Presigned URLs, File Uploads
11. **[Caching](11-CACHING.md)** - Database Cache vs Redis, Strategies, Performance
12. **[Background Jobs](12-BACKGROUND-JOBS.md)** - Cron jobs, Task scheduling, Commands
13. **[CSRF Protection](13-CSRF.md)** - Token generation, Form protection, AJAX requests
14. **[Translation (i18n)](14-TRANSLATION.md)** - Multi-language, Interpolation, Nested keys
15. **[Eta Templates](15-ETA.md)** - SSR, Partials, Filters, Helpers

---

### **Phase 4: Best Practices** (16-18)

Learn production-ready patterns, TypeScript, security, and performance optimization.

16. **[Best Practices](16-BEST-PRACTICES.md)** - Code organization, patterns, conventions
17. **[TypeScript Guide](25-TYPESCRIPT.md)** - Configuration, Strict mode, Type safety, Custom types
    - **[Security Guide](17-SECURITY.md)** - Authentication, Validation, XSS, CSRF, CSP, SQL Injection
    - **[Performance Guide](18-PERFORMANCE.md)** - Database, Caching, File Uploads, Monitoring

---

### **Phase 5: Testing & Deployment** (19-21)

Test your application and deploy to production.

19. **[Testing Guide](19-TESTING.md)** - Unit tests, Integration tests, Vitest, Best practices
20. **[Deployment Guide](20-DEPLOYMENT.md)** - Production build, server setup, PM2, HTTPS
21. **[GitHub Actions](21-GITHUB-ACTIONS.md)** - CI/CD, Auto deploy, Testing automation

---

### **Phase 6: Advanced Topics** (22-25)

Deep dive into advanced features and API reference.

22. **[Backup & Restore](22-BACKUP-RESTORE.md)** - Database backup automation, S3 storage
23. **[AI Development](23-AI-DEVELOPMENT.md)** - Build apps with AI assistants
24. **[API Reference](24-API-REFERENCE.md)** - Complete API documentation, Types, Methods
25. **[TypeScript Guide](25-TYPESCRIPT.md)** - TypeScript configuration, Strict mode, Type safety

---

## 🚀 Quick Start

```bash
npx create-laju-app my-project
cd my-project
npm install
cp .env.example .env
npx knex migrate:latest
npm run dev
```

Visit `http://localhost:5555`

---

## 📖 Recommended Learning Order

### **For Complete Beginners:**
1. Read [Introduction](01-INTRODUCTION.md)
2. Understand [Project Structure](02-PROJECT-STRUCTURE.md)
3. Learn [TypeScript Guide](25-TYPESCRIPT.md) - Type safety fundamentals
4. Learn [Database Basics](03-DATABASE.md)
5. Build your first feature with [Routing & Controllers](04-ROUTING-CONTROLLERS.md)
6. Create UI with [Frontend (Svelte 5)](05-FRONTEND-SVELTE.md)
7. Add [Authentication](06-AUTHENTICATION.md)
8. Protect routes with [Middleware](07-MIDDLEWARE.md)

### **For Experienced Developers:**
1. Skim [Introduction](01-INTRODUCTION.md) and [Project Structure](02-PROJECT-STRUCTURE.md)
2. Review [TypeScript Guide](25-TYPESCRIPT.md) for strict mode configuration
3. Jump to specific topics you need
4. Reference [API Reference](24-API-REFERENCE.md) as needed
5. Check [Best Practices](16-BEST-PRACTICES.md) before production

### **For Production Deployment:**
1. Review [Security Guide](17-SECURITY.md)
2. Optimize with [Performance Guide](18-PERFORMANCE.md)
3. Set up [Testing](19-TESTING.md)
4. Follow [Deployment Guide](20-DEPLOYMENT.md)
5. Automate with [GitHub Actions](21-GITHUB-ACTIONS.md)

---

## 🎯 Quick Reference by Topic

### **Building Features**
- [Routing & Controllers](04-ROUTING-CONTROLLERS.md) - Handle HTTP requests
- [Frontend (Svelte 5)](05-FRONTEND-SVELTE.md) - Build reactive UI
- [Database](03-DATABASE.md) - Store and query data
- [Validation](08-VALIDATION.md) - Validate user input
- [Email](09-EMAIL.md) - Send emails

### **User Management**
- [Authentication](06-AUTHENTICATION.md) - Login, register, OAuth
- [Middleware](07-MIDDLEWARE.md) - Protect routes
- [CSRF Protection](13-CSRF.md) - Prevent CSRF attacks

### **File & Data Management**
- [Storage (S3)](10-STORAGE.md) - Upload files
- [Caching](11-CACHING.md) - Speed up queries
- [Background Jobs](12-BACKGROUND-JOBS.md) - Run scheduled tasks
- [Backup & Restore](22-BACKUP-RESTORE.md) - Backup database

### **Internationalization**
- [Translation](14-TRANSLATION.md) - Multi-language support
- [Eta Templates](15-ETA.md) - Server-side rendering

### **Production Ready**
- [TypeScript Guide](25-TYPESCRIPT.md) - Type safety & configuration
- [Best Practices](16-BEST-PRACTICES.md) - Code quality
- [Security Guide](17-SECURITY.md) - Secure your app (includes CSP)
- [Performance Guide](18-PERFORMANCE.md) - Optimize speed
- [Testing](19-TESTING.md) - Test your code
- [Deployment](20-DEPLOYMENT.md) - Deploy to production

---

## 💡 Common Tasks

### Create a CRUD Feature
1. [Create migration](03-DATABASE.md#migrations) - `npx knex migrate:make create_posts`
2. [Create controller](04-ROUTING-CONTROLLERS.md#creating-a-controller) - `node laju make:controller PostController`
3. [Define routes](04-ROUTING-CONTROLLERS.md#restful-routes)
4. [Create Svelte pages](05-FRONTEND-SVELTE.md)

### Add Authentication
1. [Set up auth routes](06-AUTHENTICATION.md#basic-authentication)
2. [Protect routes with middleware](07-MIDDLEWARE.md#auth-middleware)
3. [Add rate limiting](07-MIDDLEWARE.md#rate-limit-middleware)

### Deploy to Production
1. [Build for production](20-DEPLOYMENT.md#building-for-production)
2. [Set up server](20-DEPLOYMENT.md#server-setup)
3. [Configure PM2](20-DEPLOYMENT.md#pm2-process-manager)
4. [Set up HTTPS](20-DEPLOYMENT.md#https-setup)
5. [Automate with GitHub Actions](21-GITHUB-ACTIONS.md)

---

## 📦 Resources

- **Website:** [laju.dev](https://laju.dev)
- **GitHub:** [github.com/maulanashalihin/laju](https://github.com/maulanashalihin/laju)
- **NPM:** [create-laju-app](https://www.npmjs.com/package/create-laju-app)

---

**Built with ❤️ by [Maulana Shalihin](https://github.com/maulanashalihin)**
