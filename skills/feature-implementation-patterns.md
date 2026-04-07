# Feature Implementation Patterns

Common patterns for implementing features in Laju Framework.

## Pattern 1: New Feature (Page + Handler + Route)

**Example: Creating Post System**

### 1. Check PROGRESS.md
Find "Post system" task and check existing files:
- Handler: `app/handlers/posts.handler.ts`
- Page: `resources/js/Pages/posts/index.svelte`
- Route: Check `routes/web.ts`

### 2. Create Handler

```typescript
// app/handlers/posts.handler.ts
import { Response, Request } from "../../type";
import DB from '../services/DB'
import Validator from '../services/Validator'
import { storePostSchema } from '../validators/post.validator'
import { uuidv7 } from 'uuidv7'

export const PostHandler = {
  async index(request: Request, response: Response) {
    const posts = await DB.selectFrom('posts')
      .innerJoin('users', 'posts.user_id', 'users.id')
      .select(['posts.id', 'posts.title', 'posts.content', 'users.name'])
      .orderBy('posts.created_at', 'desc')
      .execute()

    return response.inertia('posts/index', { posts })
  },

  async store(request: Request, response: Response) {
    const body = await request.json()
    const validationResult = Validator.validate(storePostSchema, body)
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validation error'
      return response.flash('error', firstError).redirect('/posts', 302)
    }

    const { title, content } = validationResult.data!

    await DB.insertInto('posts').values({
      id: uuidv7(),
      user_id: request.user.id,
      title,
      content,
      created_at: Date.now(),
      updated_at: Date.now()
    }).execute()

    return response.flash('success', 'Post created successfully').redirect('/posts', 302)
  },

  async update(request: Request, response: Response) {
    const body = await request.json()
    const id = request.params.id

    const validationResult = Validator.validate(storePostSchema, body)
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validation error'
      return response.flash('error', firstError).redirect(`/posts/${id}/edit`, 303)
    }

    const { title, content } = validationResult.data!

    await DB.updateTable('posts')
      .set({ title, content, updated_at: Date.now() })
      .where('id', '=', id)
      .execute()

    return response.flash('success', 'Post updated successfully').redirect('/posts', 303)
  },

  async destroy(request: Request, response: Response) {
    const id = request.params.id
    await DB.deleteFrom('posts').where('id', '=', id).execute()
    return response.flash('success', 'Post deleted successfully').redirect('/posts', 303)
  }
}
```

### 3. Create Pages

**Index Page** (`resources/js/Pages/posts/index.svelte`):
```svelte
<script>
  import { router, inertia } from '@inertiajs/svelte'
  import { Plus } from 'lucide-svelte'
  import DashboardLayout from '@/Components/DashboardLayout.svelte'
  let { flash, posts } = $props()
</script>

<DashboardLayout activeItem="posts" title="Posts">
  <a href="/posts/create" use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-primary text-white mb-6">
    <Plus class="w-4 h-4" />Buat Post
  </a>

  <div class="space-y-4">
    {#each posts as post}
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 class="font-serif text-xl font-bold">{post.title}</h3>
        <div class="flex gap-2 mt-4">
          <a href={`/posts/${post.id}/edit`} use:inertia class="px-4 py-2 rounded-xl border">Edit</a>
          <button onclick={() => router.delete(`/posts/${post.id}`)} class="px-4 py-2 rounded-xl border">Hapus</button>
        </div>
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
  let { post } = $props()
  let isEdit = !!post
  let formData = $state({
    title: post?.title || '',
    content: post?.content || ''
  })
</script>

<DashboardLayout title={isEdit ? 'Edit Post' : 'Buat Post'}>
  <form onsubmit={(e) => {
    e.preventDefault()
    if (isEdit) {
      router.put(`/posts/${post.id}`, formData)
    } else {
      router.post('/posts', formData)
    }
  }}>
    <input type="text" bind:value={formData.title} placeholder="Title" required />
    <textarea bind:value={formData.content} placeholder="Content" required></textarea>
    <button type="submit">{isEdit ? 'Update' : 'Simpan'}</button>
  </form>
</DashboardLayout>
```

### 4. Add Routes

```typescript
// routes/web.ts
import PostHandler from "../app/handlers/posts.handler"
import Auth from "../app/middlewares/auth.middleware"

Route.get('/posts', [Auth], PostHandler.index)
Route.get('/posts/create', [Auth], PostHandler.create)
Route.post('/posts', [Auth], PostHandler.store)
Route.get('/posts/:id/edit', [Auth], PostHandler.edit)
Route.put('/posts/:id', [Auth], PostHandler.update)
Route.delete('/posts/:id', [Auth], PostHandler.destroy)
```

### 5. Update PROGRESS.md

Mark completed items with `[x]` and add completion date.

---

## Pattern 2: Modify Existing Feature

**Example: Add Excel export to Reports**

### 1. Read PROGRESS.md

```markdown
### Reports
- [x] Handler: ReportHandler (balance, monthly, exportPdf)
- [ ] Excel export functionality (Added: 2025-01-19)
  - [ ] Add exportExcel method to ReportHandler
  - [ ] Add GET /reports/export/excel route
```

### 2. Identify Changes Needed

- Handler: Add `exportExcel` method
- Route: Add new route
- Dependencies: Install `exceljs`

### 3. Implement

```typescript
// Add to PostsHandler.ts
async exportExcel(request: Request, response: Response) {
  // Implementation here
}
```

```typescript
// Add to routes/web.ts
Route.get('/reports/export/excel', [Auth], ReportHandler.exportExcel)
```

### 4. Update PROGRESS.md

```markdown
- [x] Excel export functionality (Added: 2025-01-19, Completed: 2025-01-20)
  - [x] Add exportExcel method to ReportHandler
  - [x] Add GET /reports/export/excel route
```

---

## Pattern 3: New Feature (From Manager Agent)

**Example: WhatsApp Notifications**

### 1. Read PROGRESS.md

```markdown
### Notifications (Added: 2025-01-19)
- [ ] Handler: NotificationHandler (sendReminder)
- [ ] Routes: POST /notifications/send-reminder
- [ ] WhatsApp API integration
```

### 2. Identify Components

- Handler: New `NotificationHandler`
- Route: New route
- Service: WhatsApp integration

### 3. Implement

Create each component following Laju patterns.

### 4. Update PROGRESS.md

Mark all items `[x]` complete with date.

---

## Key Principles

1. **Always check existing files first** - Don't create duplicates
2. **Follow Laju patterns** - Handlers, validators, routes
3. **Use DB directly for simple CRUD** - Repository only for complex queries
4. **Update PROGRESS.md** - After each feature completion
5. **Test manually** - Before committing
6. **Hand off to TEST_AGENT** - For comprehensive testing

## HTTP Status Codes

| Action | Method | Status Code |
|--------|--------|-------------|
| Create | POST | 302 |
| Update | PUT | 303 |
| Delete | DELETE | 303 |
| Get | GET | 200 |

## See Also

- `skills/create-handler.md` - Handler patterns
- `skills/create-svelte-inertia-page.md` - Page patterns
- `skills/repository-pattern.md` - When to use Repository
- `skills/kysely.md` - Database queries
