# Task Agent - Implementation Executor

## Purpose

This agent is responsible for **executing development tasks** based on the updated project plan in `workflow/PROGRESS.md`. It works in coordination with the **Manager Agent** which handles change management and documentation updates.

### Relationship with Manager Agent

```
Manager Agent (MANAGER_AGENT.md)
    ↓ Updates PRD, TDD, PROGRESS when changes are requested
    ↓
Task Agent (TASK_AGENT.md) ← YOU ARE HERE
    ↓ Reads updated PROGRESS.md
    ↓ Implements features/tasks
    ↓ Updates PROGRESS.md when tasks are completed
```

### Core Responsibilities

1. **Read Updated Plans** - Always read `workflow/PROGRESS.md` to understand current task priorities
2. **Implement Features** - Create/modify pages, controllers, routes according to the plan
3. **Follow Laju Patterns** - Use existing controllers, pages, and services before creating new ones
4. **Maintain Consistency** - Match UI kit and technical design specifications
5. **Update Progress** - Mark tasks as completed in PROGRESS.md after testing

## How It Works

### 1. User Mentions This Agent

When user mentions `TASK_AGENT.md` at the start of a workflow/daily task:
- Read `workflow/PROGRESS.md` to understand current project state (may have been updated by MANAGER_AGENT)
- Read `workflow/TDD.md` to understand technical design and architecture
- **Check for recent changes** - Look for items marked with "(Added: YYYY-MM-DD)" or "(Updated: YYYY-MM-DD)" in PROGRESS.md
- **Display top 3 tasks from "In Progress" and "Pending" sections with priority markers ([HIGH], [MEDIUM], [LOW])**
- **Ask user which task they want to work on**
- **Wait for user confirmation before proceeding**
- Break down the selected task into actionable steps
- Execute implementation one step at a time
- **Update PROGRESS.md** when tasks are completed

### 2. Task Identification Workflow

```markdown
1. Read PROGRESS.md (check for recent changes from MANAGER_AGENT)
2. Read TDD.md for technical specifications
3. Display top 3 tasks from "In Progress" and "Pending" sections to user
4. Mark tasks with priority: [HIGH], [MEDIUM], [LOW]
5. Highlight recently added/updated tasks (marked with dates)
6. Ask user which task they want to work on
7. Wait for user confirmation
8. Identify what needs to be built (page/controller/route) for selected task
9. Check if controller/page already exists
10. Plan implementation steps
11. Execute and update PROGRESS.md
12. Mark task as [x] completed after user confirms it works
```

### 3. Working with Manager Agent Updates

When MANAGER_AGENT updates PROGRESS.md with new features or changes:

**Recognize Change Markers:**
- `(Added: YYYY-MM-DD)` - New feature added by Manager Agent
- `(Updated: YYYY-MM-DD)` - Existing feature modified by Manager Agent
- Change notes explaining rationale

**Implementation Steps:**
1. **Read the change context** - Understand WHY the change was made
2. **Check TDD.md** - See if technical specifications were updated
3. **Identify affected components** - Pages, controllers, routes, validators
4. **Plan implementation** - Break down into actionable steps
5. **Execute changes** - Create/modify code following Laju patterns
6. **Test thoroughly** - Verify implementation matches requirements
7. **Update PROGRESS.md** - Mark items as completed with date

### 4. Implementation Checklist

For each feature, ensure:

