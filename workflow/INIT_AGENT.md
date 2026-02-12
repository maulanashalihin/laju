# Project Initialization Workflow

Setup project baru dengan Laju Framework.

## Scope

**CAN:**
- ✅ Create project infrastructure
- ✅ Setup GitHub Actions workflow
- ✅ Create documentation (README, PRD, TDD, PROGRESS, ui-kit, IMPLEMENTATION_BRIEF)
- ✅ Setup design system & layouts
- ✅ Customize auth pages
- ✅ Git init and first commit
- ✅ **STOP after Step 7 - Wait user approval**

**CANNOT:**
- ❌ Implement features or write code
- ❌ Manage changes after initialization

## Tech Stack

- **Svelte**: v5.41.3 (runes: `$state`, `$props`)
- **Tailwind CSS**: v3.4.17
- **Inertia.js**: v2.2.10
- **TypeScript**: v5.6.3 (backend)
- **HyperExpress**: v6.17.3
- **Database**: **better-sqlite3** v12.4.1 (SQLite)
- **Query Builder**: Kysely v0.28.10
- **Zod**: v4.3.5 (validation)
- **Lucide Icons**: Default icon library

> ⚠️ **IMPORTANT**: Project ini menggunakan **SQLite** (better-sqlite3), BUKAN PostgreSQL atau database lain.

## Initialization Steps

### 1. Initialize Project

Create new Laju project.

### 2. Create README.md

Ask user for:
- Project name
- Description
- Main features

Include: Overview, quick start, tech stack, feature list.

### 3. Create workflow/PRD.md

Product Requirements:
- Objectives and goals
- Feature list
- Success criteria
- **Design specs** (colors, typography, branding)

### 4. Create workflow/TDD.md

Technical Design:
- Architecture & system design
- Database schema
- API endpoints
- Security considerations

### 5. Create workflow/ui-kit.html

UI Design System:
- Color palette & tokens
- Typography styles
- Button & form styles
- Card & layout patterns

### 6. Create workflow/PROGRESS.md

Development tracking template:

```markdown
# Development Progress

## Completed
- [x] Initial setup
- [x] README.md created
- [x] workflow/PRD.md created
- [x] workflow/TDD.md created
- [x] workflow/ui-kit.html created
- [x] workflow/PROGRESS.md created

## In Progress
- [ ] Feature 1

## Pending
- [ ] Feature 2

## Features

### [Feature Name]
- [ ] Pages: index.svelte, form.svelte
- [ ] Controller: [Feature]Controller
- [ ] Routes: GET/POST/PUT/DELETE /[feature]
- [ ] Validator: [Feature]Validator

## Database Types
### Completed
- [ ] type/db-types.ts updated

### Pending
- [ ] New table interfaces

## Migrations
### Completed
- [ ] migration_name

### Pending
- [ ] migration_name
```

### 7. Create workflow/IMPLEMENTATION_BRIEF.md

Execution summary for agents:

```markdown
# IMPLEMENTATION_BRIEF.md

## Project: [project_name]
## Generated: [timestamp]

## Status
🔴 PENDING - Waiting for features definition

## Priority Queue
<!-- From PROGRESS.md -->
None yet.

## Tech Stack Summary
<!-- From TDD.md -->
- Frontend: Svelte 5 + Inertia
- Backend: HyperExpress
- Database: **better-sqlite3** (SQLite)

## UI Essentials
<!-- From ui-kit.html -->
- Primary: [color]
- Icons: Lucide
- Pattern: Single form for CRUD

## Quick Reminders
- Check existing controllers first
- Use DashboardLayout for admin
- Commit after user confirms
```

### 8. Review Documentation ⛔ MANDATORY STOP

**Files to review:**
1. `README.md` - Project overview
2. `workflow/PRD.md` - Requirements & design
3. `workflow/TDD.md` - Technical design
4. `workflow/ui-kit.html` - UI system
5. `workflow/PROGRESS.md` - Feature tracking
6. `workflow/IMPLEMENTATION_BRIEF.md` - Execution summary

**Ask user:**
```
## 📋 Review Required

Please review these files:
- README.md
- workflow/PRD.md
- workflow/TDD.md
- workflow/ui-kit.html
- workflow/PROGRESS.md
- workflow/IMPLEMENTATION_BRIEF.md

Reply "Lanjutkan" or tell me what to change.

⛔ I will wait for your confirmation before continuing.
```

**⛔ STOP - DO NOT PROCEED UNTIL USER CONFIRMS ⛔**

### 9. Update Database Types

Based on `workflow/TDD.md` database schema, update `type/db-types.ts` BEFORE creating migrations.

**Why?** Kysely is type-safe. Types must exist before migrations can use them.

