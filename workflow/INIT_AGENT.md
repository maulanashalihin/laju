# Project Initialization Workflow

Panduan lengkap untuk memulai project baru dengan Laju Framework.

## Tech Stack

- **Svelte**: v5.41.3 (with runes `$state`, `$props`)
- **Tailwind CSS**: v3.4.17
- **Inertia.js**: v2.2.10
- **Vite**: v5.4.10
- **TypeScript**: v5.6.3 (backend only)
- **HyperExpress**: v6.17.3 (backend server)
- **Knex**: v3.1.0 (database query builder)
- **better-sqlite3**: v12.4.1 (SQLite database driver)
- **Zod**: v4.3.5 (validation)
- **Lucide Icons**: Default icon library for laju.dev

## Initialization Steps

Ikuti urutan ini saat memulai project baru:

### 1. Initialize Project

Buat project Laju baru.

### 2. Create/Replace README.md

Tanyakan user untuk:
- Nama project
- Deskripsi project
- Fitur utama

Buat `README.md` dengan konten:
- Nama dan deskripsi project
- Quick start guide (installation, usage)
- Tech stack
- List fitur

### 3. Create workflow/PRD.md

Dokumen Product Requirements yang berisi:
- Objectives dan goals
- List fitur
- Success criteria
- **Design specifications** (branding colors, typography, design system, visual identity)

### 4. Create workflow/TDD.md

Dokumen Technical Design yang berisi:
- Technical architecture dan system design
- Database schema dan relationships
- API endpoints dan routes
- Data models dan flow
- Security considerations
- Technical specifications dari PRD.md

### 5. Create workflow/ui-kit.html

Dokumen UI Design System yang berisi:
- Color palette dan theme tokens
- Typography styles (headings, body text)
- Button styles dan variants
- Form input styles
- Card dan container styles
- Status badges dan feedback components
- Layout patterns dan spacing
- Icon usage guidelines

### 6. Create workflow/PROGRESS.md

Template tracking development yang mendukung concurrent work oleh multiple agents:

**PENTING: Struktur PROGRESS.md harus memungkinkan beberapa agent bekerja secara paralel tanpa blocking.**

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

---

## Concurrent Work Guidelines

**Prinsip untuk concurrent work:**
1. **Independent Features** - Fitur yang tidak bergantung satu sama lain bisa dikerjakan paralel
2. **No Blocking** - Tidak perlu tunggu satu fitur selesai untuk mulai fitur lain
3. **Free to Claim** - Siapapun bisa claim dan kerjakan task yang available
4. **Status Tracking** - Setiap sub-task punya status sendiri

---

## Features

### Posts System
**Status:** 🟡 In Progress

- [ ] Migration: create_posts_table
- [ ] Controller: PostController (index, create, store, edit, update, destroy)
- [ ] Pages: index.svelte, form.svelte
- [ ] Routes: GET /posts, GET /posts/create, POST /posts, GET /posts/:id/edit, PUT /posts/:id, DELETE /posts/:id
- [ ] Validation: PostValidator.ts

### Users Management
**Status:** 🔵 Pending

- [ ] Migration: modify_users_table (add fields if needed)
- [ ] Controller: UserController (index, create, store, edit, update, destroy)
- [ ] Pages: index.svelte, form.svelte
- [ ] Routes: GET /users, GET /users/create, POST /users, GET /users/:id/edit, PUT /users/:id, DELETE /users/:id
- [ ] Validation: UserValidator.ts

### Comments System
**Status:** 🔵 Pending

- [ ] Migration: create_comments_table
- [ ] Controller: CommentController (index, create, store, destroy)
- [ ] Pages: form.svelte (embedded in posts)
- [ ] Routes: POST /posts/:id/comments, DELETE /comments/:id
- [ ] Validation: CommentValidator.ts

### [Feature Name]
**Status:** 🔵 Pending

- [ ] Migration: migration_name
- [ ] Controller: [Feature]Controller (methods)
- [ ] Pages: page_name.svelte
- [ ] Routes: route definitions
- [ ] Validation: [Feature]Validator.ts