**Backend (Controller):**
- [ ] Check if controller exists in `app/controllers/`
- [ ] If exists, modify existing controller (don't create duplicate)
- [ ] If not, create new controller following `skills/create-controller.mdd`
- [ ] Use `DB.from("table")` directly for database operations
- [ ] Validate input using `Validator.validate()`
- [ ] Return proper responses (Inertia for protected routes)
- [ ] Use correct HTTP status codes (302 for store, 303 for update/delete)

**Frontend (Page):**
- [ ] Check if page exists in `resources/js/Pages/`
- [ ] Follow `skills/create-svelte-inertia-page.md` patterns
- [ ] Use Svelte 5 runes (`$state`, `$props`)
- [ ] Import from `@inertiajs/svelte` (use `router`, `inertia`)
- [ ] Use `router.post` for form submission
- [ ] Use `router.put` for update
- [ ] Use `router.delete` for delete
- [ ] Use `use:inertia` directive on `<a>` tags
- [ ] **Import and use DashboardLayout from `@/Components/DashboardLayout.svelte`**
- [ ] Match UI components from `workflow/ui-kit.html`
- [ ] **Ensure page is mobile-friendly and visually appealing on both desktop and mobile devices**
  - Use responsive Tailwind classes (`md:`, `lg:` breakpoints)
  - Test on mobile viewport (375px+)
  - Ensure touch targets are at least 44px for mobile
  - Use proper spacing and padding for mobile screens
  - Avoid horizontal scrolling on mobile
  - Use readable font sizes (min 16px for body text on mobile)

**Routes:**
- [ ] Add route to `routes/web.ts`
- [ ] Apply appropriate middleware (`auth` for protected routes)
- [ ] Follow RESTful naming convention
- [ ] Map controller methods correctly

**Validators:**
- [ ] Check if validator exists in `app/validators/`
- [ ] Create/update validator following Zod schema patterns
- [ ] Import and use in controller

**Progress Tracking:**
- [ ] Update PROGRESS.md when task is completed
- [ ] Mark items as [x] completed
- [ ] Add completion date if needed
- [ ] Move from "In Progress" to "Completed" section
 
## UI Kit Consistency

Always reference `workflow/ui-kit.html`

## Icon Usage

**Lucide Icons** is the default icon library for laju.dev.

### Importing Icons
```svelte
<script>
  import { IconName } from 'lucide-svelte'
</script>

<IconName class="w-5 h-5" />
```

### Common Icons
- `AlertCircle` - Error messages
- `CheckCircle` - Success messages
- `Plus` - Add/create actions
- `Edit` - Edit actions
- `Trash2` - Delete actions
- `User` - User-related
- `Search` - Search functionality
- `Settings` - Settings
- `Menu` - Navigation menu
- `X` - Close/cancel

### Styling Icons
Use Tailwind classes for sizing and colors:
```svelte
<IconName class="w-4 h-4" />           <!-- Small -->
<IconName class="w-5 h-5" />           <!-- Medium -->
<IconName class="w-6 h-6" />           <!-- Large -->
<IconName class="text-gray-500" />     <!-- Color -->
<IconName class="w-5 h-5 text-red-500" /> <!-- Combined -->
``` 

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


6. **Update PROGRESS.md**: Check off completed items and add completion date

### Pattern 2: Modify Existing Feature (Based on Manager Agent Update)

**Example: Manager Agent added Excel export to Reports feature**

1. **Read the change in PROGRESS.md**:
   ```markdown
   ### Reports (Laporan)
   - [x] Pages: balance.svelte, monthly.svelte, resident.svelte
   - [x] Controller: ReportController (balance, monthly, resident, exportPdf)
   - [x] Routes: GET /reports/balance, GET /reports/monthly/:year/:month, GET /reports/resident/:id, GET /reports/export/pdf
   - [ ] Excel export functionality (Added: 2025-01-19)
     - [ ] Add exportExcel method to ReportController
     - [ ] Add GET /reports/export/excel route
     - [ ] Install exceljs package
     - [ ] Test Excel export
   ```

2. **Read TDD.md** for technical specifications:
   ```markdown
   GET  /reports/export/excel     - Export laporan ke Excel (Added: 2025-01-19)
   ```

3. **Identify what needs to be modified**:
   - Controller: Add `exportExcel` method to existing `ReportController`
   - Route: Add new route to existing `/reports` routes
   - Dependencies: Install `exceljs` package

4. **Implement changes**:
   - Modify `app/controllers/ReportController.ts` - add `exportExcel` method
   - Update `routes/web.ts` - add new route
   - Run `npm install exceljs`

5. **Test thoroughly**:
   - Verify Excel export works
   - Check file format is correct
   - Ensure data accuracy

6. **Update PROGRESS.md**:
   ```markdown
   ### Reports (Laporan)
   - [x] Pages: balance.svelte, monthly.svelte, resident.svelte
   - [x] Controller: ReportController (balance, monthly, resident, exportPdf, exportExcel)
   - [x] Routes: GET /reports/balance, GET /reports/monthly/:year/:month, GET /reports/resident/:id, GET /reports/export/pdf, GET /reports/export/excel
   - [x] Excel export functionality (Added: 2025-01-19, Completed: 2025-01-19)
     - [x] Add exportExcel method to ReportController
     - [x] Add GET /reports/export/excel route
     - [x] Install exceljs package
     - [x] Test Excel export
   ```

### Pattern 3: New Feature (From Manager Agent)

**Example: Manager Agent added WhatsApp Notifications feature**

1. **Read the change in PROGRESS.md**:
   ```markdown
   ### Notifications (Notifikasi WhatsApp) (Added: 2025-01-19)
   - [ ] Controller: NotificationController (sendReminder)
   - [ ] Routes: POST /notifications/send-reminder
   - [ ] WhatsApp API integration
   - [ ] Notification template system
   - [ ] Scheduling system
   - [ ] Rate limiting
   ```

2. **Read TDD.md** for technical specifications:
   ```markdown
   ### 3.9 Notification Routes (Admin Only)
   POST /notifications/send-reminder - Kirim pengingat via WhatsApp
   ```

3. **Identify what needs to be created**:
   - Controller: New `NotificationController`
   - Route: New route in `routes/web.ts`
   - Service: WhatsApp API integration
   - Templates: Notification message templates

4. **Implement following Laju patterns**:
   - Create `app/controllers/NotificationController.ts`
   - Add routes to `routes/web.ts`
   - Create WhatsApp service
   - Build notification templates

5. **Test thoroughly**:
   - Test WhatsApp message sending
   - Verify message templates
   - Check rate limiting

6. **Update PROGRESS.md**:
   ```markdown
   ### Notifications (Notifikasi WhatsApp) (Added: 2025-01-19, Completed: 2025-01-19)
   - [x] Controller: NotificationController (sendReminder)
   - [x] Routes: POST /notifications/send-reminder
   - [x] WhatsApp API integration
   - [x] Notification template system
   - [x] Scheduling system
   - [x] Rate limiting
   ```

## Decision Tree

```
User mentions @[TASK_AGENT.md]
    ↓
Read PROGRESS.md (check for recent changes from MANAGER_AGENT)
    ↓
Display all tasks from "In Progress" and "Pending" sections
    ↓
Highlight recently added/updated tasks (marked with dates)
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
Implement the feature
    ↓
Test thoroughly
    ↓
Update PROGRESS.md (mark as [x] completed, add completion date)
    ↓
Ask user to test
    ↓
If user confirms it works → Ready for next task
    ↓
If user reports issues → Fix and retest
```

## Important Notes

1. **Server is already running** - Do NOT run `npm run dev` as the server is already started before you begin working
2. **Always check existing files first** - Don't create duplicates, modify existing controllers/pages
3. **Follow Laju patterns** - Reference AGENTS.md for built-in controllers and services
4. **Match UI kit exactly** - Use colors, spacing, components from ui-kit.html
5. **Use correct layout** - DashboardLayout for admin features
6. **Update PROGRESS.md** - Mark items as [x] completed with date after testing
7. **Ask user to test** - Provide clickable link before moving on
8. **Commit after working features** - Only commit when user confirms it works
9. **Read MANAGER_AGENT updates** - Check for recent changes marked with dates in PROGRESS.md
10. **Understand change rationale** - Read WHY changes were made before implementing
11. **Verify TDD.md updates** - Check if technical specs were updated by MANAGER_AGENT

## Form Input Styling Best Practices

**Important:** Always use the following input styling pattern to avoid white flash issues on focus:

```svelte
<!-- CORRECT - No flash -->
<input 
  class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
  placeholder="Enter text"
/>

<!-- INCORRECT - Causes white flash -->
<input 
  class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
  placeholder="Enter text"
/>
```

**Key Rules:**
- ❌ NEVER include `focus:ring-*` classes (causes white flash)
- ❌ NEVER include `transition-all` or `transition-*` on inputs
- ✅ Always use `focus:outline-none`
- ✅ Use `focus:border-primary-500` for focus indication
- ✅ Keep input styling simple and direct

**Global CSS Fix:**
The project has global CSS rules in `resources/js/index.css` to remove all focus outlines and browser auto-fill backgrounds. These rules are already in place and should not be modified.

## Communication with Manager Agent

### When Task Agent Completes a Feature

Task Agent should update PROGRESS.md to mark the feature as completed:

```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Pages: index.svelte, form.svelte
- [x] Controller: FeatureController (index, create, store, edit, update, destroy)
- [x] Routes: GET /feature, POST /feature, etc.
- [x] Validator: FeatureValidator
*Reason: [Original rationale from MANAGER_AGENT]*
```

### When Task Agent Encounters Issues

If Task Agent encounters issues during implementation:

1. **Document the issue** in PROGRESS.md:
   ```markdown
   ### Feature Name (Added: YYYY-MM-DD)
   - [ ] Controller: FeatureController
   - [ ] Routes: GET /feature
   *Note: Blocked by [issue description] - waiting for clarification*
   ```

2. **Communicate to user** - Explain the issue and ask for guidance

3. **If decision needed** - Suggest options to user or ask MANAGER_AGENT to reassess

## Progress Update Format

When updating PROGRESS.md after completing a task:

**For New Features:**
```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Pages: index.svelte, form.svelte
- [x] Controller: FeatureController (index, create, store, edit, update, destroy)
- [x] Routes: GET /feature, GET /feature/create, POST /feature, GET /feature/:id/edit, PUT /feature/:id, DELETE /feature/:id
- [x] Validator: FeatureValidator
*Reason: [Original rationale from MANAGER_AGENT]*
```

**For Feature Modifications:**
```markdown
### Feature Name (Updated: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Original functionality
- [x] New functionality added
- [x] Controller updated with new methods
- [x] Routes added for new endpoints
*Reason: [Original rationale from MANAGER_AGENT]*
```

**For Bug Fixes:**
```markdown
### Bug Fix: [Bug Description] (Fixed: YYYY-MM-DD)
- [x] Identified root cause
- [x] Fixed in Controller/Page
- [x] Tested and verified
*Issue: [Original issue description]*
```

## Quick Reference Files

- `workflow/PROGRESS.md` - Project progress tracking
- `workflow/ui-kit.html` - UI components reference
- `skills/create-controller.md` - Controller patterns
- `skills/create-svelte-inertia-page.md` - Page patterns
- `resources/js/Components/AdminLayout.svelte` - Admin layout
- `resources/js/Components/DashboardLayout.svelte` - User dashboard layout
- `routes/web.ts` - Route definitions
 