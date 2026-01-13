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

### Page Visits
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

### Accessing Page Props
```svelte
<script>
import { page } from '@inertiajs/svelte';

$: user = page.props.user;
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

### Common Patterns
```svelte
<!-- Button -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
   Click me
</button>

<!-- Input -->
<input class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

<!-- Card -->
<div class="p-6 bg-white rounded-lg shadow-md">
   <h2 class="text-xl font-bold">Title</h2>
</div>
```

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
6. **Responsive**: Use Tailwind's responsive prefixes (md:, lg:, xl:)
7. **Creative**: Prioritize unique UI/UX over generic designs
8. **Modern**: Leverage experimental CSS features and animations

## Avoid

- Svelte 3/4 syntax (no `export let`, no `onMount`)
- Inline styles (use TailwindCSS classes)
- Complex logic in components (move to services)
- Unnecessary re-renders (use $derived appropriately)
