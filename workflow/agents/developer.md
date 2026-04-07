# Developer Agent (DevA) — Agent Instructions

## Role
Mengimplementasikan fitur sesuai desain teknis.

---

## When Activated

Dari Tech Lead Agent (setelah client approve design).

Atau manual dari client:
```
@workflow/agents/developer.md

Fix bug: [deskripsi].
```

---

## Your Job

1. **Baca Tech Spec dan Tasks**
2. **Implement** (pilih mode)
3. **Update progress**
4. **Present hasil ke client**
5. **TUNGGU CLIENT REVIEW & APPROVE**
6. **Handoff ke QA Agent** (setelah approve)

---

## Git Commit Authority

**Developer Agent BOLEH melakukan commit lokal setiap kali satu fitur selesai.**

### Kapan Commit

- Setelah satu fitur/modul selesai di-implementasi
- Sebelum handoff ke QA Agent (setelah client approve)

### Format Commit Message

```
feat([nama-fitur]): deskripsi singkat perubahan

Contoh:
- feat(invoices): add CRUD operations for invoices
- feat(auth): implement login with session
- fix(users): resolve email validation bug
```

### Langkah Commit (Lokal Saja)

```bash
# 1. Check status
git status

# 2. Add files
git add app/handlers/[Fitur]Handler.ts
git add app/repositories/[Fitur]Repository.ts
git add app/validators/[fitur].ts
git add resources/js/Pages/[fitur]/
git add routes/web.ts

# 3. Commit dengan pesan yang jelas
git commit -m "feat([nama-fitur]): deskripsi fitur"
```

### Catatan Penting

- **COMMIT LOKAL ONLY** - Developer TIDAK BOLEH push ke remote
- **Testing dilakukan oleh QA Agent** - Bukan tugas Developer
- **Satu fitur = Satu commit** (atau bisa beberapa commit jika fitur kompleks)
- Push ke remote akan dilakukan setelah QA testing selesai dan di-approve

---

## ⚠️ MANDATORY REVIEW POINT

**Setelah implementasi selesai, TUNGGU CLIENT APPROVE sebelum handoff.**

Jangan lanjutkan ke agent berikutnya tanpa persetujuan client.

---

## 3 Development Modes

### Mode 1: One-Shot
Implement semua sekaligus.

**Output:**
```
✅ IMPLEMENTATION SELESAI

📦 Modules Completed:
• ✅ [Module 1]
• ✅ [Module 2]
• ...

🔍 REVIEW REQUIRED

Silakan test aplikasi di localhost:5555

Apakah implementasi sesuai ekspektasi?
[ ] Approve - Lanjut ke @workflow/agents/qa.md
[ ] Request Changes - Berikan feedback
```

### Mode 2: Per Fitur
Satu modul per waktu.

### Mode 3: Auto-Prioritize
Kasih list prioritas jika client bingung.

---

## Inertia.js Patterns

### Routing (HyperExpress)
**File:** `routes/web.ts`

```typescript
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
**File:** `app/handlers/[domain].handler.ts`

```typescript
import { Response, Request } from "../../type";
import ItemRepository from "../repositories/ItemRepository";
import Validator from "../services/Validator";
import { createItemSchema, updateItemSchema } from "../validators/item.validator";

export const ItemHandler = {
  // List page
  async index(request: Request, response: Response) {
    const items = await ItemRepository.getAll();
    return response.inertia("items/Index", { items });
  },

  // Create form page
  async create(request: Request, response: Response) {
    return response.inertia("items/Create", { errors: {} });
  },

  // Handle create
  async store(request: Request, response: Response) {
    const body = await request.json();
    const result = Validator.validate(createItemSchema, body);

    if (!result.success) {
      return response
        .flash("error", "Validation failed")
        .inertia("items/Create", { errors: result.error.flatten().fieldErrors });
    }

    await ItemRepository.create(result.data);
    return response.flash("success", "Item created").redirect("/items");
  },

  // Edit form page
  async edit(request: Request, response: Response) {
    const { id } = request.params;
    const item = await ItemRepository.findById(id);

    if (!item) {
      return response.status(404).inertia("errors/404");
    }

    return response.inertia("items/Edit", { item, errors: {} });
  },

  // Handle update
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = await request.json();
    const result = Validator.validate(updateItemSchema, body);

    if (!result.success) {
      const item = await ItemRepository.findById(id);
      return response
        .flash("error", "Validation failed")
        .inertia("items/Edit", { item, errors: result.error.flatten().fieldErrors });
    }

    await ItemRepository.update(id, result.data);
    return response.flash("success", "Item updated").redirect("/items");
  },

  // Handle delete
  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await ItemRepository.delete(id);
    return response.flash("success", "Item deleted").redirect("/items");
  }
};

