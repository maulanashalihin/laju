# Pages Guide for AI

## Core Principles

1. **Svelte 5** - Use runes (`$state`, `$props`)
2. **Match routes** - Page paths match controller inertia responses
3. **Handle flash** - Display `flash` prop for errors/success
4. **Use Inertia router** - Form submissions via `router.post/put/delete`

**Important:**
- **Generate Pages in JavaScript only** - Do NOT use TypeScript
- Use `.svelte` extension with JavaScript syntax (no type annotations)
- No `: string`, `: number`, `: boolean`, or any TypeScript types

**Tech Stack:** Tailwind CSS v3, Svelte, CSS-in-JS
**Styling:** Always use `focus:outline-none` on form inputs, avoid emojis

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

## Form Page (Create/Edit)

```svelte
<script>
  import { router } from '@inertiajs/svelte'
  import { Toast } from '../Components/helper.js'
  import { onMount } from 'svelte'
  import Header from '../Components/Header.svelte'
  let { flash, post } = $props()
  let form = $state({ title: post?.title || '', content: post?.content || '' })
  let isLoading = $state(false)

  onMount(() => {
    if (flash?.error) {
      Toast(flash.error, 'error')
    }
    if (flash?.success) {
      Toast(flash.success, 'success')
    }
  })

  function submitForm() {
    isLoading = true
    const method = post ? router.put : router.post
    const url = post ? `/posts/${post.id}` : '/posts'
    method(url, form, {
      onFinish: () => isLoading = false
    })
  }
</script>

<Header />
<div class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">{post ? 'Edit Post' : 'Create Post'}</h1>
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
        {#if isLoading}Saving...{:else}{post ? 'Update' : 'Save'} Post{/if}
      </button>
    </div>
  </form>
</div>
```

**Important:** 
- **Use `flash` prop** for error/success messages from controller
- **Display flash in `onMount`** using Toast for long forms
- **Don't use `onError` callback** - errors come from flash prop
- **Controller uses `response.flash()`** to send messages

## Common Patterns

**Delete:**
```svelte
import { router } from '@inertiajs/svelte'
function deletePost() {
  if (confirm('Are you sure?')) router.delete(`/posts/${post.id}`)
}
```

**Inertia Links:**
```svelte
import { inertia } from '@inertiajs/svelte'
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
| Links | `use:inertia` | `<a href="/path" use:inertia>` |
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