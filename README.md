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
npx knex migrate:latest

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
- **TailwindCSS 4** - Utility-first CSS with Vite
- **TypeScript** - Full type safety

### Built-in Services
- **Authentication** - Sessions, OAuth (Google), password reset
- **Storage** - S3/Wasabi with presigned URLs
- **Email** - Nodemailer (SMTP) or Resend (API)
- **Caching** - Database cache or Redis
- **Templates** - Squirrelly for SSR

## 📊 Performance

| Framework | Requests/sec | Comparison |
|-----------|--------------|------------|
| **Laju** | **258,611** | Baseline |
| Pure Node.js | 124,024 | 2x slower |
| Express.js | 22,590 | 11x slower |
| Laravel | 80 | 3,232x slower |

*Benchmark: Simple JSON response on same hardware*

## 📚 Documentation

**[Complete Documentation →](docs/README.md)**

### Getting Started
- [Introduction](docs/01-INTRODUCTION.md) - Framework overview
- [Project Structure](docs/02-PROJECT-STRUCTURE.md) - Directory layout

### Core Services
- [Database](docs/03-DATABASE.md) - Knex.js + SQLite
- [Authentication](docs/04-AUTHENTICATION.md) - Sessions + OAuth
- [Storage](docs/05-STORAGE.md) - S3 file uploads
- [Email](docs/06-EMAIL.md) - Nodemailer + Resend
- [Caching](docs/17-CACHING.md) - Database vs Redis

### Guides
- [Deployment](docs/08-DEPLOYMENT.md) - Production setup
- [Tutorials](docs/11-TUTORIALS.md) - CRUD, Auth, File Upload
- [Testing](docs/14-TESTING.md) - Unit + Integration tests
- [Svelte 5 Patterns](docs/15-SVELTE5-PATTERNS.md) - Runes + State

## Project Structure

```
app/
├── controllers/     # Request handlers
├── middlewares/     # Auth, rate limiting
└── services/        # DB, Mailer, Storage

resources/
├── js/
│   ├── Pages/       # Svelte/Inertia pages
│   ├── Components/  # Reusable components
│   └── index.css    # TailwindCSS 4
└── views/           # Squirrelly templates

routes/              # Route definitions
migrations/          # Database migrations
```

## Commands

```bash
npm run dev                              # Development
npm run build                            # Production build
node laju make:controller UserController # Generate controller
npx knex migrate:make create_posts       # Create migration
npx knex migrate:latest                  # Run migrations
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Server | HyperExpress |
| Database | BetterSQLite3 + Knex |
| Frontend | Svelte 5 + Inertia.js |
| Styling | TailwindCSS 4 |
| Build | Vite |
| Templates | Squirrelly |

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
