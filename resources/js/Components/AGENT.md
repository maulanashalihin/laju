# Components Guide for AI

## Core Principles

1. **Svelte 5** - Use runes (`$state`, `$props`)
2. **Make reusable** - Components should be usable across multiple pages
3. **Accept props** - Use `$props()` to accept data from parent
4. **Keep focused** - Each component should have a single responsibility

**Important:**
- **Generate Components in JavaScript only** - Do NOT use TypeScript
- Use `.svelte` extension with JavaScript syntax (no type annotations)
- No `: string`, `: number`, `: boolean`, or any TypeScript types

## Basic Pattern

```svelte
<script>
  let { title, content } = $props()
  let isOpen = $state(false)
</script>

<div class="p-4 rounded-lg bg-white dark:bg-slate-900">
  <h2 class="text-xl font-bold">{title}</h2>
  <p>{content}</p>
</div>
```

## Card Component

```svelte
<script>
  import { fly } from 'svelte/transition'
  let { title, description, icon = null, delay = 0 } = $props()
</script>

<div class="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all" in:fly={{ y: 20, duration: 800, delay }}>
  {#if icon}
    <div class="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 rounded-xl flex items-center justify-center mb-4">
      {@html icon}
    </div>
  {/if}
  <h3 class="text-xl font-bold mb-2">{title}</h3>
  <p class="text-slate-600 dark:text-slate-400">{description}</p>
</div>
```

**Usage:**
```svelte
<script>
  import Card from '../Components/Card.svelte'
</script>

<Card title="Feature" description="Description here" icon="<svg>...</svg>" delay={100} />
```

## Modal Component

```svelte
<script>
  import { fly } from 'svelte/transition'
  let { isOpen = $bindable(), title, onClose = () => {} } = $props()

  function close() {
    isOpen = false
    onClose()
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" transition:fade={{ duration: 200 }} on:click={close}></div>
    <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full mx-4" transition:fly={{ y: 20, duration: 300 }}>
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">{title}</h2>
          <button onclick={close} class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">✕</button>
        </div>
        <slot />
      </div>
    </div>
  </div>
{/if}
```

**Usage:**
```svelte
<script>
  import Modal from '../Components/Modal.svelte'
  let showModal = $state(false)
</script>

<Modal bind:isOpen={showModal} title="Edit Post">
  <form><!-- Form content --></form>
</Modal>

<button onclick={() => showModal = true}>Open Modal</button>
```

## Alert Component

```svelte
<script>
  import { fade } from 'svelte/transition'
  let { type = 'info', message, onDismiss = () => {} } = $props()

  const types = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400'
  }

  let visible = $state(true)

  function dismiss() {
    visible = false
    onDismiss()
  }
</script>

{#if visible}
  <div class="p-4 rounded-lg border flex items-start gap-3" class={types[type]} transition:fade={{ duration: 300 }}>
    <div class="flex-1">{message}</div>
    <button onclick={dismiss} class="hover:opacity-70">✕</button>
  </div>
{/if}
```

**Usage:**
```svelte
<script>
  import Alert from '../Components/Alert.svelte'
</script>

<Alert type="success" message="Post created successfully!" />
```

## Loading Spinner Component

```svelte
<script>
  let { size = 'md' } = $props()

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
</script>

<div class="animate-spin {sizes[size]}">
  <svg class="w-full h-full" viewBox="0 0 24 24">
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
      fill="none"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
</div>
```

**Usage:**
```svelte
<script>
  import Spinner from '../Components/Spinner.svelte'
</script>

{#if isLoading}
  <Spinner />
{/if}
```

## Quick Reference

| Pattern | Usage | Example |
|---------|-------|---------|
| Props | `$props()` | `let { title } = $props()` |
| Bindable props | `$bindable()` | `let { value = $bindable() } = $props()` |
| Local state | `$state()` | `let isOpen = $state(false)` |
| Slots | `<slot />` | Parent content injected here |
| Events | `on:click` | `<button on:click={handleClick}>` |
| Transitions | `in:fly` | `<div in:fly={{ y: 20 }}>` |

## Best Practices

1. **Use $props for data** - Accept data from parent
2. **Use $bindable for two-way** - Allow parent to bind to component state
3. **Use $state for internal** - Component-specific reactive state
4. **Use slots for flexibility** - Allow parent to pass custom content
5. **Keep components small** - Single responsibility per component
6. **Handle events properly** - Emit events for parent communication
7. **Add transitions** - Smooth animations for better UX
