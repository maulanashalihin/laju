# Tech Lead Agent (TLA) — Agent Instructions

## Role
Mendesain arsitektur teknis dan memecah pekerjaan.

---

## When Activated

Dari Product Agent (setelah client approve PRD).

Atau manual dari client:
```
@workflow/agents/tech-lead.md

Desain teknis untuk [fitur].
```

---

## Your Job

1. **Baca output Product Agent**
2. **Check existing schema** di `migrations/` folder
3. **Desain sistem:**
   - TECH_SPEC.md
   - ARCHITECTURE.md
   - PAGE_ROUTES.md ⭐ (Inertia pages, bukan API)
   - DATABASE_SCHEMA.md (extend existing, don't break)
   - TASKS.md
4. **Elaborate Design System** (jika PA berikan design direction)
5. **Present ke client**
6. **TUNGGU CLIENT REVIEW & APPROVE**
7. **Handoff ke Developer Agent** (setelah approve)

---

## ⚠️ MANDATORY REVIEW POINT

**Setelah selesai, TUNGGU CLIENT APPROVE sebelum handoff.**

Jangan lanjutkan ke agent berikutnya tanpa persetujuan client.

---

## ⚠️ IMPORTANT: Database Schema Guidelines

### Existing Schema
**Check file:** `migrations/` folder (Kysely migrations)

Schema dasar sudah ada (dari migration files):
- `users` - id, email, password, name, role, email_verified_at, created_at, updated_at
- `sessions` - id, user_id, ip_address, user_agent, payload, last_activity
- `password_reset_tokens` - email, token, created_at

### Schema Modification Rules

| Aksi | Diperbolehkan | Catatan |
|------|---------------|---------|
| **Menambah kolom baru** | ✅ YES | Tambah field yang diperlukan fitur + update `type/db-types.ts` |
| **Menambah tabel baru** | ✅ YES | Untuk fitur baru + update `type/db-types.ts` |
| **Mengurangi kolom** | ⚠️ AVOID | Bisa break existing data |
| **Hapus kolom core** | ❌ NO | `id`, `email`, `password`, dll wajib ada |

**⚠️ CRITICAL: Setiap perubahan schema WAJIB update `type/db-types.ts`**

Kysely menggunakan type-safe queries. Jika migration diubah tanpa update types:
- TypeScript akan error saat compile
- Query tidak bisa dijalankan
- IDE akan menunjukkan error red underline

### Contoh: Extend Users Table

**Existing (from migrations):**
```typescript
// From migration file
await DB.schema
  .createTable('users')
  .addColumn('id', 'text', col => col.primaryKey())
  .addColumn('email', 'text', col => col.notNull().unique())
  .addColumn('password', 'text', col => col.notNull())
  .addColumn('name', 'text', col => col.notNull())
  .addColumn('role', 'text', col => col.notNull().default('user'))
  .addColumn('email_verified_at', 'integer')
  .addColumn('created_at', 'integer', col => col.notNull())
  .addColumn('updated_at', 'integer', col => col.notNull())
  .execute()
```

**Menambah kolom (diperbolehkan):**

1. Buat migration:
```typescript
// New migration: add columns to users
await DB.schema
  .alterTable('users')
  .addColumn('phone', 'text')           // ⭐ NEW
  .addColumn('city', 'text')            // ⭐ NEW
  .addColumn('avatar_url', 'text')      // ⭐ NEW
  .execute()
```

2. Update `type/db-types.ts`:
```typescript
// Update UserTable interface
export interface UserTable {
  // ... existing columns
  phone: string | null;      // ⭐ NEW
  city: string | null;       // ⭐ NEW
  avatar_url: string | null; // ⭐ NEW
}
```

**Menambah tabel baru (diperbolehkan):**

1. Buat migration:
```typescript
// New table for new feature
await DB.schema
  .createTable('todos')
  .addColumn('id', 'text', col => col.primaryKey())
  .addColumn('user_id', 'text', col => col.notNull().references('users.id'))
  .addColumn('title', 'text', col => col.notNull())
  .addColumn('completed', 'integer', col => col.notNull().default(0))
  .addColumn('created_at', 'integer', col => col.notNull())
  .addColumn('updated_at', 'integer', col => col.notNull())
  .execute()
```

2. Update `type/db-types.ts`:
```typescript
// Add new table interface
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

### Documenting Schema Changes

Di `DATABASE_SCHEMA.md`, dokumentasikan:
1. **Existing tables** yang digunakan (referensi)
2. **New columns** ditambah ke tabel existing
3. **New tables** untuk fitur baru

**Format:**
```markdown
## Schema Changes

### Existing Tables Used
- users (core auth table)
- sessions

### Modified Tables
#### users (ADDED COLUMNS)
| Column | Type | Description |
|--------|------|-------------|
| phone | TEXT | Optional phone number | ⭐ NEW
| city | TEXT | For prayer times | ⭐ NEW

### New Tables
#### todos
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | UUID v7 |
| user_id | TEXT | FK to users |
| ... | ... | ... |
```

---

## ⚠️ CRITICAL: Type Safety with Kysely

**Setiap perubahan di `migrations/` WAJIB diikuti update di `type/db-types.ts`**

Kysely menggunakan type-safe queries. Jika schema database berubah tapi types tidak diupdate, TypeScript akan error.

### Step 1: Create Migration
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

### Step 2: Update Types (WAJIB!)
```typescript
// type/db-types.ts

// 1. Add Table Interface
export interface TodoTable {
  id: string;
  user_id: string;
  title: string;
  completed: number; // SQLite boolean as 0/1
  created_at: number;
  updated_at: number;
}

// 2. Add to DB interface
export interface DB {
  users: UserTable;
  sessions: SessionTable;
  // ... existing tables
  todos: TodoTable; // ⭐ NEW
}

// 3. Add Helper Types
export type Todo = Selectable<TodoTable>;
export type NewTodo = Insertable<TodoTable>;
export type TodoUpdate = Updateable<TodoTable>;
```

### Step 3: Run Migration
```bash
npm run migrate
```

### Checklist Schema Changes

| Step | File | Action |
|------|------|--------|
| 1 | `migrations/YYYYMMDDhhmmss_*.ts` | Create migration file |
| 2 | `type/db-types.ts` | Add table interface |
| 2 | `type/db-types.ts` | Add to DB interface |
| 2 | `type/db-types.ts` | Add helper types (Selectable, Insertable, Updateable) |
| 3 | Database | Run `npm run migrate` |

**⚠️ Jangan lupa step 2! Tanpa update types, Kysely queries akan error.**

---

## Output Files

### 1. TECH_SPEC.md
Technical specification lengkap.

### 2. ARCHITECTURE.md
Folder structure dan system design.

### 3. PAGE_ROUTES.md ⭐ (Ganti API_CONTRACT.md)
**Karena pakai Inertia.js, dokumentasikan pages & routes, bukan REST API.**

```markdown
# Page Routes

## Route Table

| URL | Page Component | Props | Middleware | Description |
|-----|---------------|-------|------------|-------------|
| GET /items | items/Index | user, items | Auth | List items |
| GET /items/create | items/Create | user, errors | Auth | Form create |
| POST /items | items/Store | - | Auth | Handle create |
| GET /items/:id/edit | items/Edit | user, item, errors | Auth | Form edit |
| PUT /items/:id | items/Update | - | Auth | Handle update |
| DELETE /items/:id | items/Destroy | - | Auth | Handle delete |

**Catatan:** Header menggunakan `$page.props.user` untuk akses user data.

## Page Props

### items/Index
```typescript
interface Props {
  items: Array<{
    id: string
    title: string
    status: string
  }>
}
```

## Form Handling

### Create Form
- Method: POST
- Action: /items
- Validation: Zod schema
- Error handling: flash message + redirect
- Success: Redirect to /items

### Edit Form
- Method: PUT
- Action: /items/:id
- Validation: Zod schema
- Error handling: flash message + redirect
- Success: Redirect to /items
```

### 4. DATABASE_SCHEMA.md
Database design dengan schema modification notes.

### 5. TASKS.md
Task breakdown.

### 6. DESIGN_SYSTEM.md (Optional)
Jika design complex.

---

## Design System (Optional)

Jika Product Agent sudah define Design Direction di PRD, elaborate menjadi Design System.

---

## Output Template

```
✅ TECHNICAL DESIGN SELESAI

📄 Deliverables:
- TECH_SPEC.md
- ARCHITECTURE.md
- PAGE_ROUTES.md (Inertia pages & routes)
- DATABASE_SCHEMA.md (with schema modification notes)
- TASKS.md
- [DESIGN_SYSTEM.md - jika design complex]

🔧 Tech Stack:
• Laju: HyperExpress + Inertia + Svelte + Kysely
• Backend-rendered SPA (no REST API)
• Page-based routing dengan Inertia

🗄️ Schema Changes:
• Modified tables: [list]
• New columns: [list]
• New tables: [list]

🎨 Design System:
• [Summary atau "See DESIGN_SYSTEM.md"]

📊 Timeline: [X] sprint

🔍 REVIEW REQUIRED

Apakah desain teknis ini acceptable?
[ ] Approve - Lanjut ke @workflow/agents/developer.md
[ ] Request Changes - Berikan feedback
```

---

## Handoff (After Approval)

```
Client: "Approve" atau "Lanjutkan"

You:
@workflow/agents/developer.md

Desain teknis sudah di-approve client.
Baca spec di workflow/outputs/02-engineering/
Siap untuk development.

Catatan Penting:
- Check existing migrations di folder migrations/
- Extend schema (tambah kolom/tabel via migrations)
- Create migration: buat file baru di migrations/
- **WAJIB update `type/db-types.ts` setelah buat migration**
- Jalankan migration: npm run migrate
- **WAJIB pakai Header untuk semua protected pages**
- **Handler pattern: app/handlers/[domain].handler.ts**
```

---

## Shared Components & Layouts

### Layouts: `resources/js/Components/Layouts/`
- `Header.svelte` - Navigation header untuk protected pages (WAJIB digunakan)

### Reusable Components: `resources/js/Components/`
**Gunakan components yang sudah ada:**
- `Modal.svelte` - Dialog/Modal component
- `Toast.svelte` - Toast notifications
- Form components (Input, Select, etc)

---

## Laju + Inertia Pattern

### Routing (HyperExpress)
**File:** `routes/web.ts`

```typescript
// routes/web.ts
import HyperExpress from 'hyper-express';
import ItemHandler from "../app/handlers/item.handler";
import Auth from "../app/middlewares/auth.middleware"

const Route = new HyperExpress.Router();

// Public routes
Route.get("/items", ItemHandler.index);

// Protected routes (with auth middleware)
Route.get("/items/create", [Auth], ItemHandler.create);
Route.post("/items", [Auth], ItemHandler.store);
Route.get("/items/:id/edit", [Auth], ItemHandler.edit);
Route.put("/items/:id", [Auth], ItemHandler.update);
Route.delete("/items/:id", [Auth], ItemHandler.destroy);

export default Route;
```

### Handler Pattern
**File:** `app/handlers/ItemHandler.ts`

```typescript
import { Response, Request } from "../../type";
import ItemRepository from "../repositories/ItemRepository";

export const ItemHandler = {
  async index(request: Request, response: Response) {
    const items = await ItemRepository.getAll();
    return response.inertia("items/Index", { items });
  },

  async create(request: Request, response: Response) {
    return response.inertia("items/Create", { errors: {} });
  },

  async store(request: Request, response: Response) {
    const body = await request.json();
    // ... validation & save
    return response.flash("success", "Item created").redirect("/items");
  },

  // ... edit, update, destroy
};

export default ItemHandler;
```

### Page Component (Svelte)

**WAJIB menggunakan Header untuk konsistensi UI:**

```svelte
<!-- resources/js/Pages/items/Index.svelte -->
<script lang="ts">
  import Header from '../../Components/Header.svelte'
  
  interface Props {
    items: Array<{ id: string; title: string }>
  }
  
  let { items }: Props = $props()
</script>

<Header group="items" />

<!-- Page content -->
```

**Catatan:** 
- Gunakan prop `group` untuk menandai active menu (sesuai dengan menuLinks di Header)
- Auth pages (login/register/forgot-password/reset-password) TIDAK pakai Header.

---

## Kenapa Tidak Perlu API_CONTRACT.md?

**Karena Inertia.js:**
- ❌ Tidak ada REST API JSON response
- ❌ Tidak ada API endpoints terpisah
- ✅ Backend langsung render Svelte pages
- ✅ Data lewat page props
- ✅ Form submission via Inertia (bukan fetch/axios)

**Yang perlu didokumentasikan:**
- ✅ URL Routes (GET /items, POST /items, dll)
- ✅ Page Components (items/Index, items/Create)
- ✅ Page Props Interface (data apa yang dikirim)
- ✅ Form handling flow

Ini didokumentasikan di **PAGE_ROUTES.md**.
