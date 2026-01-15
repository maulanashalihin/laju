# Svelte 5 Patterns

Guide for using Svelte 5 with runes in Laju applications.

## Table of Contents

1. [Runes Overview](#runes-overview)
2. [State Management](#state-management)
3. [Props and Events](#props-and-events)
4. [Effects and Derived](#effects-and-derived)
5. [Inertia.js Integration](#inertiajs-integration)
6. [Common Patterns](#common-patterns)
7. [Form Handling](#form-handling)

---

## Runes Overview

Svelte 5 introduces runes - a new reactive primitive system:

| Rune | Purpose |
|------|---------|
| `$state` | Reactive state |
| `$derived` | Computed values |
| `$effect` | Side effects |
| `$props` | Component props |
| `$bindable` | Two-way bindable props |

---

## State Management

### Basic State

```svelte
<script>
  // Reactive state
  let count = $state(0);
  let name = $state('');
  let items = $state([]);
  
  function increment() {
    count++;
  }
  
  function addItem(item) {
    items.push(item);  // Mutating arrays works!
  }
</script>

<button onclick={increment}>Count: {count}</button>
<input bind:value={name} />
```

### Object State

```svelte
<script>
  let user = $state({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });
  
  function updateTheme(theme) {
    user.preferences.theme = theme;  // Deep reactivity
  }
</script>

<input bind:value={user.name} />
<select bind:value={user.preferences.theme}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
```

### Array State

```svelte
<script>
  let todos = $state([
    { id: 1, text: 'Learn Svelte 5', done: false },
    { id: 2, text: 'Build app', done: false }
  ]);
  
  function addTodo(text) {
    todos.push({ id: Date.now(), text, done: false });
  }
  
  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }
  
  function removeTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index > -1) todos.splice(index, 1);
  }
</script>

{#each todos as todo}
  <div>
    <input type="checkbox" checked={todo.done} onchange={() => toggleTodo(todo.id)} />
    <span class:done={todo.done}>{todo.text}</span>
    <button onclick={() => removeTodo(todo.id)}>Delete</button>
  </div>
{/each}
```

---

## Props and Events

### Receiving Props

```svelte
<script>
  // Destructure props with $props()
  let { title, count = 0, items = [] } = $props();
</script>

<h1>{title}</h1>
<p>Count: {count}</p>
```

### Props with Types (TypeScript)

```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    onSubmit?: (data: FormData) => void;
  }
  
  let { title, count = 0, onSubmit }: Props = $props();
</script>
```

### Event Callbacks

```svelte
<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
  
  function handleClick(message) {
    console.log('Child clicked:', message);
  }
</script>

<Child onClick={handleClick} />

<!-- Child.svelte -->
<script>
  let { onClick } = $props();
</script>

<button onclick={() => onClick?.('Hello from child')}>
  Click me
</button>
```

### Two-way Binding with $bindable

```svelte
<!-- TextInput.svelte -->
<script>
  let { value = $bindable('') } = $props();
</script>

<input bind:value class="border rounded px-3 py-2 focus:outline-none" />

<!-- Usage -->
<script>
  import TextInput from './TextInput.svelte';
  let name = $state('');
</script>

<TextInput bind:value={name} />
<p>Name: {name}</p>
```

---

## Effects and Derived

### Derived Values

```svelte
<script>
  let items = $state([
    { name: 'Apple', price: 1.5 },
    { name: 'Banana', price: 0.75 }
  ]);
  
  // Computed value - recalculates when items change
  let total = $derived(items.reduce((sum, item) => sum + item.price, 0));
  let count = $derived(items.length);
  let isEmpty = $derived(items.length === 0);
</script>

<p>Items: {count}</p>
<p>Total: ${total.toFixed(2)}</p>
```

### Effects

```svelte
<script>
  let searchQuery = $state('');
  let results = $state([]);
  
  // Run effect when searchQuery changes
  $effect(() => {
    if (searchQuery.length > 2) {
      fetchResults(searchQuery);
    }
  });
  
  async function fetchResults(query) {
    const res = await fetch(`/api/search?q=${query}`);
    results = await res.json();
  }
</script>

<input bind:value={searchQuery} placeholder="Search..." />
```

### Effect with Cleanup

```svelte
<script>
  let count = $state(0);
  
  $effect(() => {
    const interval = setInterval(() => {
      count++;
    }, 1000);
    
    // Cleanup function
    return () => clearInterval(interval);
  });
</script>

<p>Seconds: {count}</p>
```

### Debounced Effect

```svelte
<script>
  let searchQuery = $state('');
  let results = $state([]);
  
  $effect(() => {
    const query = searchQuery;
    
    if (query.length < 3) {
      results = [];
      return;
    }
    
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${query}`);
      results = await res.json();
    }, 300);
    
    return () => clearTimeout(timeout);
  });
</script>
```

---

## Inertia.js Integration

### Page Component

```svelte
<!-- resources/js/Pages/posts/index.svelte -->
<script>
  import { router } from '@inertiajs/svelte';
  
  // Props from controller
  let { posts, user } = $props();
  
  function deletePost(id) {
    if (confirm('Delete this post?')) {
      router.delete(`/posts/${id}`);
    }
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Posts</h1>
  
  {#if user}
    <a href="/posts/create" class="bg-blue-500 text-white px-4 py-2 rounded">
      Create Post
    </a>
  {/if}
  
  <div class="mt-4 space-y-4">
    {#each posts as post}
      <div class="border p-4 rounded">
        <h2 class="font-semibold">{post.title}</h2>
        <p class="text-gray-600">{post.content}</p>
        
        {#if user?.id === post.user_id}
          <div class="mt-2 flex gap-2">
            <a href={`/posts/${post.id}/edit`} class="text-blue-500">Edit</a>
            <button onclick={() => deletePost(post.id)} class="text-red-500">
              Delete
            </button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
```

### Navigation

There are three ways to navigate in Inertia.js with Svelte:

#### 1. Using Link Component

```svelte
<script>
  import { Link } from '@inertiajs/svelte';
</script>

<Link href="/posts">Posts</Link>
<Link href="/dashboard" method="post" as="button">Create</Link>
```

#### 2. Using `use:inertia` Directive

```svelte
<script>
  import { inertia } from '@inertiajs/svelte';
</script>

<!-- With anchor tag -->
<a href="/posts" use:inertia>Posts</a>

<!-- With button -->
<button use:inertia href="/dashboard">Go to Dashboard</button>
```

#### 3. Programmatic Navigation

```svelte
<script>
  import { router } from '@inertiajs/svelte';
  
  function navigate(url) {
    router.visit(url);
  }
  
  function goBack() {
    history.back();
  }
  
  function visitWithMethod() {
    router.post('/posts', { title: 'New Post' });
  }
</script>

<button onclick={() => navigate('/dashboard')}>Go to Dashboard</button>
<button onclick={goBack}>Back</button>
<button onclick={visitWithMethod}>Create Post</button>
```

---

## Common Patterns

### Modal Component

```svelte
<!-- Modal.svelte -->
<script>
  let { open = $bindable(false), title, children } = $props();
  
  function close() {
    open = false;
  }
  
  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick={close}>
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" onclick={(e) => e.stopPropagation()}>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{title}</h2>
        <button onclick={close} class="text-gray-500 hover:text-gray-700">X</button>
      </div>
      {@render children()}
    </div>
  </div>
{/if}

<!-- Usage -->
<script>
  import Modal from './Modal.svelte';
  let showModal = $state(false);
</script>

<button onclick={() => showModal = true}>Open Modal</button>

<Modal bind:open={showModal} title="Confirm Action">
  <p>Are you sure you want to proceed?</p>
  <div class="mt-4 flex gap-2">
    <button onclick={() => showModal = false}>Cancel</button>
    <button class="bg-blue-500 text-white px-4 py-2 rounded">Confirm</button>
  </div>
</Modal>
```

### Toast Notifications

#### Quick Method (Recommended)

Use the `Toast` helper function for quick notifications:

```svelte
<script>
  import { Toast } from '@/Components/helper.js';
  
  function showSuccess() {
    Toast('Operation successful!', 'success', 3000);
  }
  
  function showError() {
    Toast('Something went wrong', 'error', 3000);
  }
  
  function showWarning() {
    Toast('Please check your input', 'warning', 3000);
  }
  
  function showInfo() {
    Toast('New message received', 'info', 3000);
  }
</script>

<button onclick={showSuccess}>Show Success</button>
<button onclick={showError}>Show Error</button>
<button onclick={showWarning}>Show Warning</button>
<button onclick={showInfo}>Show Info</button>
```

#### Custom Component Method

Create a reusable Toast component:

```svelte
<!-- Toast.svelte -->
<script>
  let toasts = $state([]);
  
  export function show(message, type = 'info', duration = 3000) {
    const id = Date.now();
    toasts.push({ id, message, type });
    
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id);
      if (index > -1) toasts.splice(index, 1);
    }, duration);
  }
</script>

<div class="fixed bottom-4 right-4 space-y-2 z-50">
  {#each toasts as toast}
    <div 
      class="px-4 py-2 rounded shadow-lg"
      class:bg-green-500={toast.type === 'success'}
      class:bg-red-500={toast.type === 'error'}
      class:bg-blue-500={toast.type === 'info'}
    >
      <p class="text-white">{toast.message}</p>
    </div>
  {/each}
</div>
```

### Loading State

```svelte
<script>
  let loading = $state(false);
  let data = $state(null);
  
  async function fetchData() {
    loading = true;
    try {
      const res = await fetch('/api/data');
      data = await res.json();
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <div class="flex justify-center p-4">
    <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
{:else if data}
  <div>{JSON.stringify(data)}</div>
{:else}
  <button onclick={fetchData}>Load Data</button>
{/if}
```

---

## Form Handling

### Simple Form with Flash Messages (Recommended)

For most forms, use flash messages for error handling. The backend handles validation and sends flash messages automatically.

**Note:** See [Flash Messages & Error Handling](04-ROUTING-CONTROLLERS.md#flash-messages--error-handling) in the Routing & Controllers documentation for backend validation patterns.

```svelte
<script>
  import { router } from '@inertiajs/svelte';
  
  let { user, flash } = $props();
  
  let form = $state({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  let isLoading = $state(false);
  
  function handleSubmit() {
    isLoading = true;
    
    router.post('/change-profile', form, {
      onFinish: () => isLoading = false
    });
  }
</script>

<!-- Display flash messages from backend -->
{#if flash?.error}
  <div class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
    <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span class="text-red-400 text-sm">{flash.error}</span>
  </div>
{/if}

{#if flash?.success}
  <div class="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
    <svg class="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span class="text-green-400 text-sm">{flash.success}</span>
  </div>
{/if}

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1">Name</label>
    <input 
      bind:value={form.name}
      class="w-full border rounded px-3 py-2 focus:outline-none"
    />
  </div>
  
  <div>
    <label class="block text-sm font-medium mb-1">Email</label>
    <input 
      type="email"
      bind:value={form.email}
      class="w-full border rounded px-3 py-2 focus:outline-none"
    />
  </div>
  
  <div>
    <label class="block text-sm font-medium mb-1">Phone</label>
    <input 
      type="tel"
      bind:value={form.phone}
      class="w-full border rounded px-3 py-2 focus:outline-none"
    />
  </div>
  
  <button 
    type="submit"
    disabled={isLoading}
    class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    {isLoading ? 'Saving...' : 'Save Changes'}
  </button>
</form>
```

**Backend Controller:**
```typescript
public async changeProfile(request: Request, response: Response) {
  const body = await request.json();

  // Backend validates
  if (!body.name || body.name.length < 2) {
    return response.flash("error", "Name must be at least 2 characters").redirect("/profile", 303);
  }

  if (!body.email || !body.email.includes('@')) {
    return response.flash("error", "Invalid email address").redirect("/profile", 303);
  }

  // Update database
  await DB.from("users").where("id", request.user.id).update(body);

  // Send success message
  return response.flash("success", "Profile updated successfully!").redirect("/profile", 303);
}
```

### Form with Auto Toast (Simpler)

Use `$effect` to automatically display flash messages as toast notifications:

```svelte
<script>
  import { router } from '@inertiajs/svelte';
  import { Toast } from '@/Components/helper.js';

  let { user, flash } = $props();

  // Auto-display flash messages as toasts
  $effect(() => {
    if (flash?.error) {
      Toast(flash.error, 'error', 3000);
    }
    if (flash?.success) {
      Toast(flash.success, 'success', 3000);
    }
    if (flash?.warning) {
      Toast(flash.warning, 'warning', 3000);
    }
    if (flash?.info) {
      Toast(flash.info, 'info', 3000);
    }
  });

  let form = $state({
    name: user?.name || '',
    email: user?.email || ''
  });

  let isLoading = $state(false);

  function handleSubmit() {
    isLoading = true;
    router.post('/change-profile', form, {
      onFinish: () => isLoading = false
    });
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1">Name</label>
    <input
      bind:value={form.name}
      class="w-full border rounded px-3 py-2 focus:outline-none"
    />
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Email</label>
    <input
      type="email"
      bind:value={form.email}
      class="w-full border rounded px-3 py-2 focus:outline-none"
    />
  </div>

  <button
    type="submit"
    disabled={isLoading}
    class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    {isLoading ? 'Saving...' : 'Save Changes'}
  </button>
</form>
```

This approach automatically displays flash messages as toasts without manual HTML rendering.

---

## Error Handling with Flash Messages

### Flash Messages Overview

Flash messages are temporary messages sent from the backend to the frontend via cookies. They are automatically parsed by the inertia middleware and passed as props to your Svelte components.

### Supported Flash Types

- `error` - Error messages (red styling)
- `success` - Success messages (green styling)
- `info` - Information messages (blue styling)
- `warning` - Warning messages (yellow styling)

### Basic Flash Message Usage

```svelte
<script>
import { router } from '@inertiajs/svelte';

let { flash } = $props();
</script>

{#if flash?.error}
  <div class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
    <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span class="text-red-400 text-sm">{flash.error}</span>
  </div>
{/if}

{#if flash?.success}
  <div class="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
    <svg class="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span class="text-green-400 text-sm">{flash.success}</span>
  </div>
{/if}
```

---

### Error Handling Best Practices

#### 1. Show Loading States

Display loading indicators during async operations:

```svelte
<button 
  type="submit"
  disabled={isLoading}
  class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
>
  {isLoading ? 'Processing...' : 'Submit'}
</button>
```

#### 2. User-Friendly Error Messages

Backend controllers should send clear, actionable error messages:

```typescript
// Controller
return response
  .flash("error", "Email already registered. Please use a different email or login.")
  .redirect("/register");
```

---

## Next Steps

- [Tutorials](11-TUTORIALS.md)
- [Best Practices](09-BEST-PRACTICES.md)
- [API Reference](07-API-REFERENCE.md)
