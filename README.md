# Laju

A high-performance TypeScript web framework combining HyperExpress, Svelte 5, and Inertia.js for building modern full-stack applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-20--22-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/maulanashalihin/laju?style=social)](https://github.com/maulanashalihin/laju)
[![Website](https://img.shields.io/badge/Website-laju.dev-orange)](https://laju.dev)

## Quick Start

```bash
npx create-laju-app my-project
cd my-project
npm run dev
```

Visit `http://localhost:5555`

## Features

- **HyperExpress** - 258,611 req/sec (11x faster than Express)
- **Svelte 5** - Modern reactive UI with runes
- **Inertia.js** - SPA without client-side routing complexity
- **BetterSQLite3** - WAL mode enabled (19.9x faster writes)
- **TailwindCSS 4** - Utility-first CSS with Vite plugin
- **TypeScript** - Full type safety
- **Built-in Auth** - Session, Google OAuth, password reset
- **S3 Storage** - Presigned URL uploads
- **Email** - Nodemailer & Resend support

## Performance

| Framework | Requests/sec | vs Laju |
|-----------|--------------|---------|
| **Laju.dev** | **258,611** | Baseline |
| Pure Node.js | 124,024 | 2x slower |
| Express.js | 22,590 | 11x slower |
| Laravel | 80 | 3,232x slower |

## Documentation

Full documentation available at [docs/](docs/README.md):

- [Introduction](docs/01-INTRODUCTION.md) - Overview & quick start
- [Project Structure](docs/02-PROJECT-STRUCTURE.md) - Directory layout
- [Backend Services](docs/03-BACKEND-SERVICES.md) - Database, Auth, Storage
- [API Reference](docs/04-API-REFERENCE.md) - Request/Response types
- [Deployment](docs/05-DEPLOYMENT.md) - Production setup
- [Tutorials](docs/08-TUTORIALS.md) - Build your first app
- [S3 Storage](docs/09-S3-STORAGE.md) - File uploads
- [Backup & Restore](docs/10-BACKUP-RESTORE.md) - Database backups
- [AI Development](docs/11-AI-DEVELOPMENT.md) - Build with AI assistants

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
