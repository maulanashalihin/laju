# Workflow Agent Guide

## Purpose

This agent helps process development tasks for this project by:
- Creating `resources/js/Pages` (Svelte 5 + inertia.js 2)
- Creating `app/controllers` (TypeScript controllers)
- Creating/updating `routes/web.ts` (route definitions)
- Ensuring UI consistency with `workflow/ui-kit.html` 

## How It Works

### 1. User Mentions This Agent

When user mentions `TASK_AGENT.md` at the start of a workflow/daily task:
- Read `workflow/PROGRESS.md` to understand current project state
- **Display top 3 tasks from "In Progress" and "Pending" sections with priority markers ([HIGH], [MEDIUM], [LOW])**
- **Ask user which task they want to work on**
- **Wait for user confirmation before proceeding**
- Break down the selected task into actionable steps
- Execute implementation one step at a time

### 2. Task Identification Workflow

```markdown
1. Read PROGRESS.md
2. Display top 3 tasks from "In Progress" and "Pending" sections to user
3. Mark tasks with priority: [HIGH], [MEDIUM], [LOW]
4. Ask user which task they want to work on
5. Wait for user confirmation
6. Identify what needs to be built (page/controller/route) for selected task
7. Check if controller/page already exists
8. Plan implementation steps
9. Execute and update PROGRESS.md
```

### 3. Implementation Checklist

For each feature, ensure:

**Backend (Controller):**
- [ ] Check if controller exists in `app/controllers/`
- [ ] If exists, modify existing controller
- [ ] If not, create new controller following `skills/create-controller.mdd`
- [ ] Use `DB.from("table")` directly for database operations
- [ ] Validate input using `Validator.validate()`
- [ ] Return proper responses (Inertia for protected routes)
- [ ] Use correct HTTP status codes (302 for store, 303 for update/delete)

**Frontend (Page):**
- [ ] Check if page exists in `resources/js/Pages/`
- [ ] Follow `skills/create-svelte-inertia-page.md` patterns
- [ ] Use Svelte 5 runes (`$state`, `$props`)
- [ ] Import from `@inertiajs/svelte` (use  `router`, `inertia`)
- [ ] Use `router.post` for form submission
- [ ] Use `router.put` for update
- [ ] Use `router.delete` for delete
- [ ] Use `use:inertia` directive on `<a>` tags
- [ ] **Import and use DashboardLayout from `@/Components/DashboardLayout.svelte`**
- [ ] Match UI components from `workflow/ui-kit.html` 

**Routes:**
- [ ] Add route to `routes/web.ts`
- [ ] Apply appropriate middleware (`auth` for protected routes)
- [ ] Follow RESTful naming convention
- [ ] Map controller methods correctly
 
## UI Kit Consistency

Always reference `workflow/ui-kit.html` 

## Common Patterns

### Pattern 1: New Feature (Page + Controller + Route)

**Example: Creating Post System**

1. **Check PROGRESS.md**: Find "Post system" in Phase 3
2. **Check existing files**:
   - Controller: `app/controllers/PostController.ts` (create if not exists)
   - Page: `resources/js/Pages/posts/index.svelte` (create if not exists)
   - Route: Check `routes/web.ts` for `/posts` routes

3. **Create Controller** (following `skills/create-controller.md`):
```typescript
import { Controller, request, response } from 'hyper-express'
import { DB } from '../services/DB'
import { Validator } from '../services/Validator'
import { storePostSchema } from '../validators/PostValidator'

export class PostController extends Controller {
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
  import { router } from '@inertiajs/svelte'
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
  import { router } from '@inertiajs/svelte'
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

6. **Update PROGRESS.md**: Check off completed items

### Pattern 2: Modify Existing Feature

1. **Identify what needs to be modified**
2. **Read existing controller/page**
3. **Make minimal, focused changes**
4. **Test the changes**
5. **Update PROGRESS.md**

## Decision Tree

```
User mentions @[TASK_AGENT.md]
    ↓
Read PROGRESS.md
    ↓
Display all tasks from "In Progress" and "Pending" sections
    ↓
Ask user which task they want to work on
    ↓
Wait for user confirmation
    ↓
What needs to be built for selected task?
    ↓
├── New Page?
│   ├── Check if page exists
│   ├── Create/modify page following skills/create-svelte-inertia-page.md
│   ├── Use ui-kit.html components
│   └── Choose layout (AdminLayout/DashboardLayout)
│
├── New Controller?
│   ├── Check if controller exists
│   ├── Create/modify following skills/create-controller.md
│   ├── Use DB.from() for queries
│   └── Validate with Validator
│
└── New Route?
    ├── Add to routes/web.ts
    ├── Apply middleware
    └── Map to controller method
    ↓
Update PROGRESS.md
    ↓
Ask user to test
```

## Important Notes

1. **Always check existing files first** - Don't create duplicates
2. **Follow existing patterns** - Reference AGENTS.md files
3. **Match UI kit exactly** - Use colors, spacing, components from ui-kit.html
4. **Use correct layout** - AdminLayout for admin, DashboardLayout for users
5. **Update PROGRESS.md** - Mark items as complete after testing
6. **Ask user to test** - Provide clickable link before moving on
7. **Commit after working features** - Only commit when user confirms it works

## Quick Reference Files

- `workflow/PROGRESS.md` - Project progress tracking
- `workflow/ui-kit.html` - UI components reference
- `skills/create-controller.md` - Controller patterns
- `skills/create-svelte-inertia-page.md` - Page patterns
- `resources/js/Components/AdminLayout.svelte` - Admin layout
- `resources/js/Components/DashboardLayout.svelte` - User dashboard layout
- `routes/web.ts` - Route definitions
 