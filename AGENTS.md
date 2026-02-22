# AGENTS.md - Laju Framework

> This file provides essential context for AI coding agents working on the Laju project.
> Laju (Indonesian for "fast/swift") is a high-performance TypeScript web framework.

---

## Project Overview

Laju is a full-stack TypeScript web framework designed for high performance (11x faster than Express.js). It combines:

- **Server**: HyperExpress (high-performance HTTP server)
- **Database**: SQLite with BetterSQLite3 + Kysely query builder
- **Frontend**: Svelte 5 with Inertia.js (SPA without client-side routing)
- **Styling**: TailwindCSS 3 & 4
- **Build Tool**: Vite

**Key Metrics**:
- 258,611 req/sec (HyperExpress)
- 19.9x faster writes with SQLite WAL mode
- Full TypeScript support with strict mode

---

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Access the application at `http://localhost:5555` (Vite dev server runs on port 5173).

---

## Project Structure

```
app/
├── controllers/       # Request handlers (LoginController, RegisterController, etc.)
├── middlewares/       # Auth, rate limiting, CSRF, Inertia, security headers
├── services/          # Core services (DB, Mailer, Storage, Cache, Logger, etc.)
├── repositories/      # Database query layer (UserRepository, AssetRepository)
└── validators/        # Zod validation schemas

routes/
└── web.ts             # All application routes

resources/
├── js/
│   ├── Pages/         # Svelte/Inertia pages (auth/, home.svelte, profile.svelte)
│   ├── Components/    # Reusable Svelte components
│   ├── languages/     # i18n translation files
│   ├── app.js         # Inertia app entry point
│   ├── index.js       # Additional entry point
│   └── index.css      # TailwindCSS imports
└── views/             # Eta templates (email templates, etc.)

migrations/            # Database migration files (timestamped)
commands/              # CLI commands (make:controller, migrate, refresh, etc.)
tests/                 # Test suites
├── unit/              # Unit tests for services
├── integration/       # Integration tests
├── e2e/               # Playwright E2E tests
└── setup.ts           # Test environment setup
type/                  # TypeScript type definitions
├── index.d.ts         # Main types (User interface)
├── hyper-express.d.ts # HyperExpress type augmentations
└── db-types.ts        # Database schema types
data/                  # SQLite database files (dev.sqlite3, test.sqlite3, production.sqlite3)
storage/               # Local file storage uploads
public/                # Static assets (images, fonts, etc.)
dist/                  # Vite build output (JS/CSS assets)
build/                 # Compiled TypeScript output
```

---

## Available Scripts

```bash
# Development
npm run dev                    # Start dev server (Vite + Nodemon)

# Build
npm run build                  # Production build (Vite + TypeScript compilation)

# Database
npm run migrate                # Run pending migrations
npm run migrate:down           # Rollback last migration (or specify count/target)
npm run migrate:rollback       # Alternative rollback command
npm run refresh                # Refresh database (drop all tables and remigrate)

# Testing
npm run test:run               # Run unit/integration tests (Vitest)
npm run test:ui                # Run tests with UI
npm run test:coverage          # Run tests with coverage report
npm run test:e2e               # Run E2E tests (Playwright)
npm run test:e2e:ui            # Run E2E tests with UI
npm run test:e2e:debug         # Debug E2E tests
npm run test:e2e:install       # Install Playwright browsers

# Code Generation
node laju make:controller UserController   # Generate new controller

# Tailwind
npm run tailwind:migrate       # Migrate Tailwind CSS configuration
```

---

## Technology Stack Details

### Server Layer
- **HyperExpress**: Ultra-fast HTTP server (uWebSockets.js based)
- **Request body limit**: 10MB (configured in server.ts)
- **Default port**: 5555

### Database Layer
- **SQLite** with BetterSQLite3 driver
- **Kysely**: Type-safe SQL query builder
- **WAL mode**: Enabled for better concurrent performance
- **Foreign keys**: Enforced
- **Busy timeout**: 5 seconds

### Frontend Layer
- **Svelte 5**: With runes (`$state`, `$derived`, `$effect`)
- **Inertia.js**: Svelte adapter for SPA-like experience
- **Vite**: Development server and build tool

### Validation
- **Zod**: Schema validation library
- Validation schemas in `app/validators/`

### Authentication
- Session-based authentication with cookies
- OAuth Google login support
- Password reset via email
- CSRF protection (disabled by default, enable in server.ts)

