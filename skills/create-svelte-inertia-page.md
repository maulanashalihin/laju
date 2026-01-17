# Pages Guide for AI

## Core Principles

1. **Check existing pages** - Always check if page exists in `resources/js/Pages/` before creating new ones
2. **Svelte 5** - Use runes (`$state`, `$props`)
3. **Import Inertia v2** - Import from `@inertiajs/svelte` (use `router`, `inertia`)
4. **Match routes** - Page paths match controller inertia responses
5. **Handle flash** - Display `flash` prop for errors/success
6. **Use Inertia v2 router** - Form submissions via `router.post/put/delete`
7. **Inertia v2 API** - Use `use:inertia` directive on `<a>` tags, `router` for navigation
8. **Use DashboardLayout** - Import and use DashboardLayout from `@/Components/DashboardLayout.svelte`
9. **Match UI kit** - Match UI components from `workflow/ui-kit.html`

**Important:**
- **Generate Pages in JavaScript only** - Do NOT use TypeScript
- Use `.svelte` extension with JavaScript syntax (no type annotations)
- No `: string`, `: number`, `: boolean`, or any TypeScript types

**Tech Stack:** Tailwind CSS v3, Svelte 5, Inertia.js v2
**Styling:** Always use `focus:outline-none` on form inputs, avoid emojis
**Icons:** Lucide Icons is the default icon library for laju.dev

### Using Lucide Icons

```svelte
<script>
  import { IconName } from 'lucide-svelte'
</script>

<IconName class="w-5 h-5" />
```

**Common Icons:**
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

**Styling:** Use Tailwind classes for sizing and colors:
```svelte
<IconName class="w-4 h-4" />           <!-- Small -->
<IconName class="w-5 h-5" />           <!-- Medium -->
<IconName class="w-6 h-6" />           <!-- Large -->
<IconName class="text-gray-500" />     <!-- Color -->
<IconName class="w-5 h-5 text-red-500" /> <!-- Combined -->
```

**Icon Resources:** Visit [lucide.dev/icons](https://lucide.dev/icons) to browse available icons

## Basic Pattern

```svelte
<script>
  import { router } from '@inertiajs/svelte'
  import DashboardLayout from '@/Components/DashboardLayout.svelte'
  let { flash, posts } = $props()
  let isLoading = $state(false)
</script>

<DashboardLayout title="Posts" subtitle="Kelola post Anda">
  {#if flash?.error}
    <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{flash.error}</div>
  {/if}
  <div class="p-6">{!-- Content --}</div>
</DashboardLayout>
``` 
 

## Display Page

```svelte
<script>
  import { fly } from 'svelte/transition'
  import DashboardLayout from '@/Components/DashboardLayout.svelte'
  let { posts } = $props()
</script>

<DashboardLayout title="Posts" subtitle="Daftar post">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Posts</h1>
    <div class="grid gap-4">
      {#each posts as post, i}
        <div class="p-6 bg-white rounded-lg shadow" in:fly={{ y: 20, duration: 800, delay: i * 50 }}>
          <h2 class="text-xl font-bold mb-2">{post.title}</h2>
          <p class="text-slate-600">{post.content}</p>
        </div>
      {/each}
    </div>
  </div>
</DashboardLayout>
```

## Form Page (Create/Edit)

```svelte
<script>
  import { router } from '@inertiajs/svelte'
  import DashboardLayout from '@/Components/DashboardLayout.svelte'
  let { flash, post } = $props()
  let isEdit = !!post
  let form = $state({ title: post?.title || '', content: post?.content || '' })
  let isLoading = $state(false)

  function submitForm() {
    isLoading = true
    const url = isEdit ? `/posts/${post.id}` : '/posts'
    const method = isEdit ? router.put : router.post
    method(url, form, {
      onFinish: () => isLoading = false
    })
  }
</script>

<DashboardLayout title={isEdit ? 'Edit Post' : 'Create Post'} subtitle={isEdit ? 'Edit post Anda' : 'Buat post baru'}>
  {#if flash?.error}
    <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">{flash.error}</div>
  {/if}
  <div class="max-w-2xl mx-auto px-4 py-8">
    <form onsubmit={(e) => { e.preventDefault(); submitForm(); }}>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <input bind:value={form.title} type="text" class="w-full px-4 py-2 rounded-lg border focus:outline-none" placeholder="Enter title" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Content</label>
          <textarea bind:value={form.content} rows="6" class="w-full px-4 py-2 rounded-lg border focus:outline-none" placeholder="Enter content"></textarea>
        </div>
        <button type="submit" disabled={isLoading} class="px-6 py-3 bg-brand-600 text-white rounded-lg disabled:opacity-50">
          {#if isLoading}Saving...{:else}{isEdit ? 'Update' : 'Save'} Post{/if}
        </button>
      </div>
    </form>
  </div>
</DashboardLayout>
```

**Important:** 
- **Use `flash` prop** for error/success messages from controller
- **Display flash directly in template** - no need for onMount or Toast
- **Controller uses `response.flash()`** to send messages

## Common Patterns

**Delete:**
```svelte
import { router } from '@inertiajs/svelte'
function deletePost() {
  if (confirm('Are you sure?')) router.delete(`/posts/${post.id}`)
}
```

**Inertia Links (v2):**
```svelte
<!-- Add use:inertia directive to <a> tags -->
<a href="/posts" use:inertia>All Posts</a>
 
```

**Flash Messages:**
```svelte
{#if flash?.error}
  <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{flash.error}</div>
{/if}
{#if flash?.success}
  <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">{flash.success}</div>
{/if}
```

**Transitions:**
```svelte
import { fly } from 'svelte/transition'
<div in:fly={{ y: 20, duration: 800 }}>Content</div>
{#each items as item, i}
  <div in:fly={{ y: 20, duration: 800, delay: i * 50 }}>{item}</div>
{/each}
```

## Quick Reference

| Pattern | Usage | Example |
|---------|-------|---------|
| Display data | `$props()` | `let { posts } = $props()` |
| Reactive state | `$state()` | `let form = $state({ title: '' })` |
| Form submit | `router.post()` | `router.post('/posts', form)` |
| Update | `router.put()` | `router.put('/posts/1', form)` |
| Delete | `router.delete()` | `router.delete('/posts/1')` |
| Links | `use:inertia` directive | `<a href="/path" use:inertia>` |
| Flash messages | `flash` prop | `{#if flash?.error}{flash.error}{/if}` |
| Transitions | `in:fly` | `<div in:fly={{ y: 20 }}>` |

## Controller to Page Mapping

| Controller | Page Path |
|------------|-----------|
| `index()` | `posts/index.svelte` |
| `create()` | `posts/form.svelte` (no post prop) |
| `show()` | `posts/show.svelte` |
| `edit()` | `posts/form.svelte` (with post prop) |
| `store/update/destroy()` | Redirect to `index` |

**Note:** `create()` and `edit()` both use the same `form.svelte` page. Pass `post` prop for edit, omit for create.

## Best Practices

1. **$state for form data** - Reactive state for user inputs
2. **$props for server data** - Data from controller
3. **Handle loading & errors** - Show loading during submission, display flash errors
4. **Use transitions** - Add smooth animations
5. **Reuse components** - Import from Components folder
6. **Match controller naming** - Page paths match controller inertia calls