---

## Migrations

### Completed
- [ ] create_posts_table
- [ ] modify_users_table
- [ ] create_comments_table

### Pending
- [ ] migration_name

---

## Dependencies

**Catat dependencies antar-fitur untuk menghindari blocking:**

- Posts System ← No dependencies (bisa dikerjakan duluan)
- Users Management ← No dependencies (bisa dikerjakan paralel dengan Posts)
- Comments System ← Depends on: Posts System (butuh posts.id untuk foreign key)
- [Feature] ← Depends on: [Other Feature]
```

**Tips untuk concurrent work:**
- Group tasks berdasarkan feature yang independent
- Setiap feature punya status sendiri (🟢 Done, 🟡 In Progress, 🔵 Pending)
- Update status saat mulai/selesai kerjakan feature
- Tandai dependencies jelas untuk menghindari conflict
- Jika ada conflict di file yang sama, gunakan git branch
- Siapapun bisa claim task yang available dan langsung kerjakan


### 7. Review Documentation

Minta user review dan approve:
- `README.md` - Project overview, features, tech stack
- `workflow/PRD.md` - Requirements, design specifications
- `workflow/TDD.md` - Technical design document (architecture, database, API)
- `workflow/ui-kit.html` - UI design system dan components
- `workflow/PROGRESS.md` - Development tracking template

**Tunggu konfirmasi user sebelum melanjutkan ke step berikutnya**


### 8. Create Migrations

Buat migration files untuk database schema berdasarkan `workflow/TDD.md`.

### 9. Run Migrations

```bash
npx knex migrate:latest
```

### 10. Setup Design System

Konfigurasi theme:
- Update `tailwind.config.js` dengan branding colors, typography, dan design tokens dari `workflow/PRD.md` dan `workflow/ui-kit.html`
- Import Tailwind directives di `resources/js/index.css`



### 11. Create DashboardLayout Component

Buat `resources/js/Components/DashboardLayout.svelte`:
- secara konsep, kamu bisa tiru amati dan modifikasi dari `resources/js/Components/Header.svelte`
- Ikuti design system dari `workflow/ui-kit.html`
- Gunakan sebagai main layout untuk aplikasi
- Include header, sidebar, dan main content area
- Apply branding colors, typography, dan design tokens dari PRD.md

### 12. Customize Built-in Auth Pages

Update built-in auth pages untuk match design system dari `workflow/ui-kit.html`:

- `resources/js/Pages/auth/login.svelte` - Sesuaikan dengan branding colors, typography, dan design tokens
- `resources/js/Pages/auth/register.svelte` - Gunakan components dari ui-kit.html
- `resources/js/Pages/auth/forgot-password.svelte` - Apply visual identity dari PRD.md
- `resources/js/Pages/auth/reset-password.svelte` - Ikuti layout patterns dari ui-kit.html

**Gunakan DashboardLayout atau AuthLayout** yang sudah dibuat di step 9 untuk konsistensi.

### 13. Git Init and First Commit

```bash
git init
git add .
git commit -m "Initial commit: Project setup"
```

### 14. Start Dev Server

```bash
npm run dev
```

### 15. Complete Initialization

**Proses INIT AGENT selesai!**

Setelah dev server berjalan dengan baik:
1. Tutup session ini
2. Buka session baru dan mulai dengan: **"Hai @[workflow/TASK_AGENT.md] yuk kita kerja"**
3. Lanjutkan implementasi fitur sesuai `workflow/PROGRESS.md`

## Important Notes

- **Selalu ikuti urutan ini** - Jangan skip steps
- **Tunggu approval user** sebelum melanjutkan setelah step 8 (Review Documentation)
- **Gunakan built-in functionality** - Cek dulu apakah controller/page/service sudah ada sebelum membuat baru
- **Test sebelum commit** - Pastikan semua berjalan dengan baik sebelum commit
- **Default PORT** - laju.dev default PORT adalah 5555 (lihat `.env.example`), user bisa mengganti port di `.env` file jika diperlukan

## API Action Guidelines

**Gunakan Inertia Router** untuk:
- Pindah halaman (navigation)
- Form submission yang perlu redirect ke halaman lain
- GET request untuk load data di halaman baru
- Actions yang mengubah state dan perlu update halaman

**Gunakan Fetch API** untuk:
- Actions yang tidak memerlukan pindah halaman
- Form submission dengan stay-on-page behavior
- AJAX requests untuk update data tanpa reload
- Real-time updates, live search, autocomplete
- Actions yang hanya perlu response JSON (success/error message)
- Modal actions, dropdown actions, inline actions



## Core Principle: Maximize Existing Functionality

**ALWAYS check and use existing controllers, pages, and services before creating new ones.** This is the most important rule in Laju framework development.

**Why?**
- Avoids redundant code
- Maintains consistency
- Reduces maintenance burden
- Leverages tested, built-in functionality

**Built-in Controllers:**
- `PublicController` - Home page (SSR)
- `LoginController` - User authentication (login)
- `RegisterController` - User registration
- `PasswordController` - Password reset (forgot/reset/change)
- `ProfileController` - User profile management
- `OAuthController` - OAuth authentication (Google, etc.)
- `VerificationController` - Email verification
- `UploadController` - File uploads (local/S3)
- `StorageController` - Storage management
- `S3Controller` - AWS S3 operations
- `AssetController` - Asset serving

**Built-in Services:**
- `Authenticate` - Password hashing, login/logout, session management
- `Validator` - Input validation with Zod schemas
- `DB` - Database operations (Knex) - **Use directly for any table operations**
- `CacheService` - Caching layer
- `Mailer` / `Resend` - Email sending
- `RateLimiter` - Rate limiting
- `Logger` - Logging
- `Translation` - Multi-language support
- `View` - SSR template rendering
- `S3` - AWS S3 integration
- `Redis` - Redis client
- `LocalStorage` - Local file storage
- `GoogleAuth` - Google OAuth

**Built-in Middlewares:**
- `auth` - Authentication (checks user session)
- `inertia` - Inertia.js headers
- `rateLimit` - Rate limiting
- `securityHeaders` - Security headers

**Built-in Auth Pages:**
- `resources/js/Pages/auth/login.svelte` - Login page (customize according to design system)
- `resources/js/Pages/auth/register.svelte` - Registration page (customize according to design system)
- `resources/js/Pages/auth/forgot-password.svelte` - Forgot password (customize according to design system)
- `resources/js/Pages/auth/reset-password.svelte` - Reset password (customize according to design system)

**Note:** These pages should be customized in step 10 to match the design system from `workflow/ui-kit.html` and branding specifications from `workflow/PRD.md`.

**Built-in Migrations:**
- `20230513055909_users.ts` - Users table (id, name, email, phone, avatar, is_verified, membership_date, is_admin, password, remember_me_token, timestamps)
- `20230514062913_sessions.ts` - Sessions table (id, user_id, user_agent, expires_at)
- `20240101000001_create_password_reset_tokens.ts` - Password reset tokens (id, email, token, created_at, expires_at)
- `20240101000002_create_email_verification_tokens.ts` - Email verification tokens (id, user_id, token, created_at, expires_at)
- `20250110233301_assets.ts` - Assets table (id, name, type, url, mime_type, size, storage_key, user_id, timestamps)
- `20251023082000_create_backup_files.ts` - Backup files table (id, key, file_name, file_size, compression, storage, checksum, uploaded_at, deleted_at, encryption, enc_iv, enc_tag)
- `20251210000000_create_cache_table.ts` - Cache table (key, value, expiration)

**Rule:** If functionality exists, **use or modify** existing code instead of creating redundant controllers/services/middlewares/pages.


## Common Implementation Patterns

### File Upload Pattern

When a table needs a file field (e.g., `posts.thumbnail`, `users.avatar`), the field should store the **URL directly**, not the `asset_id`.

```typescript
// UploadController returns:
{
  success: true,
  data: {
    id: "uuid",
    type: "image",
    url: "https://example.com/assets/uuid.webp",  // ← Store this URL
    mime_type: "image/webp",
    name: "uuid.webp",
    size: 12345,
    user_id: 1,
    storage_key: "assets/uuid.webp",
    created_at: 1234567890,
    updated_at: 1234567890
  }
}
```

**Database Schema Example:**
```typescript
// Migration
export async function up(knex: Knex) {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary()
    table.string('title')
    table.text('content')
    table.string('thumbnail')  // ← Store URL here, NOT asset_id
    table.integer('user_id').unsigned().references('id').inTable('users')
    table.timestamps()
  })
}
```


**Example: Creating Post System**

1. **Check PROGRESS.md**: Find "Post system" in Phase 3
2. **Check existing files**:
   - Controller: `app/controllers/PostController.ts` (create if not exists)
   - Page: `resources/js/Pages/posts/index.svelte` (create if not exists)
   - Route: Check `routes/web.ts` for `/posts` routes

3. **Create Controller** (following `skills/create-controller.md`):
```typescript
import { Response, Request } from "../../type";
import { DB } from '../services/DB'
import { Validator } from '../services/Validator'
import { storePostSchema } from '../validators/PostValidator'

