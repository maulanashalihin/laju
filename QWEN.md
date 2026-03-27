# Laju Framework - Project Context

## Project Overview

**Laju** (Indonesian for 'fast/swift') is a high-performance TypeScript web framework designed for building modern full-stack applications. It combines HyperExpress (11x faster than Express.js), Svelte 5, and Inertia.js to deliver exceptional performance with a developer-friendly experience.

### Key Technologies

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 20-22 |
| **HTTP Server** | HyperExpress v6.17 |
| **Database** | BetterSQLite3 + Kysely (WAL mode enabled) |
| **Frontend** | Svelte 5 + Inertia.js |
| **Styling** | TailwindCSS 4 (via Vite plugin) |
| **Build Tool** | Vite |
| **Templates** | Eta (SSR) |
| **Language** | TypeScript 6.0 |

### Performance Highlights

- **258,611 req/sec** - 11x faster than Express.js
- **19.9x faster writes** - SQLite with WAL mode
- **Zero-config caching** - Database cache included (optional Redis)

## Building and Running

### Prerequisites

- Node.js 20-22
- npm or bun

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (Vite + Nodemon)
npm run dev
```

This runs:
- Vite for frontend assets (JS/CSS/Svelte)
- Nodemon for backend auto-reload

Server runs at `http://localhost:5555` (or `https://` if `HAS_CERTIFICATE=true`)

### Production

```bash
# Build for production
npm run build

# Run migrations
npm run migrate

# Start production server
node build/server.js
```

### Database Commands

```bash
# Run all migrations
npm run migrate

# Rollback last migration
npm run migrate:down

# Rollback N migrations
npm run migrate:down 3

# Rollback to specific migration
npm run migrate:down 20230514062913

# Refresh database (drop + migrate)
npm run refresh
```

### Testing

```bash
# Unit/Integration tests (Vitest)
npm run test:run

# Tests with UI
npm run test:ui

# Tests with coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# E2E debug mode
npm run test:e2e:debug
```

### Code Generation

```bash
# Generate controller
npx tsx commands/native/MakeController.ts UserController

# Generate command
npx tsx commands/native/MakeCommand.ts CustomCommand
```

## Development Conventions

### Project Structure

```
laju/
├── app/                          # Backend application code
│   ├── handlers/                 # Request handlers by domain (*.handler.ts)
│   │   ├── auth.handler.ts       # Authentication (login, register, OAuth, password)
│   │   ├── app.handler.ts        # Application pages (dashboard, profile)
│   │   ├── public.handler.ts     # Public pages (home, about)
│   │   ├── upload.handler.ts     # File upload operations
│   │   ├── s3.handler.ts         # S3 storage operations
│   │   ├── storage.handler.ts    # Local storage file serving
│   │   └── asset.handler.ts      # Static asset serving
│   ├── middlewares/              # Middleware (*.middleware.ts, kebab-case)
│   │   ├── auth.middleware.ts         # Authentication middleware
│   │   ├── csrf.middleware.ts         # CSRF protection middleware
│   │   ├── inertia.middleware.ts      # Inertia.js middleware
│   │   ├── rate-limit.middleware.ts   # Rate limiting middleware
│   │   └── security-headers.middleware.ts # Security headers middleware
│   ├── services/                 # Business logic (PascalCase.ts)
│   ├── repositories/             # Database query layer
│   └── validators/               # Zod validation schemas
├── frontend/                     # Frontend application (Svelte 5)
│   ├── src/
│   │   ├── Pages/                # Svelte/Inertia pages (kebab-case.svelte)
│   │   ├── Components/           # Reusable components (PascalCase.svelte)
│   │   ├── app.js                # Main entry point
│   │   ├── index.js              # Secondary entry point
│   │   └── index.css             # TailwindCSS styles
│   └── (build artifacts in dist/)
├── templates/                    # Eta templates (SSR)
│   ├── index.html                # Landing page template
│   ├── inertia.html              # Inertia.js base template
│   └── partials/                 # Template partials
├── type/                         # TypeScript type definitions
│   ├── index.d.ts                # App-wide types (Request, Response, User)
│   ├── db-types.ts               # Database schemas for Kysely
│   ├── dto.ts                    # Common DTOs for API responses
│   └── hyper-express.d.ts        # HyperExpress type augmentations
├── routes/                       # Route definitions
├── migrations/                   # Database migrations (timestamp_description.ts)
├── commands/                     # CLI commands
├── tests/                        # Unit & integration tests
├── public/                       # Static assets
├── storage/                      # Local file storage
├── data/                         # SQLite databases
├── type/                         # TypeScript definitions
└── docs/                         # Documentation
```

