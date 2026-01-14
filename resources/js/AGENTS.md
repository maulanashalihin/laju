# Laju Frontend (Svelte 5 + Inertia.js)

## Tech Stack

- **Framework**: Svelte 5 with Runes
- **Routing**: Inertia.js
- **Styling**: TailwindCSS v4
- **Build Tool**: Vite

## Svelte 5 Runes

### State
```svelte
<script>
let count = $state(0);
</script>
```

### Computed
```svelte
<script>
let a = $state(1);
let b = $state(2);
let total = $derived(a + b);
</script>
```

### Props
```svelte
<script>
let { title } = $props();
let { value = $bindable('') } = $props(); // Two-way binding
</script>
```

### Effects
```svelte
<script>
$effect(() => {
   console.log(count);
});
</script>
```

## Components

### Component Structure
```svelte
<script>
let { title } = $props();
</script>

<div class="p-4">
   <h1>{title}</h1>
</div>

<style>
   /* Use TailwindCSS instead of scoped styles */
</style>
```

### Component Location
- **Components/**: Reusable UI components
- **Pages/**: Page components (routed by Inertia)

## Inertia.js

### Navigation
```svelte
<script>
import { inertia } from '@inertiajs/svelte';
</script>

<a href="/path" use:inertia>Link</a>

<!-- With data -->
<a href="/path" use:inertia={{ data: { key: 'value' } }}>Link</a>
```

### Programmatic Navigation
```svelte
<script>
import { router } from '@inertiajs/svelte';

function navigate() {
   router.visit('/path', {
      method: 'get',
      data: { key: 'value' },
      preserveState: true,
      replace: false
   });
}
</script>
```

### Form Submissions

**Pattern 1: Inertia Forms with Flash Messages (Recommended)**

For all forms (auth, updates, etc.) with error handling:
```svelte
<script>
import { router } from '@inertiajs/svelte';

let form = $state({ email: '', password: '' });
let isLoading = $state(false);
let serverError = $state('');
let { flash } = $props();

function submitForm() {
  serverError = '';
  isLoading = true;

  router.post('/login', form, {
    onFinish: () => isLoading = false,
    onError: (errors) => {
      isLoading = false;
      if (errors.email) serverError = errors.email;
      else if (errors.password) serverError = errors.password;
      else serverError = 'Terjadi kesalahan. Silakan periksa input Anda.';
    }
  });
}
</script>

{#if flash?.error}
  <div class="text-red-400">{flash.error}</div>
{/if}
{#if flash?.success}
  <div class="text-green-400">{flash.success}</div>
{/if}
{#if serverError}
  <div class="text-red-400">{serverError}</div>
{/if}

<form onsubmit={(e) => { e.preventDefault(); submitForm(); }}>
  <!-- form fields -->
</form>
```

**Controller:**
```typescript
public async update(request: Request, response: Response) {
  const validationResult = Validator.validate(schema, await request.json());
  if (!validationResult.success) {
    const errors = validationResult.errors || {};
    const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
    return response.flash("error", firstError).redirect("/profile", 303);
  }

  await DB.from("users").where("id", id).update(validationResult.data!);
  return response.flash("success", "Updated!").redirect("/profile", 303);
}
```

**Pattern 2: Form with Local State (Best for Edit Forms)**

For forms that need to sync with props data and update without full reload:
```svelte
<script>
import { router } from '@inertiajs/svelte';
import { page } from '@inertiajs/svelte';

let { user, flash } = $props();

// Local state for form inputs
let formName = $state('');
let formEmail = $state('');
let formPhone = $state('');
let isLoading = $state(false);

// Sync local state with props
$effect(() => {
  if (user?.name !== undefined) formName = user.name;
  if (user?.email !== undefined) formEmail = user.email;
  if (user?.phone !== undefined) formPhone = user.phone;
});

function changeProfile() {
  router.post('/change-profile', {
    name: formName,
    email: formEmail,
    phone: formPhone
  }, {
    onStart: () => isLoading = true,
    onFinish: () => isLoading = false
  });
}
</script>

<form onsubmit={(e) => { e.preventDefault(); changeProfile(); }}>
  <input bind:value={formName} type="text" id="name" />
  <input bind:value={formEmail} type="email" id="email" />
  <input bind:value={formPhone} type="text" id="phone" />
  <button type="submit" disabled={isLoading}>
    {isLoading ? 'Saving...' : 'Save'}
  </button>
</form>
```

**Controller:**
```typescript
public async changeProfile(request: Request, response: Response) {
  if (!request.user) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const body = await request.json();
  const validationResult = Validator.validate(schema, body);

  if (!validationResult.success) {
    const errors = validationResult.errors || {};
    const firstError = Object.values(errors)[0]?.[0] || 'Terjadi kesalahan validasi';
    return response.flash("error", firstError).redirect("/profile", 303);
  }

  const { name, email, phone } = validationResult.data!;

  await DB.from("users").where("id", request.user.id).update({
    name,
    email,
    phone: phone || null,
  });

  await Authenticate.invalidateUserSessions(request.user.id);

  return response.flash("success", "Profile berhasil diupdate").redirect("/profile", 303);
}
```

**Pattern 3: Simple Inertia Forms**
```svelte
<script>
import { useForm } from '@inertiajs/svelte';
let form = useForm({ name: '', email: '' });
function submit() { form.post('/submit'); }
</script>
```
Controller: `return response.redirect('/path');`

**Important Notes:**
- Always use `onsubmit={(e) => { e.preventDefault(); handler(); }}` for Svelte 5 to prevent default form submission
- Use `router.post()` with `onStart` and `onFinish` callbacks for loading states
- Backend must use `response.redirect("/path", 303)` for POST requests (303 prevents browser from changing HTTP method)
- Flash messages are automatically parsed from cookies and passed to page props

### Flash Messages

Flash messages are automatically parsed from cookies and passed to page props.

**Supported types:** `error`, `success`, `info`, `warning`

**Usage:**
```svelte
<script>
let { flash } = $props();
</script>

{#if flash?.error}
  <div class="text-red-400">{flash.error}</div>
{/if}
{#if flash?.success}
  <div class="text-green-400">{flash.success}</div>
{/if}
```

**Controller:**
```typescript
return response.flash("error", "Email sudah terdaftar").redirect("/login");
```

## Styling (TailwindCSS v4)

### Import
```css
@import "tailwindcss";
```

### Best Practices
- Use utility classes instead of custom CSS
- Use `focus:outline-none` for interactive elements
- Use modern CSS features (Container Queries, Grid)
- Minimal emoji usage
- Use responsive prefixes (md:, lg:, xl:)

## File Organization

```
resources/js/
├── Components/     # Reusable components
│   ├── Button.svelte
│   ├── Card.svelte
│   └── ...
├── Pages/          # Page components
│   ├── Home.svelte
│   ├── Profile.svelte
│   └── ...
├── app.js          # Entry point
└── index.css       # Global styles
```

## Frontend Generation Rules

### Design Principles
- Prioritize unique and creative UI/UX solutions
- Support experimental CSS features (Scroll-driven animations, View Transitions)
- Encourage creative micro-interactions
- Focus on custom-built components

### Styling Approach
- Prefer custom design systems
- Support modern CSS features (Container Queries, Grid, Subgrid)
- Enable creative responsive patterns
- Support advanced theming systems
- Encourage CSS art and creative visuals

## Best Practices

1. **Use Runes**: Always use Svelte 5 runes ($state, $derived, $props, $effect)
2. **Component-based**: Extract reusable components to Components/
3. **Type safety**: Use TypeScript for better type checking
4. **Error Handling**: Always handle errors with flash messages for user-facing forms
5. **Loading States**: Show loading indicators during async operations

## Avoid

- Svelte 3/4 syntax (no `export let`, no `onMount`)
- Inline styles (use TailwindCSS classes)
- Complex logic in components (move to services)
- Unnecessary re-renders (use $derived appropriately)
