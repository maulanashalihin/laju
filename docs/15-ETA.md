# Eta Template Guide

Complete guide for server-side rendering with Eta templates in Laju.

## Table of Contents

1. [Overview](#overview)
2. [Basic Syntax](#basic-syntax)
3. [Variables & Expressions](#variables--expressions)
4. [Conditionals](#conditionals)
5. [Loops](#loops)
6. [Partials & Layouts](#partials--layouts)
7. [Filters](#filters)
8. [Controller Integration](#controller-integration)
9. [Best Practices](#best-practices)

---

## Overview

Eta is a fast, lightweight template engine used in Laju for server-side HTML rendering. It's written in TypeScript and is a more lightweight, configurable alternative to EJS.

### When to Use Eta vs Inertia

| Use Case | Approach |
|----------|----------|
| Landing pages | **Eta** (SEO, fast load) |
| Marketing pages | **Eta** |
| Email templates | **Eta** |
| Static content pages | **Eta** |
| Dashboards | **Inertia + Svelte** |
| Interactive apps | **Inertia + Svelte** |
| Forms with validation | **Inertia + Svelte** |

### File Locations

```
resources/views/
├── index.html          # Landing page
├── inertia.html        # Inertia layout
├── about.html          # About page
├── contact.html        # Contact page
└── partials/           # Reusable components
    ├── header.html
    ├── footer.html
    ├── nav.html
    └── meta.html
```

---

## Basic Syntax

### Variable Output

```html
<!-- Basic variable -->
<h1><%= it.title %></h1>

<!-- Nested object -->
<p><%= it.user.name %></p>
<p><%= it.user.address.city %></p>

<!-- Array access -->
<p><%= it.items[0].name %></p>
```

### Raw HTML (Unescaped)

```html
<!-- Escaped (safe, default) -->
<p><%= it.content %></p>
<!-- Output: &lt;script&gt;alert('xss')&lt;/script&gt; -->

<!-- Unescaped/Raw HTML (careful!) -->
<p><%~ it.content %></p>
<!-- Output: <script>alert('xss')</script> -->

<!-- Use for trusted HTML only -->
<div class="prose"><%~ it.article.content %></div>
```

### Comments

```html
<%/* This is a comment - won't appear in output */%>

<%/* 
  Multi-line comment
  Also won't appear in output
*/%>
```

---

## Variables & Expressions

### Default Values

Eta supports JavaScript expressions:

```html
<!-- Using ternary operator -->
<h1><%= it.title ? it.title : "Untitled" %></h1>
<p><%= it.description ? it.description : "No description" %></p>
<img src="<%= it.avatar ? it.avatar : '/default.png' %>" />
```

**Alternative:** Set defaults in controller:

```typescript
// Controller
const html = view("page.html", {
  title: data.title || "Untitled",
  description: data.description || "No description available"
});
```

### Expressions

```html
<!-- Math -->
<p>Total: $<%= it.price * it.quantity %></p>
<p>Discount: $<%= it.price * 0.1 %></p>

<!-- String concatenation -->
<p><%= it.firstName + " " + it.lastName %></p>

<!-- Ternary operator -->
<span><%= it.isActive ? "Active" : "Inactive" %></span>

<!-- Boolean check with ternary -->
<p>Status: <%= it.count > 0 ? "Has items" : "Empty" %></p>
```

### Method Calls

```html
<!-- String methods -->
<p><%= it.name.toUpperCase() %></p>
<p><%= it.email.toLowerCase() %></p>
<p><%= it.text.substring(0, 100) %>...</p>

<!-- Array methods -->
<p>Total items: <%= it.items.length %></p>
<p><%= it.tags.join(", ") %></p>
```

---

## Conditionals

### If/Else

```html
<% if (it.user) { %>
  <p>Welcome, <%= it.user.name %>!</p>
<% } else { %>
  <p>Please log in</p>
<% } %>
```

### If/Else If/Else

```html
<% if (it.status === 'active') { %>
  <span class="text-green-500">Active</span>
<% } else if (it.status === 'pending') { %>
  <span class="text-yellow-500">Pending</span>
<% } else { %>
  <span class="text-red-500">Inactive</span>
<% } %>
```

### Ternary in Attributes

```html
<div class="<%= it.isFeatured ? 'bg-blue-500' : 'bg-gray-500' %>">
  Content
</div>
```

---

## Loops

### For Each

```html
<ul>
<% it.items.forEach(function(item) { %>
  <li><%= item.name %></li>
<% }) %>
</ul>
```

### For Loop

```html
<% for (let i = 0; i < it.items.length; i++) { %>
  <div><%= it.items[i].name %></div>
<% } %>
```

### For...Of

```html
<% for (const item of it.items) { %>
  <div><%= item.name %></div>
<% } %>
```

### Loop with Index

```html
<% it.items.forEach(function(item, index) { %>
  <div>
    <span>#<%= index + 1 %></span>
    <span><%= item.name %></span>
  </div>
<% }) %>
```

---

## Partials & Layouts

### Including Partials

```html
<%~ include('partials/navbar') %>
```

### Include with Data

```html
<%~ include('partials/navbar', { active: 'home' }) %>
```

### Using Layouts

```html
<% layout('layouts/basic') %>
<h1>This will be rendered into a layout</h1>
```

### Layout File Example

```html
<!-- resources/views/layouts/basic.html -->
<!DOCTYPE html>
<html>
<head>
  <title><%= it.title %></title>
</head>
<body>
  <%-~ content %>
</body>
</html>
```

---

## Filters

Eta doesn't have built-in filters like some other template engines. Instead, use JavaScript methods or define custom helpers.

### Using JavaScript Methods

```html
<p><%= it.text.toUpperCase() %></p>
<p><%= it.text.trim() %></p>
<p><%= it.price.toFixed(2) %></p>
```

### Custom Helpers

```typescript
// Define in your View service or middleware
Eta.config.autoTrim = false;

// Or use a function in your data
const html = view("page.html", {
  title: formatTitle(data.title),
  date: formatDate(data.date)
});
```

---

## Controller Integration

### Basic Usage

```typescript
import { view } from "../services/View";

class Controller {
  public async index(request: Request, response: Response) {
    try {
      const html = view("index.html", {
        title: "Welcome",
        users: ["Alice", "Bob", "Charlie"]
      });
      return response.type("html").send(html);
    } catch (error) {
      console.error("Error in controller:", error);
      return response.status(500).send("Internal Server Error");
    }
  }
}
```

### Passing Complex Data

```typescript
public async show(request: Request, response: Response) {
  const user = await DB.from("users").where("id", request.params.id).first();
  
  const html = view("users/show.html", {
    user: user,
    posts: await DB.from("posts").where("user_id", user.id),
    isActive: user.status === 'active',
    timestamp: new Date().toISOString()
  });
  
  return response.type("html").send(html);
}
```

### Inertia Integration

```typescript
// Inertia middleware automatically handles this
response.inertia("Dashboard", {
  user: request.user,
  stats: {
    posts: 10,
    comments: 50
  }
});
```

---

## Assets

### Using the Asset Helper

Laju provides an `it.asset()` helper function to reference Vite-built assets in your templates. This helper automatically resolves the correct asset path in development and production.

```html
<!-- JavaScript assets -->
<script type="module" src="<%= it.asset('js/index.js') %>"></script>

<!-- CSS assets -->
<link rel="stylesheet" href="<%= it.asset('js/index.css') %>">
```

### Vite Entry Points

Assets are declared in `vite.config.mjs` under the `input` object:

```javascript
const input = {
  app: resolve(__dirname, 'resources/js/app.js'),
  index: resolve(__dirname, 'resources/js/index.js'),
  css: resolve(__dirname, 'resources/js/index.css'),
};
```

### Available Assets

Based on the Vite configuration, the following assets are available:

- `js/app.js` - Main Inertia application bundle
- `js/index.js` - Landing page JavaScript
- `js/index.css` - Landing page styles (TailwindCSS v4)

### Asset Resolution

- **Development**: Assets are served from the Vite dev server with hot module replacement
- **Production**: Assets are built to `dist/` with hashed filenames for cache busting
- The `it.asset()` helper automatically handles the path resolution in both environments

---

## Translation

Laju provides automatic translation support in Eta templates. The `t` function from `app/services/Translation.ts` is automatically available in all templates as `it.t`.

### Basic Usage

```html
<!-- Simple translation -->
<h1><%= it.t('welcome', 'en') %></h1>
<p><%= it.t('description', 'id') %></p>

<!-- Output (en): Welcome -->
<!-- Output (id): Selamat datang -->
```

### With Interpolation

```html
<!-- Translation with parameters -->
<h1><%= it.t('greeting', 'en', { name: 'John' }) %></h1>
<p><%= it.t('items_count', 'id', { count: 5 }) %></p>

<!-- Output (en): Hello, John! -->
<!-- Output (id): Anda memiliki 5 item -->
```

### Nested Keys

```html
<!-- Nested translation keys -->
<p><%= it.t('errors.required', 'en', { field: 'Email' }) %></p>
<p><%= it.t('success.created', 'id', { item: 'Produk' }) %></p>

<!-- Output (en): Email is required -->
<!-- Output (id): Produk berhasil dibuat -->
```

### Dynamic Language from Controller

```typescript
// Controller
public async index(request: Request, response: Response) {
  const lang = request.cookies.lang || 'en';
  
  const html = view("index.html", {
    lang: lang,
    title: it.t('welcome', lang)
  });
  
  return response.type("html").send(html);
}
```

```html
<!-- Template -->
<h1><%= it.t('welcome', it.lang) %></h1>
<p><%= it.t('description', it.lang) %></p>
```

### Language Detection in Controller

```typescript
// Detect language from cookie, query, or header
const lang = request.cookies.lang || 
             request.query.lang as string || 
             request.headers['accept-language']?.split(',')[0]?.split('-')[0] || 
             'en';

const html = view("page.html", {
  lang: lang,
  // Pass language to template
});
```

---

## Best Practices

### Security

- **Always escape HTML**: Use `<%= %>` for user input (default behavior)
- **Only use raw output when necessary**: Use `<%~ %>` only for trusted HTML
- **Validate data**: Validate data before passing to templates

### Performance

- **Cache in production**: Eta automatically caches templates when `NODE_ENV !== 'development'`
- **Minimize logic in templates**: Keep complex logic in controllers
- **Use partials wisely**: Don't over-fragment your templates

### Code Organization

```typescript
// Good: Prepare data in controller
public async index(request: Request, response: Response) {
  const users = await DB.from("users").where("active", true);
  const html = view("users/index.html", {
    users: users,
    count: users.length,
    title: "Active Users"
  });
  return response.type("html").send(html);
}

// Avoid: Complex logic in templates
// Don't do this:
<% const activeUsers = it.users.filter(u => u.active) %>
<% activeUsers.forEach(...) %>
```

### Debugging

```typescript
// Enable debug mode in development
const eta = new Eta({
  views: path.join(process.cwd(), "resources/views"),
  cache: false,
  debug: true
});
```

---

## Syntax Comparison: Eta vs Squirrelly

| Feature | Squirrelly | Eta |
|---------|-----------|-----|
| Variable | `{{it.name}}` | `<%= it.name %>` |
| Raw HTML | `{{* it.html}}` | `<%~ it.html %>` |
| Comment | `{{! comment }}` | `<%/* comment */%>` |
| If | `{{if it.value}}...{{/if}}` | `<% if (it.value) { %>...<% } %>` |
| Loop | `{{each it.items}}...{{/each}}` | `<% it.items.forEach(...) { %>...<% } %>` |
| Include | `{{include('partial')}}` | `<%~ include('partial') %>` |

---

## Resources

- [Official Eta Documentation](https://eta.js.org)
- [Eta GitHub Repository](https://github.com/bgub/eta)
- [Eta Playground](https://eta.js.org/playground)
