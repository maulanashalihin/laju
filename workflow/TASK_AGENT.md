# Task Agent - Implementation Executor

## Purpose

This agent is responsible for **executing development tasks** based on the updated project plan in `workflow/PROGRESS.md`. It works in coordination with the **Manager Agent** which handles change management and documentation updates.

## Scope Enforcement

**TASK_AGENT CAN:**
- ✅ Implement features (create/modify pages, controllers, routes, validators)
- ✅ Fix bugs
- ✅ Modify existing features
- ✅ Test locally (unit, integration)
- ✅ Update PROGRESS.md when tasks completed
- ✅ Follow Laju patterns
- ✅ Create feature branches automatically
- ✅ Commit changes after user confirms feature works
- ✅ Push changes to trigger CI/CD

**TASK_AGENT CANNOT:**
- ❌ Manage changes or update PRD/TDD
- ❌ Create release notes
- ❌ Approve deployment
- ❌ Update version in package.json
- ❌ Deploy to production
- ❌ Manage project documentation
- ❌ Merge branches (user must handle PRs)

**If asked to do something outside scope:**
```
❌ REJECTED: "Tolong update PRD.md untuk fitur ini"

RESPONSE: "Saya tidak bisa update PRD.md atau TDD.md. 
Itu adalah tanggung jawab MANAGER_AGENT. 
Silakan mention @workflow/MANAGER_AGENT.md untuk update dokumentasi."
```

### Relationship with Manager Agent

```
Manager Agent (MANAGER_AGENT.md)
    ↓ Updates PRD, TDD, PROGRESS when changes are requested
    ↓
Task Agent (TASK_AGENT.md) ← YOU ARE HERE
    ↓ Reads updated PROGRESS.md
    ↓ Auto-create feature branch (if needed)
    ↓ Implements features/tasks
    ↓ Tests locally (optional but recommended)
    ↓ Asks user to test
    ↓ Auto-commit & push after user confirms
    ↓ Updates PROGRESS.md when tasks are completed
    ↓
GitHub Actions CI (Automated)
    ↓ Runs unit, integration tests
    ↓
GitHub Actions CI (Automated Deployment)
    ↓ Deploy to production (only if tests pass)
    ↓ Run smoke tests
    ↓ Auto-rollback jika fail
    ↓
Manager Agent (MANAGER_AGENT.md)
    ↓ Update CHANGELOG.md
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
- **Generate unique Agent ID** - Use timestamp or process ID (e.g., TASK_AGENT_1706072400)
- Read `workflow/PROGRESS.md` to understand current project state (may have been updated by MANAGER_AGENT)
- Read `workflow/TDD.md` to understand technical design and architecture
- **Check for recent changes** - Look for items marked with "(Added: YYYY-MM-DD)" or "(Updated: YYYY-MM-DD)" in PROGRESS.md
- **Filter out locked tasks** - Exclude tasks marked with `[LOCKED: ...]`
- **Display top 3 available tasks** from "In Progress" and "Pending" sections with priority markers ([HIGH], [MEDIUM], [LOW])
- **Ask user which task they want to work on**
- **Wait for user confirmation before proceeding**
- **Lock the selected task** in PROGRESS.md with format: `[LOCKED: {AGENT_ID} @ {timestamp}]`
- **Auto-create feature branch** (check current branch, create if not on feature branch)
- Break down the selected task into actionable steps
- Execute implementation one step at a time
- **Ask user to test the feature**
- **Auto-commit & push after user confirms it works**
- **Unlock and mark task as [x] completed** in PROGRESS.md

### 2. Task Identification Workflow

```markdown
1. Generate unique Agent ID (e.g., TASK_AGENT_1706072400)
2. Read PROGRESS.md (check for recent changes from MANAGER_AGENT)
3. Filter out locked tasks (exclude [LOCKED: ...])
4. Read TDD.md for technical specifications
5. Display top 3 available tasks from "In Progress" and "Pending" sections to user
6. Mark tasks with priority: [HIGH], [MEDIUM], [LOW]
7. Highlight recently added/updated tasks (marked with dates)
8. Ask user which task they want to work on
9. Wait for user confirmation
10. Lock the selected task: [LOCKED: {AGENT_ID} @ YYYY-MM-DD HH:MM]
11. Auto-create feature branch (if needed)
12. Identify what needs to be built (page/controller/route) for selected task
13. Check if controller/page already exists
14. Plan implementation steps
15. Execute and update PROGRESS.md
16. Ask user to test the feature
17. Auto-commit & push after user confirms it works
18. Unlock task and mark as [x] completed
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
 