export class PostController  {
  async index() {
    const posts = await DB.from('posts')
      .join('users', 'posts.user_id', 'users.id')
      .select('posts.*', 'users.name')
      .orderBy('posts.created_at', 'desc')
    
    return response.inertia('posts/index', { posts })
  }

  async store() {
    const body = await request.json()
    const validationResult = Validator.validate(storePostSchema, body)
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal'
      return response.flash('error', firstError).redirect('/posts', 302)
    }
    
    const { title, content } = validationResult.data!
    
    // Create post
    await DB.table('posts').insert({
      user_id: request.user.id,
      title,
      content,
      created_at: Date.now(),
      updated_at: Date.now()
    })
    
    return response.flash('success', 'Post berhasil dibuat').redirect('/posts', 302)
  }

  async update() {
    const body = await request.json()
    const id = request.params.id
    
    const validationResult = Validator.validate(storePostSchema, body)
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal'
      return response.flash('error', firstError).redirect(`/posts/${id}/edit`, 303)
    }
    
    const { title, content } = validationResult.data!
    
    // Update post
    await DB.from('posts').where('id', id).update({
      title,
      content,
      updated_at: Date.now()
    })
    
    return response.flash('success', 'Post berhasil diupdate').redirect('/posts', 303)
  }

  async destroy() {
    const id = request.params.id
    
    // Delete post
    await DB.from('posts').where('id', id).delete()
    
    return response.flash('success', 'Post berhasil dihapus').redirect('/posts', 303)
  }
}
```

4. **Create Pages** (following `skills/create-svelte-inertia-page.md` and `workflow/ui-kit.html`):

**Index Page** (`resources/js/Pages/posts/index.svelte`):
```svelte
<script>
  import { router, inertia } from '@inertiajs/svelte'
  import DashboardLayout from '@/Components/DashboardLayout.svelte'
  let { flash, posts } = $props()
