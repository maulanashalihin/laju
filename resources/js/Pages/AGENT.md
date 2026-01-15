# Pages Guide for AI

## Core Principles

1. **Svelte 5** - Use runes (`$state`, `$props`)
2. **Match routes** - Page paths match controller inertia responses
3. **Handle flash** - Display `flash` prop for errors/success
4. **Use Inertia router** - Form submissions via `router.post/put/delete`
5. **Organize by feature** - Group related pages in subdirectories

## Frontend Generation Rules

**Design Principles:**
- Prioritize unique and creative UI/UX solutions
- Support experimental CSS features and animations
- Encourage creative micro-interactions
- Focus on custom-built components over standard libraries

**Tech Stack:**
- Tailwind CSS v4
- Svelte Framework
- CSS-in-JS solutions

**Styling:**
- Prefer custom design systems
- Use modern CSS (Container Queries, CSS Grid, etc.)
- Enable creative responsive design patterns
- Support advanced theming systems
- Encourage CSS art and creative visuals
- Always use `focus:outline-none` on form inputs
- Avoid/reduce emoji usage

## File Structure

```
resources/js/Pages/
├── home.svelte              # Home page
├── profile.svelte           # User profile
├── auth/                    # Auth pages
│   ├── login.svelte
│   ├── register.svelte
│   └── forgot-password.svelte
├── posts/                   # Post pages
│   ├── index.svelte         # List
│   ├── create.svelte        # Create form
│   ├── show.svelte          # Single post
│   └── edit.svelte          # Edit form
└── Components/              # Reusable components
```

## Basic Pattern

```svelte
<script>
  import { inertia, router } from '@inertiajs/svelte'
  import Header from '../Components/Header.svelte'
  let { flash, posts } = $props()
  let isLoading = $state(false)
</script>

<Header />
{#if flash?.error}
  <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{flash.error}</div>
{/if}
<div class="p-6"><!-- Content --></div>
```

## Display Page

```svelte
<script>
  import { fly } from 'svelte/transition'
  import Header from '../Components/Header.svelte'
  let { posts } = $props()
</script>

<Header />
<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Posts</h1>
  <div class="grid gap-4">
    {#each posts as post, i}
      <div class="p-6 bg-white dark:bg-slate-900 rounded-lg shadow" in:fly={{ y: 20, duration: 800, delay: i * 50 }}>
        <h2 class="text-xl font-bold mb-2">{post.title}</h2>
        <p class="text-slate-600 dark:text-slate-400">{post.content}</p>
      </div>
    {/each}
  </div>
</div>
```

## Form Page

```svelte
<script>
  import { router } from '@inertiajs/svelte'
  import Header from '../Components/Header.svelte'
  let { flash, post } = $props()
  let form = $state({ title: post?.title || '', content: post?.content || '' })
  let isLoading = $state(false)
  let serverError = $state('')

  function submitForm() {
    serverError = ''
    isLoading = true
    router.post('/posts', form, {
      onFinish: () => isLoading = false,
      onError: (errors) => {
        isLoading = false
        serverError = Object.values(errors)[0] || 'Terjadi kesalahan'
      }
    })
  }
</script>

<Header />
<div class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Create Post</h1>
  {#if flash?.error}
    <div class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{flash.error}</div>
  {/if}
  {#if serverError}
    <div class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{serverError}</div>
  {/if}
  <form onsubmit={(e) => { e.preventDefault(); submitForm(); }}>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Title</label>
        <input bind:value={form.title} type="text" class="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 focus:outline-none" placeholder="Enter title" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Content</label>
        <textarea bind:value={form.content} rows="6" class="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 focus:outline-none" placeholder="Enter content"></textarea>
      </div>
      <button type="submit" disabled={isLoading} class="px-6 py-3 bg-brand-600 text-white rounded-lg disabled:opacity-50">
        {#if isLoading}Saving...{:else}Save Post{/if}
      </button>
    </div>
  </form>
</div>
```

## Update Form