**Note:** GitHub Actions CI will automatically run all tests when you push to GitHub. Deployment only proceeds if all tests pass.

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
import { uuidv7 } from 'uuidv7'

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
    
    // Create post with uuidv7
    await DB.table('posts').insert({
      id: uuidv7(),
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
  import { AlertCircle, CheckCircle, Plus, User } from 'lucide-svelte'
  import DashboardLayout from '@/Components/DashboardLayout.svelte'
  let { flash, posts } = $props()
</script>

<DashboardLayout activeItem="posts" title="Posts" subtitle="Kelola post Anda">
  <!-- Flash Messages -->
  {#if flash?.error}
    <div class="flex items-start gap-4 p-4 rounded-xl bg-danger-surface border border-danger/20 mb-4">
      <AlertCircle class="w-5 h-5 text-danger mt-0.5" />
      <div>
        <h4 class="text-sm font-bold text-danger">Error</h4>
        <p class="text-xs text-danger/80 mt-1">{flash.error}</p>
      </div>
    </div>
  {/if}

  {#if flash?.success}
    <div class="flex items-start gap-4 p-4 rounded-xl bg-success-surface border border-success/20 mb-4">
      <CheckCircle class="w-5 h-5 text-success mt-0.5" />
      <div>
        <h4 class="text-sm font-bold text-success">Success</h4>
        <p class="text-xs text-success/80 mt-1">{flash.success}</p>
      </div>
    </div>
  {/if}

  <!-- Create Button -->
  <a href="/posts/create" use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-[#065F46] text-white shadow-lg shadow-primary/20 mb-6">
    <Plus class="w-4 h-4" />Buat Post
  </a>

  <!-- Post Cards -->
  <div class="space-y-4">
    {#each posts as post}
      <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition duration-500 border border-gray-100">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="font-serif text-xl font-bold text-gray-900 mb-1">{post.title}</h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <User class="w-4 h-4" />
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
  import { AlertCircle } from 'lucide-svelte'
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
      <AlertCircle class="w-5 h-5 text-danger mt-0.5" />
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


6. **Create Tests**:

**Unit Test** (`tests/unit/services/PostService.test.ts`):
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DB } from '../../../app/services/DB'

describe('Post Service', () => {
  beforeEach(async () => {
    // Setup test database
    await DB.migrate.latest()
  })

  afterEach(async () => {
    // Cleanup test database
    await DB.migrate.rollback()
  })

  it('should create a new post', async () => {
    const postData = {
      id: '01234567-89ab-cdef-0123-456789abcdef',
      user_id: 'test-user-id',
      title: 'Test Post',
      content: 'Test Content',
      created_at: Date.now(),
      updated_at: Date.now()
    }

    await DB.table('posts').insert(postData)

    const post = await DB.from('posts').where('id', postData.id).first()
    expect(post).toBeDefined()
    expect(post?.title).toBe('Test Post')
  })

  it('should fail on invalid title', async () => {
    const invalidData = {
      title: '', // Empty title
      content: 'Test Content'
    }

    // Should throw validation error
    await expect(
      DB.table('posts').insert(invalidData)
    ).rejects.toThrow()
  })
})
```

**Integration Test** (`tests/integration/post.test.ts`):
```typescript
import { describe, it, expect } from 'vitest'

describe('POST /posts - Integration Tests', () => {
  it('should create post successfully', async () => {
    const response = await fetch('http://localhost:5555/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Post',
        content: 'Test Content'
      })
    })

    expect(response.status).toBe(302)
  })

  it('should fail with invalid data', async () => {
    const response = await fetch('http://localhost:5555/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '', // Invalid
        content: ''
      })
    })

    expect(response.status).toBe(302)
  })
})
```

7. **Update PROGRESS.md**: Check off completed items and add completion date

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

## Task Locking Mechanism

**Purpose:** Prevent concurrent TASK_AGENT instances from working on the same task.

**Lock Format in PROGRESS.md:**
```markdown
### Feature Name
- [ ] Task 1 [LOCKED: TASK_AGENT_1706072400 @ 2025-01-24 08:30]
- [ ] Task 2
- [ ] Task 3
```

**Agent ID Generation:**
- Use timestamp: `TASK_AGENT_{timestamp}`
- Example: `TASK_AGENT_1706072400`
- Each terminal/session gets unique ID

**Locking Rules:**
1. **Before displaying tasks** - Filter out all tasks with `[LOCKED: ...]`
2. **When user selects task** - Immediately lock it with `[LOCKED: {AGENT_ID} @ {timestamp}]`
3. **When task completed** - Remove lock and mark as `[x] completed`
4. **If task fails** - Remove lock and return to available pool

**Example Workflow:**
```
Terminal 1 (TASK_AGENT_1706072400):
  User: "Implement Feature 1"
  TASK_AGENT: Locks "Feature 1" in PROGRESS.md
  TASK_AGENT: Starts implementation