**Pattern:**
```typescript
// type/db-types.ts - Add new table interface
export interface PostTable {
  id: string;
  title: string;
  content?: string;
  user_id: string;
  status: 'draft' | 'published' | 'archived';
  created_at: number;
  updated_at?: number;
}

// Add to DB interface
export interface DB {
  users: UserTable;
  sessions: SessionTable;
  // ... existing tables
  posts: PostTable;  // <-- Add new table
}

// Helper types
export type Post = Selectable<PostTable>;
export type NewPost = Insertable<PostTable>;
export type PostUpdate = Updateable<PostTable>;
```

### 10. Create Migrations

Create migration files in `migrations/` folder.

**Migration template:**
```typescript
import { Kysely } from "kysely";
import { DB } from "../type/db-types";  // Use proper types

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("posts")
    .addColumn("id", "text", (col) => col.primaryKey().notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("content", "text")
    .addColumn("user_id", "text", (col) => col.notNull().references("users.id"))
    .addColumn("status", "text", (col) => col.notNull().defaultTo("draft"))
    .addColumn("created_at", "integer", (col) => col.notNull())
    .addColumn("updated_at", "integer")
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("posts").execute();
}
```

### 11. Run Migrations

```bash
npm run migrate
```

### 12. Setup Design System

Update `tailwind.config.js` with branding from `workflow/PRD.md` and `workflow/ui-kit.html`.

**Dark Mode Setup (REQUIRED):**
- Configure `darkMode: 'class'` in tailwind.config.js
- Create DarkModeToggle component
- Add to Header/Layout
- Persist preference to localStorage
- ALL components must use `dark:` classes

### 13. Create Layout Components

Create in `resources/js/Components/Layouts/`:
- Use design system from `workflow/ui-kit.html`
- **Use group-based navigation pattern**

**Quick Pattern:**
```svelte
<script>
  let { group } = $props();
  const nav = [
    { name: 'Dashboard', href: '/dashboard', group: 'dashboard' },
  ];
</script>

{#each nav as item}
  <a class={item.group === group ? 'active' : ''} href={item.href}>
    {item.name}
  </a>
{/each}
```

### 14. Customize Auth Pages

Update built-in auth pages to match `workflow/ui-kit.html`:
- `resources/js/Pages/auth/login.svelte`
- `resources/js/Pages/auth/register.svelte`
- `resources/js/Pages/auth/forgot-password.svelte`
- `resources/js/Pages/auth/reset-password.svelte`

**IMPORTANT: All auth pages MUST support dark mode** using `dark:` classes.

### 15. Setup GitHub Actions

```bash
cp -r github-workflow-sample/workflows .github/
```

**Setup secrets:**
- `SSH_HOST` - Server IP
- `SSH_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key
- `SLACK_WEBHOOK` - (Optional)

### 16. Git Init and First Commit

```bash
git init
git add .
git commit -m "Initial commit: Project setup"
```

### 17. Start Dev Server

```bash
npm run dev
```

**Initialization complete!**

## Choose Implementation Method

**Option A: TASK_AGENT** (per feature, multi-tab)
```
"@workflow/TASK_AGENT.md"
```

**Option B: ONE_SHOT_AGENT** (all features, 1 session)
```
"@workflow/ONE_SHOT_AGENT.md"
```

## Important Notes

- **Follow the order** - Don't skip steps
- **Step 8 is MANDATORY** - Wait for user approval
- **Maximize existing** - Check built-in first
- **Default PORT**: 5555

## API Guidelines

| Use | For |
|-----|-----|
| **Inertia Router** | Page navigation, form + redirect, state changes |
| **Fetch API** | Stay-on-page actions, AJAX, modals, live search |

## Built-in Functionality

**Controllers:** PublicController, LoginController, RegisterController, PasswordController, ProfileController, OAuthController, UploadController, StorageController

**Services:** Authenticate, Validator, DB, CacheService, Mailer, RateLimiter

**Middlewares:** auth, inertia, rateLimit, securityHeaders

**Auth Pages:** login.svelte, register.svelte, forgot-password.svelte, reset-password.svelte

**Rule:** Use/modify existing before creating new.

## File Upload Pattern

Store **URL** in database, not `asset_id`:

```typescript
// Migration
.addColumn('thumbnail', 'text')  // Store URL
```

See `skills/file-upload-pattern.md` for complete guide.

## References

- `skills/create-controller.md`
- `skills/hyper-express.md`
- `skills/create-svelte-inertia-page.md`
- `skills/feature-implementation-patterns.md`
- `skills/file-upload-pattern.md`
- `skills/kysely.md`

## Next Steps

1. Implement features per `workflow/PROGRESS.md`
2. Use `IMPLEMENTATION_BRIEF.md` for quick reference
3. Update `PROGRESS.md` after each feature
