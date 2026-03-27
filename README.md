# Laju

⚡ **High-performance TypeScript web framework** - 11x faster than Express.js

Build modern full-stack applications with HyperExpress, Svelte 5, and Inertia.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-20--22-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/maulanashalihin/laju?style=social)](https://github.com/maulanashalihin/laju)

## 🚀 Quick Start

```bash
# Create new project
npx create-laju-app my-project
cd my-project

# Setup database
cp .env.example .env
npm run migrate

# Start development
npm run dev
```

Visit `http://localhost:5555`

## ✨ Features

### Performance First
- **258,611 req/sec** - HyperExpress server (11x faster than Express)
- **19.9x faster writes** - SQLite with WAL mode
- **Zero-config caching** - Database cache included (optional Redis)

### Modern Stack
- **Svelte 5** - Reactive UI with runes
- **Inertia.js** - SPA without client-side routing
- **TailwindCSS 3 & 4** - Utility-first CSS with Vite (easy migration)
- **TypeScript** - Full type safety

### Built-in Services
- **Authentication** - Sessions, OAuth (Google), password reset
- **Storage** - S3/Wasabi with presigned URLs
- **Email** - Nodemailer (SMTP) or Resend (API)
- **Caching** - Database cache or Redis
- **Templates** - Eta for SSR

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

### Getting Started
- [Introduction](docs/01-introduction.md) - Framework overview, quick start
- [Project Structure](docs/02-project-structure.md) - Directory layout
- [Database](docs/03-database.md) - Kysely + SQLite

### Core Features
- [Routing & Handlers](docs/04-routing-handlers.md) - Handle requests
- [Frontend (Svelte 5)](docs/05-frontend-svelte.md) - Build reactive UI
- [Authentication](docs/06-authentication.md) - Sessions + OAuth
- [Middleware](docs/07-middleware.md) - Auth, Rate limiting
- [Validation](docs/08-validation.md) - Input validation
- [Email](docs/09-email.md) - Send emails
- [Templates (Eta)](docs/16-eta.md) - Server-side rendering
- [Performance](docs/19-performance.md) - Optimization tips

### Advanced Features
- [Storage (S3)](docs/10-storage.md) - File uploads
- [Caching](docs/11-caching.md) - Redis + Database cache
- [Redis](docs/12-redis.md) - Redis configuration
- [Background Jobs](docs/13-background-jobs.md) - Cron jobs, Scheduling
- [CSRF Protection](docs/14-csrf.md) - Security
- [Translation](docs/15-translation.md) - Multi-language
- [Backup & Restore](docs/23-backup-restore.md) - Database backup

### Production
- [Best Practices](docs/17-best-practices.md) - Code quality
- [Security Guide](docs/18-security.md) - Secure your app
- [Testing](docs/20-testing.md) - Unit + Integration tests
- [Deployment](docs/21-deployment.md) - Production setup
- [GitHub Actions](docs/22-github-actions.md) - CI/CD workflows
- [AI Development](docs/24-ai-development.md) - AI integration

### Reference
- [API Reference](docs/25-api-reference.md) - Framework API
- [TypeScript Guide](docs/26-typescript.md) - TypeScript patterns

## Project Structure

```
app/
├── handlers/        # Request handlers (domain-based)
├── middlewares/     # Auth, rate limiting, CSRF
├── services/        # DB, Mailer, Storage, Cache
├── repositories/    # Database query layer
└── validators/      # Input validation

resources/
├── js/
│   ├── Pages/       # Svelte/Inertia pages
│   ├── Components/  # Reusable components
│   └── index.css    # TailwindCSS
└── views/           # Eta templates

routes/              # Route definitions
migrations/          # Database migrations
commands/            # CLI commands
tests/               # Unit & integration tests
docs/                # Documentation
benchmark/           # Performance benchmarks
public/              # Static assets
storage/             # Local storage
type/                # TypeScript definitions
```

## Commands

```bash
npm run dev                              # Development
npm run build                            # Production build
node laju make:handler UserHandler       # Generate handler
npm run migrate                          # Run migrations
npm run migrate:down                     # Rollback last migration
npm run migrate:down 3                   # Rollback 3 migrations
npm run migrate:down 20230514062913      # Rollback to specific migration
npm run refresh                          # Refresh database
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Server | HyperExpress |
| Database | BetterSQLite3 + Kysely |
| Frontend | Svelte 5 + Inertia.js |
| Styling | TailwindCSS 3 & 4 |
| Build | Vite |
| Templates | Eta |

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