Terminal 2 (TASK_AGENT_1706072500):
  User: "Implement Feature 1"
  TASK_AGENT: Checks PROGRESS.md
  TASK_AGENT: Sees "Feature 1" is locked by TASK_AGENT_1706072400
  TASK_AGENT: Does NOT display "Feature 1" in available tasks
  TASK_AGENT: Shows other available tasks only
```

**Unlocking Tasks:**
- **On completion:** Remove `[LOCKED: ...]` and mark as `[x] completed`
- **On failure:** Remove `[LOCKED: ...]` and keep as `[ ] pending`
- **On user abort:** Remove `[LOCKED: ...]` and keep as `[ ] pending`

## Decision Tree

```
User mentions @[TASK_AGENT.md]
    ↓
Generate unique Agent ID (TASK_AGENT_{timestamp})
    ↓
Read PROGRESS.md (check for recent changes from MANAGER_AGENT)
    ↓
Filter out locked tasks (exclude [LOCKED: ...])
    ↓
Display all available tasks from "In Progress" and "Pending" sections
    ↓
Highlight recently added/updated tasks (marked with dates)
    ↓
Ask user which task they want to work on
    ↓
Wait for user confirmation
    ↓
Lock the selected task: [LOCKED: {AGENT_ID} @ {timestamp}]
    ↓
Check current Git branch
    ↓
If on feature branch → Continue
If not → Auto-create feature branch (feature/task-name)
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
Ask user to test in browser
    ↓
If user confirms it works:
    ├── Auto-commit changes
    ├── Auto-push to GitHub
    ├── Unlock task (remove [LOCKED: ...])
    └── Update PROGRESS.md (mark as [x] completed, add completion date)
    ↓
If user reports issues:
    ├── Fix and retest
    └── Ask user to test again
    ↓
If user aborts or task fails:
    ├── Unlock task (remove [LOCKED: ...])
    └── Return task to available pool
```

## Important Notes

1. **Server is already running** - Do NOT run `npm run dev` as the server is already started before you begin working
2. **Always check existing files first** - Don't create duplicates, modify existing controllers/pages
3. **Follow Laju patterns** - Reference AGENTS.md for built-in controllers and services
4. **Match UI kit exactly** - Use colors, spacing, components from ui-kit.html
5. **Use correct layout** - DashboardLayout for admin features
6. **Task locking required** - Always lock tasks before starting, unlock on completion/failure
7. **Filter locked tasks** - Never display locked tasks to other agents
8. **Auto-create feature branches** - Check current branch, create feature branch if needed
9. **Auto-commit & push** - Only commit after user confirms feature works
10. **Ask user to test** - Provide clickable link before committing
11. **Read MANAGER_AGENT updates** - Check for recent changes marked with dates in PROGRESS.md
12. **Understand change rationale** - Read WHY changes were made before implementing
13. **Verify TDD.md updates** - Check if technical specs were updated by MANAGER_AGENT
14. **Tests run automatically** - GitHub Actions CI runs unit and integration tests when you push
15. **Local testing recommended** - Run tests locally before pushing for faster feedback
16. **Deployment blocked if tests fail** - GitHub Actions won't deploy if any test fails
17. **User handles merges** - User must create and merge PRs manually
18. **Unique Agent ID** - Generate unique ID per session to prevent conflicts

## Testing Workflow

### Before Pushing to GitHub

**Recommended local testing:**
```bash
# Run all tests (unit + integration)
npm run test:run

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Manual testing in browser
# Open http://localhost:5555
# Test the feature you implemented
```

### After Pushing to GitHub

**GitHub Actions CI runs automatically:**
1. All tests (unit + integration) via `npm run test:run`
2. Build application
3. Deploy to production (only if all tests pass)
4. Run smoke tests
5. Auto-rollback if smoke tests fail

**If tests fail:**
- Check GitHub Actions logs for errors
- Fix the issue locally
- Commit and push again
- Tests will run again automatically


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
 