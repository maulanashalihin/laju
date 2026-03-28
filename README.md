# Laju

⚡ **High-performance TypeScript web framework** - 11x faster than Express.js

Build modern full-stack applications with HyperExpress, Svelte 5, and Inertia.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-20--22-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/maulanashalihin/laju?style=social)](https://github.com/maulanashalihin/laju)

## 🚀 Quick Start

```bash
# Create new project
npx create-laju-app my-project
cd my-project

# Setup database
npm run migrate

# Start development
npm run dev
```

Visit `http://localhost:5555`

**Want AI to build everything?** Use multi-agent workflow with mandatory review points:

```
@workflow/agents/product.md  Saya mau bikin aplikasi [deskripsikan]
```

Agents: `product.md` → `tech-lead.md` → `developer.md` → `qa.md` → `devops.md`

## ✨ Features

### Performance First
- **258,611 req/sec** - HyperExpress server (11x faster than Express)
- **19.9x faster writes** - SQLite with WAL mode
- **Zero-config caching** - Database cache included (optional Redis)

### Modern Stack
- **Svelte 5** - Reactive UI with runes
- **Inertia.js** - SPA without client-side routing
- **TailwindCSS 4** - Utility-first CSS with Vite
- **TypeScript 6.0** - Full type safety

### Built-in Services
- **Authentication** - Sessions, OAuth (Google), password reset
- **Storage** - S3/Wasabi with presigned URLs
- **Email** - Nodemailer (SMTP) or Resend (API)
- **Caching** - Database cache or Redis
- **Templates** - Eta for SSR

### AI Development
- **Product Agent** - Define requirements, PRD, user stories
- **Tech Lead Agent** - Design system architecture, database schema
- **Developer Agent** - Implement features with mandatory review
- **QA Agent** - Test and review before deploy
- **DevOps Agent** - Deploy to production

## 📊 Performance

| Framework | Requests/sec | Comparison |
|-----------|--------------|------------|
| **Laju** | **258,611** | Baseline |
| Pure Node.js | 124,024 | 2x slower |
| Express.js | 22,590 | 11x slower |
| Laravel | 80 | 3,232x slower |

*Benchmark: Simple JSON response on same hardware*

## 📚 Documentation

**[Complete Documentation →](https://docs.laju.dev/)**

Documentation is organized for progressive learning from beginner to advanced.

### Quick Start
- [5-Minute Quick Start](https://docs.laju.dev/00-quickstart) - Get running in 5 minutes
- [Introduction](https://docs.laju.dev/01-introduction) - Framework overview, tech stack
- [Project Structure](https://docs.laju.dev/02-project-structure) - Directory layout, conventions

### Core Features
- [Database Guide](https://docs.laju.dev/03-database) - Kysely + SQLite, WAL mode, migrations
- [Routing & Handlers](https://docs.laju.dev/04-routing-handlers) - Routes, handlers, request/response
- [Frontend (Svelte 5)](https://docs.laju.dev/05-frontend-svelte) - Runes, State, Forms, Inertia.js
- [Authentication](https://docs.laju.dev/06-authentication) - Sessions, OAuth, password reset
- [Middleware](https://docs.laju.dev/07-middleware) - Auth, rate limiting, custom middleware
- [Validation](https://docs.laju.dev/08-validation) - Zod schemas, input validation
- [Email](https://docs.laju.dev/09-email) - Nodemailer, Resend, email templates

### Advanced Features
- [Storage (S3)](https://docs.laju.dev/10-storage) - S3/Wasabi, presigned URLs, file uploads
- [Caching](https://docs.laju.dev/11-caching) - Database cache vs Redis, strategies
- [Redis](https://docs.laju.dev/12-redis) - Redis configuration and usage
- [Background Jobs](https://docs.laju.dev/13-background-jobs) - Cron jobs, task scheduling
- [CSRF Protection](https://docs.laju.dev/14-csrf) - Token generation, form protection
- [Translation (i18n)](https://docs.laju.dev/15-translation) - Multi-language support
- [Eta Templates](https://docs.laju.dev/16-eta) - SSR, partials, helpers

### Production Ready
- [Best Practices](https://docs.laju.dev/17-best-practices) - Code organization, patterns
- [Security Guide](https://docs.laju.dev/18-security) - Authentication, XSS, CSRF, CSP
- [Performance Guide](https://docs.laju.dev/19-performance) - Database, caching, optimization
- [Testing](https://docs.laju.dev/20-testing) - Unit, integration, Vitest, Playwright
- [Deployment](https://docs.laju.dev/21-deployment) - Production build, PM2, HTTPS
- [GitHub Actions](https://docs.laju.dev/22-github-actions) - CI/CD workflows
- [Backup & Restore](https://docs.laju.dev/23-backup-restore) - Database backup automation

### Advanced Topics
- [AI Development](https://docs.laju.dev/24-ai-development) - Build with AI assistants
- [API Reference](https://docs.laju.dev/25-api-reference) - Complete API documentation
- [TypeScript Guide](https://docs.laju.dev/26-typescript) - TypeScript configuration, strict mode
- [Tailwind CSS Migration](https://docs.laju.dev/27-tailwind-migration) - Migrate between v3/v4
- [Migration Guide](https://docs.laju.dev/28-migration-guide) - Migration patterns
- [Troubleshooting](https://docs.laju.dev/99-troubleshooting) - Common issues and solutions

## Project Structure

```
app/
├── handlers/        # Request handlers (domain-based)
├── middlewares/     # Auth, rate limiting, CSRF
├── services/        # DB, Mailer, Storage, Cache
├── repositories/    # Database query layer
└── validators/      # Input validation

frontend/
├── src/
│   ├── Pages/       # Svelte/Inertia pages
│   ├── Components/  # Reusable components
│   ├── app.js       # Main entry point
│   ├── index.js     # Secondary entry point
│   └── index.css    # TailwindCSS

templates/           # Eta templates (SSR)
├── index.html       # Landing page template
├── inertia.html     # Inertia.js base template
└── partials/        # Template partials

routes/              # Route definitions
migrations/          # Database migrations
commands/            # CLI commands
tests/               # Unit & integration tests
docs/                # Documentation
benchmark/           # Performance benchmarks
public/              # Static assets
storage/             # Local storage
data/                # SQLite databases
type/                # TypeScript definitions
```

## Commands

```bash
# Development
npm run dev                              # Start dev server (Vite + Nodemon)

# Production
npm run build                            # Build for production
node build/server.js                     # Run production server

# Database
npm run migrate                          # Run all migrations
npm run migrate:down                     # Rollback last migration
npm run migrate:down 3                   # Rollback 3 migrations
npm run migrate:down 20230514062913      # Rollback to specific migration
npm run migrate:rollback                 # Rollback to last batch
npm run refresh                          # Drop and re-migrate database

# Testing
npm run test:run                         # Run unit/integration tests (Vitest)
npm run test:ui                          # Run tests with UI
npm run test:coverage                    # Run tests with coverage
npm run test:e2e                         # Run E2E tests (Playwright)
npm run test:e2e:ui                      # Run E2E tests with UI
npm run test:e2e:debug                   # Run E2E tests in debug mode

# Code Generation
npx tsx commands/native/MakeController.ts UserController    # Generate controller
npx tsx commands/native/MakeCommand.ts CustomCommand        # Generate command
npx tsx commands/native/MakeHandler.ts UserHandler          # Generate handler
npx tsx commands/native/MakeMiddleware.ts AuthMiddleware    # Generate middleware
npx tsx commands/native/MakeRepository.ts UserRepository    # Generate repository
npx tsx commands/native/MakeValidator.ts AuthValidator      # Generate validator
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Server | HyperExpress v6.17 |
| Database | BetterSQLite3 + Kysely |
| Frontend | Svelte 5 + Inertia.js |
| Styling | TailwindCSS 4 |
| Build | Vite |
| Templates | Eta |
| Language | TypeScript 6.0 |

## Author

**Maulana Shalihin** - [maulana@drip.id](mailto:maulana@drip.id)

- [maulanabuilds.com](https://maulanabuilds.com) - Senior Full-Stack Engineer, MVP Development

## Support

- Star this repository
- [Become a Sponsor](https://github.com/sponsors/maulanashalihin)
- Report bugs via [GitHub Issues](https://github.com/maulanashalihin/laju/issues)

## License

MIT License