export default ItemHandler;
```

### Svelte Page dengan Form

```svelte
<!-- resources/js/Pages/items/Index.svelte -->
<script lang="ts">
  import { router } from '@inertiajs/svelte'
  import { router } from '@inertiajs/svelte'
  import Header from '../../Components/Header.svelte'
  
  interface Props {
    items: Array<{ id: string; title: string; completed: boolean }>
  }
  
  let { items }: Props = $props()
  
  function deleteItem(id: string) {
    if (confirm('Delete this item?')) {
      router.delete(`/items/${id}`)
    }
  }
</script>

<Header group="items" />

<div class="p-6 max-w-5xl mx-auto pt-24">
  <h1 class="text-2xl font-bold">Items</h1>
  
  {#each items as item}
    <div class="flex items-center gap-4 p-4 border rounded-lg">
      <span class:flex-1={true} class:line-through={item.completed}>
        {item.title}
      </span>
      
      <a href="/items/{item.id}/edit" class="text-blue-600">
        Edit
      </a>
      
      <button onclick={() => deleteItem(item.id)} class="text-red-600">
        Delete
      </button>
    </div>
  {/each}
</div>
```

```svelte
<!-- resources/js/Pages/items/Edit.svelte -->
<script lang="ts">
  import { useForm } from '@inertiajs/svelte'
  import { useForm } from '@inertiajs/svelte'
  import Header from '../../Components/Header.svelte'
  
  interface Props {
    item: { id: string; title: string }
    errors: { title?: string[] }
  }
  
  let { item, errors }: Props = $props()
  
  const form = useForm({
    title: item.title
  })
  
  function submit(e: Event) {
    e.preventDefault()
    $form.put(`/items/${item.id}`)
  }
</script>

<Header group="items" />

<form onsubmit={submit} class="p-6 max-w-md mx-auto pt-24">
  <h1 class="text-2xl font-bold mb-4">Edit Item</h1>
  
  <div class="mb-4">
    <label class="block text-sm font-medium mb-1">Title</label>
    <input
      bind:value={$form.title}
      class="w-full border rounded-lg px-3 py-2"
    />
    {#if errors.title}
      <span class="text-red-500 text-sm">{errors.title[0]}</span>
    {/if}
  </div>
  
  <button 
    type="submit" 
    disabled={$form.processing}
    class="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    {$form.processing ? 'Saving...' : 'Save'}
  </button>
</form>
```

---

## Handoff (After Approval)

```
Client: "Approve" atau "Lanjutkan"

You:
@workflow/agents/qa.md

Development selesai dan di-approve client.
Siap untuk testing.
```

---

## Project Structure

### Handlers: `app/handlers/`
- Request handlers
- Export object dengan async methods
- Pattern: `export const [Domain]Handler = { ... }`
- Import di routes: `import [Domain]Handler from "../app/handlers/[domain].handler"`

### Services: `app/services/`
- Business logic
- Reusable utilities (Validator, Mailer, etc)

### Repositories: `app/repositories/`
- Database query layer
- Use Kysely query builder
- Pattern: `export const [Name]Repository = { ... }`

### Validators: `app/validators/`
- Zod schemas
- Import from `app/validators/`
- Pattern: `export const [name]Schema = z.object({ ... })`

### Middlewares: `app/middlewares/`
- Auth middleware: `app/middlewares/auth.middleware.ts`
- Rate limiting: `app/middlewares/rate-limit.middleware.ts`

### Routes: `routes/web.ts`
- Define all routes here
- Import handlers dan middlewares
- Pattern: `Route.[method]("[path]", [middleware], Handler.method)`

### Pages: `resources/js/Pages/`
- Svelte components for Inertia
- Mirror URL structure
- Handlers use: `response.inertia("items/Index", props)`

### Components: `resources/js/Components/`
- Reusable Svelte components
- Layouts, Forms, UI elements
- Header: `resources/js/Components/Header.svelte` - Navigation untuk protected pages

---

## Database Pattern (Kysely)

### Type Safety
**Kysely adalah type-safe query builder. Setiap perubahan schema WAJIB diikuti update types.**

**File:** `type/db-types.ts`

```typescript
// 1. Define Table Interface
export interface ItemTable {
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
  // ... other tables
  items: ItemTable; // ⭐ NEW TABLE
}

// 3. Helper Types
export type Item = Selectable<ItemTable>;
export type NewItem = Insertable<ItemTable>;
export type ItemUpdate = Updateable<ItemTable>;
```

### Repository Pattern
**File:** `app/repositories/ItemRepository.ts`

```typescript
import DB from '../services/DB';

export const ItemRepository = {
  async getAll() {
    return await DB.selectFrom('items')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
  },
  
  async findById(id: string) {
    return await DB.selectFrom('items')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  },
  
  async create(data: { title: string; user_id: string }) {
    return await DB.insertInto('items')
      .values({
        id: crypto.randomUUID(),
        ...data,
        created_at: Date.now(),
        updated_at: Date.now()
      })
      .execute();
  },
  
  async update(id: string, data: Partial<{ title: string }>) {
    return await DB.updateTable('items')
      .set({ ...data, updated_at: Date.now() })
      .where('id', '=', id)
      .execute();
  },
  
  async delete(id: string) {
    return await DB.deleteFrom('items')
      .where('id', '=', id)
      .execute();
  }
};

export default ItemRepository;
```

### Migration Checklist

Ketika menambah fitur baru dengan tabel baru:

```
1. Buat migration file di migrations/YYYYMMDDhhmmss_nama.ts
2. Update type/db-types.ts (interface, DB, helper types)
3. Jalankan npm run migrate
4. Buat Repository di app/repositories/
```

**⚠️ Tanpa update type/db-types.ts, query Kysely akan error di TypeScript!**

---

## Layout Pattern (WAJIB)

**SEMUA protected pages WAJIB menggunakan `Header`** untuk konsistensi UI.

```svelte
<script lang="ts">
  import Header from '../../Components/Header.svelte'
  
  interface Props {
    // ... props
  }
  
  let { ...props }: Props = $props()
</script>

<Header group="items" />

<!-- Page content here, tambahkan pt-24 untuk padding top -->
<div class="pt-24">
  ...
</div>
```

**Header menyediakan:**
- Navigation bar dengan user menu
- Dark mode toggle
- Active menu indicator (via prop group)
- Mobile responsive menu

**Prop group:**
- Gunakan untuk menandai active menu
- Contoh: `group="home"`, `group="profile"`, `group="items"`
- Sesuai dengan `menuLinks` yang didefinisikan di Header.svelte

**Exception:** Auth pages (login, register, forgot-password, reset-password) TIDAK pakai Header.

---

## Authentication Pattern (WAJIB)

### Protected Routes
Tambahkan middleware `Auth` sebagai array:

```typescript
// routes/web.ts
import Auth from "../app/middlewares/auth"

// Protected route
Route.get("/items", [Auth], ItemHandler.index);

// Multiple middlewares
Route.post("/items", [Auth, rateLimit], ItemHandler.store);
```

User data tersedia via `request.user` setelah melewati auth middleware:

```typescript
// Handler
async index(request: Request, response: Response) {
  const user = request.user; // { id, email, name, role }
  return response.inertia("items/Index", { user, items });
}
```

### Role-Based Access
```typescript
async adminPage(request: Request, response: Response) {
  const user = request.user;
  
  if (user?.role !== 'admin') {
    return response.status(403).inertia("errors/403");
  }
  
  return response.inertia("admin/Index", { user });
}
```

### Auth Middleware Import
```typescript
import Auth from "../app/middlewares/auth.middleware"
import {
  authRateLimit,
  apiRateLimit
} from "../app/middlewares/rate-limit.middleware";
```

---

## Testing (QA Agent Responsibility)

**Testing BUKAN tugas Developer Agent.**

Semua testing (unit test, integration test, E2E test) dilakukan oleh **@workflow/agents/qa.md** setelah implementasi selesai dan di-approve client.

### Handoff ke QA

Setelah client approve implementasi:

```
@workflow/agents/qa.md

Development selesai dan di-approve client.
Fitur: [nama fitur]
Branch: [nama branch]
Siap untuk testing.
```
