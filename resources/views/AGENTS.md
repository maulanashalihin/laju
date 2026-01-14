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

### Using the Asset Helper

Use the `it.asset()` helper function to reference Vite-built assets in your templates:

```html
<!-- JavaScript assets -->
<script type="module" src="<%= it.asset('js/index.js') %>"></script>

<!-- CSS assets -->
<link rel="stylesheet" href="<%= it.asset('js/index.css') %>">
```

### Vite Entry Points

Assets are declared in `vite.config.mjs`:

```javascript
const input = {
  app: resolve(__dirname, 'resources/js/app.js'),
  index: resolve(__dirname, 'resources/js/index.js'),
  css: resolve(__dirname, 'resources/js/index.css'),
};
```

### Available Assets

- `js/app.js` - Main Inertia application bundle
- `js/index.js` - Landing page JavaScript
- `js/index.css` - Landing page styles (TailwindCSS v4)

### Asset Resolution

- **Development**: Assets served from Vite dev server with HMR
- **Production**: Assets built to `dist/` with hashed filenames
- `it.asset()` helper handles path resolution automatically

### Other Assets

- CSS: Use TailwindCSS v4
- Images: Use `/public/` or S3 URLs

## Performance

- Templates are cached in production
- Use Eta's built-in caching
- Avoid heavy computations in templates
- Inline critical CSS for above-the-fold content
- Lazy load images and non-critical resources
- Use font-display: swap and preload critical fonts
- Defer non-critical JavaScript

## Landing Page Design

### Hero Section
- Strong headline with clear value proposition
- Compelling CTA button with contrasting color
- Supporting subheadline or tagline
- Hero image or illustration that reinforces message
- Mobile-first: Stack vertically on mobile, side-by-side on desktop

### Feature Showcase
- Grid layout (2-3 columns on desktop, 1 on mobile)
- Icon + title + description pattern
- Consistent spacing and alignment
- Hover effects for interactivity

### Social Proof
- Testimonials with quotes and author info
- Client logos in a grid or carousel
- Statistics (users, projects, etc.) with large numbers
- Trust badges or certifications

### CTA Sections
- Primary CTA: High contrast, prominent placement
- Secondary CTA: Lower contrast, alternative action
- Use action-oriented copy (e.g., "Get Started", "Try Free")

## SEO Guidelines

### Meta Tags
Include meta charset, viewport, title, description, and keywords in `<head>`.

### Open Graph & Twitter Cards
Add og:title, og:description, og:image, og:url, og:type for social sharing.
Add twitter:card, twitter:title, twitter:description, twitter:image for Twitter.

### Structured Data
Use JSON-LD for structured data (WebSite, Organization, etc.).

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (header, nav, main, article, section, footer)
- Add alt text to all images
- Use descriptive link text

## Public Page Design Principles

### Professional Appearance
- Clean, uncluttered layout
- Consistent spacing and alignment
- High-quality imagery and graphics
- Professional typography

### Visual Hierarchy
- Clear focal points (usually top-left)
- Size and weight guide attention
- Use whitespace effectively
- Group related content

### Typography
- Limit to 2-3 font families
- Establish clear type scale
- Use appropriate line heights (1.5-1.8 for body text)
- Ensure readability across devices

### Branding Consistency
- Consistent color palette
- Logo placement and sizing
- Brand voice in copy
- Consistent UI patterns

### Smooth Animations
- Subtle transitions (0.2-0.3s ease)
- Scroll-triggered animations
- Hover effects on interactive elements
- Avoid jarring or distracting animations

## Accessibility

### Heading Structure
- Single h1 per page
- Logical heading hierarchy
- Don't skip heading levels
- Use headings for structure, not styling

### Alt Text
- Descriptive alt text for all images
- Empty alt text for decorative images
- Include context in alt text

### Keyboard Navigation
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Skip to main content link

### ARIA Labels
- ARIA labels for icon-only buttons
- ARIA roles for custom components
- ARIA live regions for dynamic content
- ARIA expanded/collapsed states

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Don't rely on color alone for meaning
- Test with color blindness simulators
