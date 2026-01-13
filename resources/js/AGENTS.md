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

**Pattern 1: Inertia Forms (for page navigation)**
```svelte
<script>
import { useForm } from '@inertiajs/svelte';

let form = useForm({
   name: '',
   email: ''
});

function submit() {
   form.post('/submit');
}
</script>
```
Controller: `return response.redirect('/path');`

**Pattern 2: Fetch + Toast (for in-place updates)**

**Scenario A: Reload page after update**
```svelte
<script>
import { Toast } from '../Components/helper.js';
import { router } from '@inertiajs/svelte';

let loading = $state(false);

async function submit() {
   loading = true;
   try {
      const response = await fetch('/update', {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, email })
      });
      
      if (response.ok) {
         Toast('Profile updated successfully', 'success');
         await router.reload(); // Reload to get fresh data
      } else {
         Toast('Failed to update profile', 'error');
      }
   } catch (error) {
      Toast('Failed to update profile', 'error');
   } finally {
      loading = false;
   }
}
</script>
```
Controller: `return response.send();`

**Scenario B: Update local state without reload**
```svelte
<script>
import { Toast } from '../Components/helper.js';
import { page } from '@inertiajs/svelte';

let loading = $state(false);
let user = $derived(page.props.user);

async function submit() {
   loading = true;
   try {
      const response = await fetch('/update', {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, email })
      });
      
      const result = await response.json();
      if (result.success) {
         Toast('Profile updated successfully', 'success');
         user.name = result.data.name; // Update local state
         user.email = result.data.email;
      }
   } catch (error) {
      Toast('Failed to update profile', 'error');
   } finally {
      loading = false;
   }
}
</script>
```
Controller: `return response.json({ success: true, data: updatedUser });`
 

**Controller Best Practices:**
- Pattern 1: Use `response.redirect()` for Inertia forms
- Pattern 2: Use `response.json()` or `response.send()` for fetch requests
- Use Toast notifications for user feedback

### Accessing Page Props
```svelte
<script>
import { page } from '@inertiajs/svelte';

let user = $derived(page.props.user);
</script>
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
- **Prioritize unique and creative UI/UX solutions** - Avoid generic templates, create distinctive interfaces
- **Support experimental CSS features and animations** - Use cutting-edge CSS features (Scroll-driven animations, View Transitions, Houdini)
- **Encourage creative micro-interactions** - Add engaging feedback (button effects, loading animations, toast notifications)
- **Focus on custom-built components** - Build custom components instead of using standard UI libraries

### Styling Approach
- **Prefer custom design systems** - Create consistent color palettes, typography scales, and spacing systems
- **Support modern CSS features** - Use Container Queries, CSS Grid, Subgrid, Masonry layouts
- **Enable creative responsive design patterns** - Design for various screen sizes with adaptive layouts
- **Support advanced theming systems** - Implement dark mode, light mode, and custom theme switching
- **Encourage CSS art and creative visuals** - Use gradients, patterns, and SVG animations for polished visuals

## Best Practices

1. **Use Runes**: Always use Svelte 5 runes ($state, $derived, $props, $effect)
2. **Component-based**: Extract reusable components to Components/
3. **Type safety**: Use TypeScript for better type checking
4. **Performance**: Use $derived for computed values
5. **Accessibility**: Add proper ARIA labels and keyboard navigation
6. **Creative**: Prioritize unique UI/UX over generic designs
7. **Modern**: Leverage experimental CSS features and animations

## Avoid

- Svelte 3/4 syntax (no `export let`, no `onMount`)
- Inline styles (use TailwindCSS classes)
- Complex logic in components (move to services)
- Unnecessary re-renders (use $derived appropriately)