```svelte
<script>
  import { router } from '@inertiajs/svelte'
  let { flash, post } = $props()
  let form = $state({ title: post.title, content: post.content })
  let isLoading = $state(false)
  let serverError = $state('')

  function submitForm() {
    serverError = ''
    isLoading = true
    router.put(`/posts/${post.id}`, form, {
      onFinish: () => isLoading = false,
      onError: (errors) => {
        isLoading = false
        serverError = Object.values(errors)[0] || 'Terjadi kesalahan'
      }
    })
  }
</script>

<!-- Similar to create form, but uses router.put() -->
```

## Delete Action

```svelte
<script>
  import { router } from '@inertiajs/svelte'
  let { post } = $props()

  function deletePost() {
    if (confirm('Are you sure?')) {
      router.delete(`/posts/${post.id}`)
    }
  }
</script>

<button onclick={deletePost} class="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
```

## Inertia Links

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<a href="/posts" use:inertia>All Posts</a>
<a href="/posts?page=2" use:inertia>Next Page</a>
<a href="https://example.com" target="_blank">External</a>
```

## Flash Messages

```svelte
<script>
  let { flash } = $props()
</script>

{#if flash?.error}
  <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{flash.error}</div>
{/if}

{#if flash?.success}
  <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">{flash.success}</div>
{/if}
```

## Transitions

```svelte
<script>
  import { fly, fade } from 'svelte/transition'
</script>

<div in:fly={{ y: 20, duration: 800 }}>Content</div>

{#each items as item, i}
  <div in:fly={{ y: 20, duration: 800, delay: i * 50 }}>{item}</div>
{/each}
```

## Complete Example

```svelte
<script>
  import { fly } from 'svelte/transition'
  import Header from '../Components/Header.svelte'
  let { posts, flash } = $props()
</script>

<Header />

<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Posts</h1>
    <a href="/posts/create" use:inertia class="px-4 py-2 bg-brand-600 text-white rounded-lg">Create Post</a>
  </div>

  {#if flash?.success}
    <div class="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">{flash.success}</div>
  {/if}

  <div class="grid gap-4">
    {#each posts as post, i}
      <div class="p-6 bg-white dark:bg-slate-900 rounded-lg shadow" in:fly={{ y: 20, duration: 800, delay: i * 50 }}>
        <h2 class="text-xl font-bold mb-2">{post.title}</h2>
        <p class="text-slate-600 dark:text-slate-400">{post.content}</p>
        <div class="mt-4 flex gap-2">
          <a href={`/posts/${post.id}`} use:inertia class="text-brand-600">View</a>
          <a href={`/posts/${post.id}/edit`} use:inertia class="text-brand-600">Edit</a>
        </div>
      </div>
    {/each}
  </div>
</div>
```

## Quick Reference

| Pattern | Usage | Example |
|---------|-------|---------|
| Display data | `$props()` | `let { posts } = $props()` |
| Reactive state | `$state()` | `let form = $state({ title: '' })` |
| Form submit | `router.post()` | `router.post('/posts', form)` |
| Update | `router.put()` | `router.put('/posts/1', form)` |
| Delete | `router.delete()` | `router.delete('/posts/1')` |
| Links | `use:inertia` | `<a href="/path" use:inertia>` |
| Flash messages | `flash` prop | `{#if flash?.error}{flash.error}{/if}` |
| Transitions | `in:fly` | `<div in:fly={{ y: 20 }}>` |

## Controller to Page Mapping

| Controller | Page Path | Type |
|------------|-----------|------|
| `index()` | `posts/index.svelte` | List |
| `create()` | `posts/create.svelte` | Form |
| `show()` | `posts/show.svelte` | Display |
| `edit()` | `posts/edit.svelte` | Form |
| `store()` | Redirects to `index` | - |
| `update()` | Redirects to `index` | - |
| `destroy()` | Redirects to `index` | - |

## Best Practices

1. **$state for form data** - Reactive state for user inputs
2. **$props for server data** - Data from controller
3. **Handle loading states** - Show loading during submission
4. **Display errors clearly** - Show flash and validation errors
5. **Use transitions** - Add smooth animations
6. **Import components** - Reuse from Components folder
7. **Match controller naming** - Page paths match controller inertia calls
8. **Create reusable components** - If UI repeats, create in `resources/js/Components/`
9. **Use focus:outline-none** - Always on form inputs
10. **Avoid emojis** - Use icons or text instead