</script>

<DashboardLayout activeItem="posts" title="Posts" subtitle="Kelola post Anda">
  <!-- Flash Messages -->
  {#if flash?.error}
    <div class="flex items-start gap-4 p-4 rounded-xl bg-danger-surface border border-danger/20 mb-4">
      <i class="fa-solid fa-circle-exclamation text-danger mt-0.5 text-lg"></i>
      <div>
        <h4 class="text-sm font-bold text-danger">Error</h4>
        <p class="text-xs text-danger/80 mt-1">{flash.error}</p>
      </div>
    </div>
  {/if}

  {#if flash?.success}
    <div class="flex items-start gap-4 p-4 rounded-xl bg-success-surface border border-success/20 mb-4">
      <i class="fa-solid fa-circle-check text-success mt-0.5 text-lg"></i>
      <div>
        <h4 class="text-sm font-bold text-success">Success</h4>
        <p class="text-xs text-success/80 mt-1">{flash.success}</p>
      </div>
    </div>
  {/if}

  <!-- Create Button -->
  <a href="/posts/create" use:inertia class="inline-block px-6 py-3 rounded-2xl font-bold text-sm bg-[#065F46] text-white shadow-lg shadow-primary/20 mb-6">
    <i class="fa-solid fa-plus mr-2"></i>Buat Post
  </a>

  <!-- Post Cards -->
  <div class="space-y-4">
    {#each posts as post}
      <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition duration-500 border border-gray-100">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="font-serif text-xl font-bold text-gray-900 mb-1">{post.title}</h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <i class="fa-solid fa-user"></i>
              {post.name} • {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
          <div class="flex gap-2">
            <a href={`/posts/${post.id}/edit`} use:inertia class="px-4 py-2 rounded-xl border border-gray-200 hover:border-[#065F46] hover:text-[#065F46] font-bold text-xs transition">
              Edit
            </a>
            <button onclick={() => router.delete(`/posts/${post.id}`)} class="px-4 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 hover:text-danger font-bold text-xs transition">
              Hapus
            </button>
          </div>
        </div>
        <p class="text-gray-600 text-sm">{post.content}</p>
      </div>
    {/each}
  </div>
</DashboardLayout>
```

**Form Page** (`resources/js/Pages/posts/form.svelte`):
```svelte
<script>
  import { router, inertia } from '@inertiajs/svelte'
  import DashboardLayout from '@/Components/DashboardLayout.svelte'
  let { flash, post } = $props()
  let isEdit = !!post
  let formData = $state({
    title: post?.title || '',
    content: post?.content || ''
  })
</script>

<DashboardLayout activeItem="posts" title={isEdit ? 'Edit Post' : 'Buat Post'} subtitle={isEdit ? 'Edit post Anda' : 'Buat post baru'}>
  <!-- Flash Messages -->
  {#if flash?.error}
    <div class="flex items-start gap-4 p-4 rounded-xl bg-danger-surface border border-danger/20 mb-4">
      <i class="fa-solid fa-circle-exclamation text-danger mt-0.5 text-lg"></i>
      <div>
        <h4 class="text-sm font-bold text-danger">Error</h4>
        <p class="text-xs text-danger/80 mt-1">{flash.error}</p>
      </div>
    </div>
  {/if}

  <!-- Form -->
  <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
    <form onsubmit={(e) => {
      e.preventDefault()
      if (isEdit) {
        router.put(`/posts/${post.id}`, formData)
      } else {
        router.post('/posts', formData)
      }
    }}>
      <div class="mb-4">
        <label class="block text-sm font-bold text-gray-700 mb-2">Title</label>
        <input type="text" bind:value={formData.title} class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#065F46] focus:outline-none" required />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold text-gray-700 mb-2">Content</label>
        <textarea bind:value={formData.content} class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#065F46] focus:outline-none h-32" required></textarea>
      </div>
      <div class="flex gap-3">
        <a href="/posts" use:inertia class="flex-1 px-6 py-3 rounded-xl border border-gray-200 font-bold text-sm text-center">
          Batal
        </a>
        <button type="submit" class="flex-1 px-6 py-3 rounded-xl bg-[#065F46] text-white font-bold text-sm">
          {isEdit ? 'Update' : 'Simpan'}
        </button>
      </div>
    </form>
  </div>
</DashboardLayout>
```

5. **Add Routes** (in `routes/web.ts`):
```typescript
import PostController from "../app/controllers/PostController"

// Post routes
Route.get('/posts', [Auth], PostController.index)
Route.get('/posts/create', [Auth], PostController.create)
Route.post('/posts', [Auth], PostController.store)
Route.get('/posts/:id/edit', [Auth], PostController.edit)
Route.put('/posts/:id', [Auth], PostController.update)
Route.delete('/posts/:id', [Auth], PostController.destroy)
```

## Next Steps

Setelah project initialization selesai, lanjutkan dengan:
1. Implementasi fitur pertama sesuai `workflow/PROGRESS.md`
2. Gunakan `workflow/TASK_AGENT.md` untuk panduan implementasi fitur
3. Update `workflow/PROGRESS.md` setelah setiap fitur selesai