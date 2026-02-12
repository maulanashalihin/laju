# Project Initialization Workflow

Setup project baru dengan Laju Framework.

## Scope

**CAN:**
- ✅ Create project infrastructure
- ✅ Create documentation (README, PRD, TDD, PROGRESS, ui-kit, IMPLEMENTATION_BRIEF)
- ✅ Setup design system & layouts
- ✅ Customize auth pages (styling only)
- ✅ Setup database types and migrations (schema only)
- ✅ Git init and first commit
- ✅ **STOP after Step 7 - Wait user approval**

**CANNOT:**
- ❌ **Implement features** - Use TASK_AGENT or ONE_SHOT_AGENT
- ❌ Write business logic code
- ❌ Manage changes after initialization

## Tech Stack

- **Svelte**: v5.41.3 (runes: `$state`, `$props`)
- **Tailwind CSS**: v3.4.17 or v4.x (check package.json)
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

---

## ⬇️ AFTER USER CONFIRMS: Continue Infrastructure Setup

**⚠️ IMPORTANT:** Steps 9-16 are INFRASTRUCTURE SETUP only (types, migrations, design system, layouts).  
**🚫 DO NOT implement any feature from PROGRESS.md here.**  
**✅ Feature implementation is handled by TASK_AGENT or ONE_SHOT_AGENT after init completes.**

---

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

**⚠️ FIRST: Check Tailwind CSS Version**

Check `package.json` to determine Tailwind version:

```bash
# Check tailwindcss version
grep '"tailwindcss"' package.json
```

**If version starts with `^4` (v4):**
- Tailwind CSS 4 uses CSS-first configuration
- Check main CSS file (e.g., `resources/js/app.css` or `resources/js/index.css`):
  - Should have `@import "tailwindcss"` instead of `@tailwind` directives
- Configuration is done in CSS using `@theme` directive:
  ```css
  @import "tailwindcss";
  
  @theme {
    --color-primary-500: #f97316;
    --color-brand-500: #f97316;
    --font-sans: 'Inter', sans-serif;
  }
  
  /* Enable dark mode with class strategy */
  @custom-variant dark {
    &:where(.dark, .dark *) {
      @slot;
    }
  }
  ```
- Dark mode: Uses `dark` variant with `.dark` class (configured above)
- No `tailwind.config.js` needed (or minimal)

**If version starts with `^3` (v3):**
- Uses `tailwind.config.js` for configuration
- CSS file uses `@tailwind` directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Update `tailwind.config.js` with branding from `workflow/PRD.md` and `workflow/ui-kit.html`
- Configure `darkMode: 'class'` in tailwind.config.js

**Dark Mode Setup (REQUIRED for both versions):**

Create `resources/js/Components/DarkModeToggle.svelte`:

```svelte
<script>
import { onMount } from 'svelte';
import { Sun, Moon } from 'lucide-svelte';

let darkMode = $state(false);
let mounted = $state(false);

onMount(() => {
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Check localStorage or fallback to system preference
    const savedMode = localStorage.getItem('darkMode');
    darkMode = savedMode === null ? systemPrefersDark : savedMode === 'true';
    
    // Apply saved preference
    applyDarkMode(darkMode);

    // Add transition class after initial load to prevent flash
    setTimeout(() => {
        document.documentElement.classList.add('transition-colors');
        mounted = true;
    }, 100);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
            darkMode = e.matches;
            applyDarkMode(darkMode);
        }
    });
});

function applyDarkMode(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    applyDarkMode(darkMode);
    localStorage.setItem('darkMode', darkMode);
}
</script>

<button 
    onclick={toggleDarkMode}
    class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
    aria-label="Toggle dark mode"
>
    {#if darkMode}
        <Sun class="w-5 h-5 text-slate-800 dark:text-slate-200" />
    {:else}
        <Moon class="w-5 h-5 text-slate-800 dark:text-slate-200" />
    {/if}
</button>
```

**CSS Configuration:**

**For Tailwind CSS v3** (`tailwind.config.js`):
```javascript
module.exports = {
  darkMode: 'class',
  // ... rest of config
}
```

**For Tailwind CSS v4** (in your CSS file, e.g., `resources/js/index.css`):
```css
@import "tailwindcss";

/* Enable dark mode with class strategy */
@custom-variant dark {
  &:where(.dark, .dark *) {
    @slot;
  }
}
```

**Note:** The `@custom-variant` rule is REQUIRED in Tailwind v4 to enable the `dark:` classes. Without this, dark mode won't work even if the component adds the `.dark` class to `<html>`.

**Implementation Notes:**
- Add DarkModeToggle to Header/Layout component
- ALL pages must use `dark:` classes for dark mode support
- The component persists preference to localStorage
- Falls back to system preference if no saved preference exists

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

### 15. Git Init and First Commit

```bash
git init
git add .
git commit -m "Initial commit: Project setup"
```

### 16. Start Dev Server

```bash
npm run dev
```

**Initialization complete!**

## ⚠️ DO NOT IMPLEMENT FEATURES YET

INIT_AGENT scope ends here. **Infrastructure setup only.**

## Choose Feature Implementation Method

**🔄 HANDOFF:** Now switch to TASK_AGENT or ONE_SHOT_AGENT to implement features from `workflow/PROGRESS.md`.

**Option A: TASK_AGENT** (per feature, multi-tab)
```
"@workflow/TASK_AGENT.md"
```

**Option B: ONE_SHOT_AGENT** (all features, 1 session)
```
"@workflow/ONE_SHOT_AGENT.md"
```

**⚠️ DO NOT start implementing features yourself. Your job is DONE.**

## Important Notes

- **Follow the order** - Don't skip steps
- **Step 8 is MANDATORY** - Wait for user approval
- **Maximize existing** - Check built-in first
- **DO NOT implement features** - Only setup infrastructure and documentation
- **Feature implementation** is handled by TASK_AGENT or ONE_SHOT_AGENT
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
