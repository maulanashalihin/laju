# Laju

⚡ **High-performance TypeScript web framework** — 11x faster than Express.js

Build modern full-stack applications with HyperExpress, Svelte 5, and Inertia.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-20--22-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0+-blue?logo=typescript)](https://www.typescriptlang.org/)

## 🚀 Quick Start

```bash
# Setup database
npm run migrate

# Start development
npm run dev
```

Visit `http://localhost:5555`

## ✨ Features

- **258,611 req/sec** — HyperExpress server
- **Svelte 5** — Reactive UI with runes
- **Inertia.js v3** — SPA without client-side routing
- **TailwindCSS 4** — Utility-first CSS with Vite
- **SQLite + WAL mode** — Zero-config database
- **Session auth** — OAuth (Google), password reset
- **S3/Wasabi** — Presigned URLs
- **TypeScript 6.0** — Full type safety

## 📊 Performance

| Framework | Requests/sec |
|-----------|-------------|
| **Laju** | **258,611** |
| Pure Node.js | 124,024 |
| Express.js | 22,590 |

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
│   └── index.css    # TailwindCSS

routes/              # Route definitions
migrations/          # Database migrations
commands/            # CLI commands
tests/               # Unit & integration tests
public/              # Static assets
storage/             # Local storage
type/                # TypeScript definitions
```

## Commands

```bash
npm run dev                # Start dev server (Vite + Nodemon)
npm run build              # Build for production
npm run migrate            # Run all pending migrations
npm run migrate:down       # Rollback 1 migration
npm run test:run           # Run unit/integration tests (Vitest)
npm run test:e2e           # Run E2E tests (Playwright)
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Server | HyperExpress v6.17 |
| Database | better-sqlite3 (raw SQL via repositories) |
| Inertia | [hyper-express-inertia](https://npmjs.com/package/hyper-express-inertia) |
| Frontend | Svelte 5 + Inertia.js v3 |
| Styling | TailwindCSS 4 |
| Build | Vite 8 |
| Language | TypeScript 6.0 |

## Author

**Maulana Shalihin** — [maulana@drip.id](mailto:maulana@drip.id)

## License

MIT