### Storage
- Local storage (filesystem)
- S3-compatible storage (Wasabi, AWS S3)
- Image processing with Sharp

### Email
- Nodemailer (SMTP)
- Resend API
- Eta templates for email rendering

### Caching
- Database cache (SQLite-based)
- Redis support (optional)

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts |
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.mjs` | Vite build configuration |
| `svelte.config.mjs` | Svelte preprocessor config |
| `tailwind.config.js` | TailwindCSS theme and plugins |
| `postcss.config.mjs` | PostCSS configuration |
| `playwright.config.ts` | E2E test configuration |
| `vitest.config.ts` | Unit/integration test config |
| `nodemon.json` | Dev server file watching |
| `.env` | Environment variables |
| `.env.test` | Test environment variables |
| `Dockerfile` | Container configuration |

---

## Environment Variables

### Core Settings
```env
DB_CONNECTION=development        # Database: development, production, test
NODE_ENV=development             # Environment mode
PORT=5555                        # Server port

HAS_CERTIFICATE=false            # Enable HTTPS (uses localhost+1.pem)
LOG_LEVEL=info                   # Winston log level
```

### Authentication
```env
GOOGLE_CLIENT_ID=                # Google OAuth
GOOGLE_CLIENT_SECRET=            # Google OAuth
GOOGLE_REDIRECT_URI=http://localhost:5555/google/callback
APP_URL=http://localhost:5555    # Application URL
```

### Storage (S3/Wasabi)
```env
WASABI_ACCESS_KEY=
WASABI_SECRET_KEY=
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=                         # CDN base URL
```

### Email
```env
RESEND_API_KEY=                  # Resend API key
DRIPSENDER_API_KEY=              # Alternative email service
USER_MAILER=                     # SMTP username
PASS_MAILER=                     # SMTP password
```

### Security
```env
BACKUP_ENCRYPTION_KEY=           # 32-byte key for backup encryption
```

### Local Storage
```env
LOCAL_STORAGE_PATH=./storage     # Local file storage path
LOCAL_STORAGE_PUBLIC_URL=/storage # Public URL prefix
```

---

## Code Style Guidelines

### TypeScript Configuration
- Target: ES2021
- Strict mode enabled
- Experimental decorators enabled
- Path aliases configured:
  - `app/*` → `app/*`
  - `routes/*` → `routes/*`
  - `resources/*` → `resources/*`
  - `type/*` → `type/*`

### Controller Pattern
Controllers are objects with async methods:

```typescript
export const UserController = {
  async index(request: Request, response: Response) {
    // Handle request
    return response.inertia("users/index", { users });
  },
  
  async store(request: Request, response: Response) {
    const body = await request.json();
    // Process and return
    return response.redirect("/users");
  }
};

export default UserController;
```

### Validation Pattern
Use Zod schemas in `app/validators/`:

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
```

In controllers:
```typescript
import Validator from "app/services/Validator";
const result = Validator.validate(userSchema, body);
if (!result.success) {
  return response.flash("error", "Validation failed").redirect("/users/create");
}
```

### Database Queries
Use Kysely query builder:

```typescript
import DB from "app/services/DB";

// Select
const users = await DB.selectFrom('users')
  .selectAll()
  .where('email', '=', email)
  .execute();

// Insert
await DB.insertInto('users')
  .values({ name, email, created_at: Date.now() })
  .execute();

// Update
await DB.updateTable('users')
  .set({ name })
  .where('id', '=', id)
  .execute();

// Delete
await DB.deleteFrom('users')
  .where('id', '=', id)
  .execute();
```

### Response Methods
Extended Response methods (defined in `app/services/View.ts`):
- `response.inertia(component, props?, viewProps?)` - Render Inertia page
- `response.view(template, data?)` - Render Eta template
- `response.flash(type, message, ttl?)` - Set flash message
- `response.redirect(url, status?)` - Redirect with optional status

---

## Testing

### Test Structure
- **Unit tests**: `tests/unit/services/` - Test individual services
- **Integration tests**: `tests/integration/` - Test API endpoints
- **E2E tests**: `tests/e2e/` - Full browser tests with Playwright

### Test Database
- Separate SQLite database: `./data/test.sqlite3`
- Configured via `DB_CONNECTION=test`
- Auto-setup in `tests/setup.ts`

### Running Tests
```bash
# Unit/Integration
npm run test:run

# With coverage
npm run test:coverage

# E2E (requires dev server running)
npm run test:e2e
```

### Writing Tests

Unit test example:
```typescript
import { describe, it, expect } from 'vitest';
import Validator from 'app/services/Validator';

describe('Validator', () => {
  it('should validate email', () => {
    const result = Validator.validate(emailSchema, { email: 'test@example.com' });
    expect(result.success).toBe(true);
  });
});
```

---

## CLI Commands

CLI commands are located in `commands/native/` and executed via:
```bash
node laju <command>
```

Available commands:
- `make:controller <name>` - Generate a new controller
- `migrate` - Run migrations
- `migrate:down [count|timestamp]` - Rollback migrations
- `rollback` - Alternative rollback
- `refresh` - Refresh database (drop all, remigrate)
- `tailwind:migrate` - Migrate Tailwind configuration

To create a new command, add a file to `commands/native/` that exports:
```typescript
export default {
  commandName: 'my:command',
  args: [], // Populated by CLI runner
  run() {
    // Command logic
  }
};
```

---

## Security Considerations

### Enabled by Default
- Session-based authentication with cookie expiration
- Rate limiting on auth endpoints (configurable in `routes/web.ts`)
- Input validation via Zod schemas
- SQL injection protection via parameterized queries (Kysely)

### Optional Security (require manual enable)
- **CSRF protection**: Uncomment `csrf()` middleware in `server.ts`
- **Security headers**: Uncomment `securityHeaders()` middleware in `server.ts`
- **HTTPS**: Set `HAS_CERTIFICATE=true` with valid PEM files

### Best Practices
- Never commit `.env` files
- Use strong `BACKUP_ENCRYPTION_KEY` (32 bytes)
- Store uploaded files outside web root
- Validate all user inputs
- Use parameterized queries (never raw SQL concatenation)

---

## Database Migrations

Migration files in `migrations/` follow naming: `YYYYMMDDhhmmss_description.ts`

### ⚠️ CRITICAL: Type Safety with Kysely

**Setiap perubahan di `migrations/` WAJIB diikuti update di `type/db-types.ts`**

Kysely menggunakan type-safe queries. Jika schema database berubah tapi types tidak diupdate, TypeScript akan error.

### Migration Checklist

| Step | File | Action |
|------|------|--------|
| 1 | `migrations/YYYYMMDDhhmmss_*.ts` | Create migration file |
| 2 | `type/db-types.ts` | Add/update table interface |
| 2 | `type/db-types.ts` | Add/update DB interface |
| 2 | `type/db-types.ts` | Add helper types (Selectable, Insertable, Updateable) |
| 3 | - | Run `npm run migrate` |

### Example: Adding New Table

**1. Create Migration:**
```typescript
// migrations/20240220120000_add_todos.ts
export default {
  name: '20240220120000_add_todos',
  
  up: async (DB: Kysely<any>) => {
    await DB.schema
      .createTable('todos')
      .addColumn('id', 'text', col => col.primaryKey())
      .addColumn('user_id', 'text', col => col.notNull().references('users.id'))
      .addColumn('title', 'text', col => col.notNull())
      .addColumn('completed', 'integer', col => col.notNull().default(0))
      .addColumn('created_at', 'integer', col => col.notNull())
      .addColumn('updated_at', 'integer', col => col.notNull())
      .execute();
  },
  
  down: async (DB: Kysely<any>) => {
    await DB.schema.dropTable('todos').execute();
  }
};
```

**2. Update `type/db-types.ts`:**
```typescript
// Add table interface
export interface TodoTable {
  id: string;
  user_id: string;
  title: string;
  completed: number;
  created_at: number;
  updated_at: number;
}

// Add to DB interface
export interface DB {
  // ... existing tables
  todos: TodoTable; // ⭐ NEW
}

// Add helper types
export type Todo = Selectable<TodoTable>;
export type NewTodo = Insertable<TodoTable>;
export type TodoUpdate = Updateable<TodoTable>;
```

**3. Run Migration:**
```bash
npm run migrate
```

### Run Migrations
```bash
npm run migrate              # Up
npm run migrate:down         # Down (last one)
npm run migrate:down 3       # Down (3 migrations)
npm run migrate:down 20230513055909  # Down to specific
```

---

## Deployment

### Docker
```bash
docker build -t laju-app .
docker run -p 5555:5555 -v $(pwd)/data:/app/data laju-app
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Set `DB_CONNECTION=production`
- [ ] Configure real email credentials
- [ ] Set up S3/Wasabi for file storage
- [ ] Enable HTTPS with real certificates
- [ ] Run `npm run build` before starting
- [ ] Run `npm run migrate` on startup
- [ ] Set up log rotation
- [ ] Configure backup encryption key

---

## Multi-Agent Workflow

Project ini menggunakan workflow multi-agent untuk development. Agent files tersedia di `workflow/agents/`.

### Available Agents

| Agent | File | Purpose |
|-------|------|---------|
| Product | `workflow/agents/product.md` | Define requirements, PRD |
| Tech Lead | `workflow/agents/tech-lead.md` | Technical design, architecture |
| Developer | `workflow/agents/developer.md` | Implement code |
| QA | `workflow/agents/qa.md` | Testing & review |
| DevOps | `workflow/agents/devops.md` | Deployment |

### Usage

```
@workflow/agents/product.md

Saya mau bikin fitur [deskripsi fitur]
```

Setiap tahap ada **mandatory review point** - tunggu client approve sebelum lanjut ke agent berikutnya.

### Workflow Flow

```
@workflow/agents/product.md [instruksi]
    ↓
[Client Review: Approve PRD?]
    ↓ YES
@workflow/agents/tech-lead.md [instruksi]
    ↓
[Client Review: Approve Tech Design?]
    ↓ YES
@workflow/agents/developer.md [instruksi]
    ↓
[Client Review: Approve Implementation?]
    ↓ YES
@workflow/agents/qa.md [instruksi]
    ↓
[Client Review: Approve for Deploy?]
    ↓ YES
@workflow/agents/devops.md [instruksi]
    ↓
🎉 DEPLOYED
```

### Resources

- `workflow/README.md` - Workflow overview
- `workflow/examples.md` - Usage scenarios
- `workflow/quick-reference.md` - Cheat sheet

---

## Frontend Pattern

### Using Header Component

Semua protected pages WAJIB menggunakan `Header` component:

```svelte
<script>
  import Header from '../Components/Header.svelte'
</script>

<Header group="home" />

<!-- Content with padding-top to avoid overlap -->
<div class="pt-24">
  <!-- page content -->
</div>
```

**Prop `group`:** Menandai active menu (sesuai dengan `menuLinks` di Header.svelte)

**Exception:** Auth pages (login, register, forgot-password, reset-password) TIDAK pakai Header.

---

## Common Issues & Troubleshooting

### Port Already in Use
Vite port conflict: Vite akan otomatis mencari port yang tersedia
Server port conflict: Change `PORT` in `.env`

### SQLite Database Locked
- Check for concurrent access
- WAL mode is enabled by default
- Busy timeout set to 5 seconds

### Module Resolution
If imports fail:
- Check `tsconfig.json` paths configuration
- Restart TypeScript server
- Run `npm run build` to verify

### Kysely Type Errors
Jika ada error TypeScript saat query database:
- Pastikan `type/db-types.ts` sudah diupdate sesuai migration
- Check interface DB sudah include table baru
- Check helper types (Selectable, Insertable, Updateable) sudah dibuat

---

## Documentation

Full documentation is available in `docs/` directory:

- `01-introduction.md` - Framework overview
- `02-project-structure.md` - Directory layout
- `03-database.md` - Database usage
- `04-routing-controllers.md` - Routes and controllers
- `05-frontend-svelte.md` - Frontend development
- `06-authentication.md` - Auth implementation
- `20-testing.md` - Testing guide
- `21-deployment.md` - Production deployment

Online docs: https://docs.laju.dev/

---

## Key Dependencies

### Production
- `hyper-express` - HTTP server
- `better-sqlite3` - SQLite driver
- `kysely` - Query builder
- `@inertiajs/svelte` - Inertia Svelte adapter
- `svelte` - Frontend framework
- `tailwindcss` - CSS framework
- `zod` - Validation
- `winston` - Logging
- `sharp` - Image processing

### Development
- `vite` - Build tool
- `vitest` - Unit testing
- `@playwright/test` - E2E testing
- `tsx` - TypeScript execution
- `tsc-alias` - Path alias resolution
- `nodemon` - Dev server restart
