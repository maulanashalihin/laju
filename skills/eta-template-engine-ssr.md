# Laju Views (Eta Templates)

## Overview

Laju uses **Eta** templating engine for server-side rendering (SSR). Use SSR for:
- Public pages needing SEO (landing pages, marketing pages, blogs)
- Routes WITHOUT `auth` middleware

For protected/admin routes, use **Inertia.js** (see `skills/create-controller.md` and `skills/create-svelte-inertia-page.md`).

## File Types

| File | Purpose |
|------|---------|
| `resources/views/index.html` | Landing page, SEO pages |
| `resources/views/inertia.html` | Inertia.js app shell |
| `resources/views/partials/*.html` | Reusable template components |

## Quick Example

**Controller** (`app/controllers/HomeController.ts`):
```typescript
import { view } from '../services/View'

export class HomeController {
  async index(request: Request, response: Response) {
    const posts = await DB.selectFrom('posts')
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(10)
      .execute()
    
    return response.type('html').send(view('home', { posts, title: 'Welcome' }))
  }
}
```

**Template** (`resources/views/home.html`):
```eta
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1><%= title %></h1>
  
  <% for (const post of posts) { %>
    <article>
      <h2><%= post.title %></h2>
      <p><%= post.content %></p>
    </article>
  <% } %>
</body>
</html>
```

See `skills/create-controller.md` for SSR vs Inertia decision guide.

## Eta Syntax

### Variables
```eta
<%= title %>
<%= user.name %>
```

### Conditionals
```eta
<% if (user) { %>
   Welcome, <%= user.name %>!
<% } else { %>
   Please login
<% } %>
```

### Loops
```eta
<% for (const item of items) { %>
   <div><%= item.name %></div>
<% } %>
```

### Partials
```eta
<%~ include('partials/header.html') %>
```

### Unescaped Output (Raw HTML)
```eta
<%~ article.content %>
```

**Warning**: Only use with trusted content to prevent XSS attacks.

### Default Values
```eta
<%= title || "Default Title" %>
```

## Inertia Integration

```html
<!DOCTYPE html>
<html>
<head>
   <title><%= title %></title>
   <%= inertiaHead %>
</head>
<body>
   <div id="app"></div>
   <script src="/js/app.js"></script>
</body>
</html>
```

## Assets

### Asset Helper
```html
<script type="module" src="<%= it.asset('js/index.js') %>"></script>
<link rel="stylesheet" href="<%= it.asset('js/index.css') %>">
```

### Available Assets
- `js/app.js` - Main Inertia application bundle
- `js/index.js` - Landing page JavaScript
- `js/index.css` - Landing page styles (TailwindCSS v4)

### Asset Resolution
- **Development**: Vite dev server with HMR
- **Production**: Built to `dist/` with hashed filenames
- `it.asset()` handles path resolution automatically

## Best Practices

1. **Keep templates simple** - Move complex logic to controllers
2. **Use partials** - Extract reusable components to `partials/`
3. **Escape output** - Eta auto-escapes by default (security)
4. **Semantic HTML** - Use proper HTML5 semantic elements
5. **Minimize logic** - Templates should focus on presentation

## SEO Guidelines

### Meta Tags
Include meta charset, viewport, title, description in `<head>`.

### Open Graph & Twitter Cards
Add og:title, og:description, og:image for social sharing.

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (header, nav, main, article, section, footer)
- Add alt text to all images

## Accessibility

### Heading Structure
- Single h1 per page
- Logical heading hierarchy
- Don't skip heading levels

### Alt Text
- Descriptive alt text for all images
- Empty alt text for decorative images

### Keyboard Navigation
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text

## Icons

**Lucide Icons** is the default icon library for laju.dev.

### Using Icons in Eta Templates

For SSR templates (index.html, inertia.html), use inline SVG icons:

```html
<!-- Example inline SVG icon -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="12"></line>
  <line x1="12" y1="16" x2="12.01" y2="16"></line>
</svg>
```

### Icon Resources
- Visit [lucide.dev/icons](https://lucide.dev/icons) to browse available icons
- Copy SVG code directly from the website
- Apply Tailwind classes for sizing and styling

**Note:** For Inertia pages (Svelte components), import icons from `lucide-svelte` instead.

## When to Use SSR vs Inertia

| Use Case | Solution | See |
|----------|----------|-----|
| Public SEO pages | SSR (Eta) | This guide |
| Protected admin routes | Inertia + Svelte | `skills/create-svelte-inertia-page.md` |
| Authentication pages | SSR (Eta) | Built-in controllers |
| Dashboard/CRUD | Inertia + Svelte | `skills/create-controller.md` |

## Related Guides

- `skills/create-controller.md` - Controller patterns (SSR vs Inertia)
- `skills/create-svelte-inertia-page.md` - Inertia.js page patterns
- `skills/kysely.md` - Database queries for controllers