### Import Paths

Use absolute imports from project root (configured in `tsconfig.json`):

```typescript
// ✅ Recommended
import DB from "app/services/DB";
import AuthHandler from "app/handlers/auth.handler";
import Auth from "app/middlewares/auth.middleware";
import { Request, Response } from "type";

// ❌ Avoid relative imports
import DB from "../../app/services/DB";
```

### Coding Style

- **TypeScript**: Strict mode enabled, no implicit any
- **Handlers**: Organized by domain (e.g., `auth.handler.ts`, `app.handler.ts`)
- **Middleware**: Functional pattern with `.middleware.ts` suffix
- **Services**: Single responsibility, injectable dependencies
- **Validators**: Zod schemas in `app/validators/`
- **Models**: Domain models and DTOs in `app/models/`

### Testing Practices

- **Unit tests**: Vitest with `happy-dom` environment
- **E2E tests**: Playwright for browser testing
- **Test files**: Co-located with source or in `tests/` directory
- **Coverage**: V8 provider, excludes `node_modules`, `dist`, `build`, `tests`

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Core
NODE_ENV=development
PORT=5555
HAS_CERTIFICATE=false
LOG_LEVEL=info

# Database
DB_CONNECTION=development

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5555/google/callback

# Storage (S3/Wasabi)
WASABI_ACCESS_KEY=
WASABI_SECRET_KEY=
WASABI_BUCKET=laju-dev

# Email
RESEND_API_KEY=
USER_MAILER=
```

### Git Workflow

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Commits follow conventional commit format
- Run tests before pushing: `npm run test:run`

### Key Files

| File | Purpose |
|------|---------|
| `server.ts` | Application entry point |
| `routes/web.ts` | All HTTP routes |
| `app/services/DB.ts` | Database configuration |
| `vite.config.mjs` | Vite build config |
| `tsconfig.json` | TypeScript config |
| `vitest.config.ts` | Test config |
| `playwright.config.ts` | E2E test config |

### Common Patterns

**Handler Pattern:**
```typescript
import { Request, Response } from "type";

export const AuthHandler = {
  async loginPage(request: Request, response: Response) {
    // Handle request
    return response.inertia("auth/login");
  },
  
  async processLogin(request: Request, response: Response) {
    // Process login logic
    return response.redirect("/home");
  }
};

export default AuthHandler;
```

**Service Pattern:**
```typescript
import DB from "app/services/DB";

export default {
  async getAll() {
    return DB.selectFrom("users").selectAll().execute();
  }
};
```

**Validation Pattern:**
```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Use in handler
const validated = schema.parse(request.body);
```

## Documentation

Full documentation is in the `docs/` directory:

- [Quick Start](docs/00-quickstart.md)
- [Introduction](docs/01-introduction.md)
- [Project Structure](docs/02-project-structure.md)
- [Database Guide](docs/03-database.md)
- [Routing & Controllers](docs/04-routing-controllers.md)
- [Frontend (Svelte 5)](docs/05-frontend-svelte.md)
- [Authentication](docs/06-authentication.md)
- [Testing](docs/20-testing.md)
- [Deployment](docs/21-deployment.md)

## Support

- **Website:** [laju.dev](https://laju.dev)
- **Documentation:** [docs.laju.dev](https://docs.laju.dev)
- **GitHub:** [github.com/maulanashalihin/laju](https://github.com/maulanashalihin/laju)
- **Author:** Maulana Shalihin
