# Laju Views (Eta Templates)

## Template Engine

This directory uses **Eta** templating engine for server-side rendering.

## File Types

- **index.html**: Landing page and SEO pages
- **inertia.html**: Inertia.js app shell
- **partials/**: Reusable template components

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
<%~ include('partials/header') %>
```

### Default Values
Use ternary operator for default values:
```eta
<%= title || "Default Title" %>
```

## Best Practices

1. **Keep templates simple**: Move complex logic to controllers
2. **Use partials**: Extract reusable components to `partials/`
3. **Escape output**: Eta auto-escapes by default (security)
4. **Semantic HTML**: Use proper HTML5 semantic elements
5. **Minimize logic**: Templates should focus on presentation

## Inertia Integration

For Inertia pages, use the `inertia.html` shell:
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

- CSS: Use TailwindCSS v4
- JS: Loaded from `/js/app.js` (Vite bundle)
- Images: Use `/public/` or S3 URLs

## Performance

- Templates are cached in production
- Use Eta's built-in caching
- Avoid heavy computations in templates
