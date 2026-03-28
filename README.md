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

**Want AI to build everything?** Mention `@workflow/agents/developer.md` in your AI assistant! 🤖

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
- **INIT_AGENT** - Project setup, PRD, database design
- **TASK_AGENT** - Build features with AI assistance
- **MANAGER_AGENT** - Code review and deployment

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
- [5-Minute Quick Start](docs/00-quickstart.md) - Get running in 5 minutes
- [Introduction](docs/01-introduction.md) - Framework overview, tech stack
- [Project Structure](docs/02-project-structure.md) - Directory layout, conventions

### Core Features
- [Database Guide](docs/03-database.md) - Kysely + SQLite, WAL mode, migrations
- [Routing & Controllers](docs/04-routing-controllers.md) - Routes, handlers, request/response
- [Frontend (Svelte 5)](docs/05-frontend-svelte.md) - Runes, State, Forms, Inertia.js
- [Authentication](docs/06-authentication.md) - Sessions, OAuth, password reset
- [Middleware](docs/07-middleware.md) - Auth, rate limiting, custom middleware
- [Validation](docs/08-validation.md) - Zod schemas, input validation
- [Email](docs/09-email.md) - Nodemailer, Resend, email templates

### Advanced Features
- [Storage (S3)](docs/10-storage.md) - S3/Wasabi, presigned URLs, file uploads
- [Caching](docs/11-caching.md) - Database cache vs Redis, strategies
- [Redis](docs/12-redis.md) - Redis configuration and usage
- [Background Jobs](docs/13-background-jobs.md) - Cron jobs, task scheduling
- [CSRF Protection](docs/14-csrf.md) - Token generation, form protection
- [Translation (i18n)](docs/15-translation.md) - Multi-language support
- [Eta Templates](docs/16-eta.md) - SSR, partials, helpers

### Production Ready
- [Best Practices](docs/17-best-practices.md) - Code organization, patterns
- [Security Guide](docs/18-security.md) - Authentication, XSS, CSRF, CSP
- [Performance Guide](docs/19-performance.md) - Database, caching, optimization
- [Testing](docs/20-testing.md) - Unit, integration, Vitest, Playwright
- [Deployment](docs/21-deployment.md) - Production build, PM2, HTTPS
- [GitHub Actions](docs/22-github-actions.md) - CI/CD workflows
- [Backup & Restore](docs/23-backup-restore.md) - Database backup automation

### Advanced Topics
- [AI Development](docs/24-ai-development.md) - Build with AI assistants
- [API Reference](docs/25-api-reference.md) - Complete API documentation
- [TypeScript Guide](docs/26-typescript.md) - TypeScript configuration, strict mode
- [Tailwind CSS Migration](docs/27-tailwind-migration.md) - Migrate between v3/v4
- [Troubleshooting](docs/99-troubleshooting.md) - Common issues and solutions

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

- [tapsite.ai](https://tapsite.ai) - AI website builder
- [dripsender.id](https://dripsender.id) - Email marketing
- [laju.dev](https://laju.dev) - This framework

## Support

- Star this repository
- [Become a Sponsor](https://github.com/sponsors/maulanashalihin)
- Report bugs via [GitHub Issues](https://github.com/maulanashalihin/laju/issues)

## License

MIT License
