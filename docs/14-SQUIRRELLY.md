# Squirrelly Template Guide

Complete guide for server-side rendering with Squirrelly templates in Laju.

## Table of Contents

1. [Overview](#overview)
2. [Basic Syntax](#basic-syntax)
3. [Variables & Expressions](#variables--expressions)
4. [Conditionals](#conditionals)
5. [Loops](#loops)
6. [Partials & Layouts](#partials--layouts)
7. [Filters](#filters)
8. [Helper Functions](#helper-functions)
9. [Controller Integration](#controller-integration)
10. [Best Practices](#best-practices)

---

## Overview

Squirrelly is a fast, lightweight template engine used in Laju for server-side HTML rendering.

### When to Use Squirrelly vs Inertia

| Use Case | Approach |
|----------|----------|
| Landing pages | **Squirrelly** (SEO, fast load) |
| Marketing pages | **Squirrelly** |
| Email templates | **Squirrelly** |
| Static content pages | **Squirrelly** |
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
<h1>{{it.title}}</h1>

<!-- Nested object -->
<p>{{it.user.name}}</p>
<p>{{it.user.address.city}}</p>

<!-- Array access -->
<p>{{it.items[0].name}}</p>
```

### Raw HTML (Unescaped)

```html
<!-- Escaped (safe, default) -->
<p>{{it.content}}</p>
<!-- Output: &lt;script&gt;alert('xss')&lt;/script&gt; -->

<!-- Unescaped (careful!) -->
<p>{{it.content | safe}}</p>
<!-- Output: <script>alert('xss')</script> -->

<!-- Use for trusted HTML only -->
<div class="prose">{{it.articleHtml | safe}}</div>
```

### Comments

```html
{{! This is a comment - won't appear in output }}

{{! 
  Multi-line comment
  Also won't appear in output
}}
```

---

## Variables & Expressions

### Default Values

Squirrelly doesn't support `||` operator. Use ternary instead:

```html
<!-- NOT supported -->
<h1>{{it.title || "Untitled"}}</h1>

<!-- Use ternary instead -->
<h1>{{it.title ? it.title : "Untitled"}}</h1>
<p>{{it.description ? it.description : "No description"}}</p>
<img src="{{it.avatar ? it.avatar : '/default.png'}}" />
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
<p>Total: ${{it.price * it.quantity}}</p>
<p>Discount: ${{it.price * 0.1}}</p>

<!-- String concatenation -->
<p>{{it.firstName + " " + it.lastName}}</p>

<!-- Ternary operator (supported) -->
<span>{{it.isActive ? "Active" : "Inactive"}}</span>

<!-- Boolean check with ternary -->
<p>Status: {{it.count > 0 ? "Has items" : "Empty"}}</p>
```

**Note:** `||` operator is NOT supported. Use ternary or handle in controller:

```html
<!-- NOT supported: {{it.title || "Default"}} -->

<!-- Use ternary instead -->
<h1>{{it.title ? it.title : "Default"}}</h1>
```

### Method Calls

```html
<!-- String methods -->
<p>{{it.name.toUpperCase()}}</p>
<p>{{it.email.toLowerCase()}}</p>
<p>{{it.text.substring(0, 100)}}...</p>

<!-- Array methods -->
<p>Total items: {{it.items.length}}</p>
<p>{{it.tags.join(", ")}}</p>
```

---

## Conditionals

### If Statement

```html
{{@if(it.user)}}
  <p>Welcome, {{it.user.name}}!</p>
{{/if}}
```

### If-Else

```html
{{@if(it.isLoggedIn)}}
  <a href="/logout">Logout</a>
{{#else}}
  <a href="/login">Login</a>
{{/if}}
```

### If-Else If-Else

```html
{{@if(it.role === "admin")}}
  <span class="badge bg-red-500">Admin</span>
{{#elif(it.role === "moderator")}}
  <span class="badge bg-yellow-500">Moderator</span>
{{#elif(it.role === "user")}}
  <span class="badge bg-blue-500">User</span>
{{#else}}
  <span class="badge bg-gray-500">Guest</span>
{{/if}}
```

### Complex Conditions

```html
<!-- AND -->
{{@if(it.user && it.user.isVerified)}}
  <p>Verified user</p>
{{/if}}

<!-- OR (use in controller or with && check) -->
{{@if(it.canAccessAdmin)}}
  <a href="/admin">Admin Panel</a>
{{/if}}

<!-- In controller: canAccessAdmin = user.isAdmin || user.isModerator -->

<!-- NOT -->
{{@if(!it.isBlocked)}}
  <button>Send Message</button>
{{/if}}

<!-- Comparison -->
{{@if(it.items.length > 0)}}
  <p>You have {{it.items.length}} items</p>
{{/if}}

<!-- Equality -->
{{@if(it.status === "published")}}
  <span class="text-green-500">Published</span>
{{/if}}
```

### Truthy/Falsy Checks

```html
<!-- Check if array has items -->
{{@if(it.posts && it.posts.length)}}
  <!-- Show posts -->
{{#else}}
  <p>No posts found</p>
{{/if}}

<!-- Check if string is not empty -->
{{@if(it.bio)}}
  <p>{{it.bio}}</p>
{{#else}}
  <p class="text-gray-400">No bio provided</p>
{{/if}}
```

---

## Loops

### Each Loop

```html
{{@each(it.items) => item}}
  <div class="item">
    <h3>{{item.name}}</h3>
    <p>{{item.description}}</p>
  </div>
{{/each}}
```

### Loop with Index

```html
{{@each(it.items) => item, index}}
  <div class="item">
    <span class="number">{{index + 1}}.</span>
    <span>{{item.name}}</span>
  </div>
{{/each}}
```

### Nested Loops

```html
{{@each(it.categories) => category}}
  <div class="category">
    <h2>{{category.name}}</h2>
    
    {{@each(category.products) => product}}
      <div class="product">
        <h3>{{product.name}}</h3>
        <p>${{product.price}}</p>
      </div>
    {{/each}}
  </div>
{{/each}}
```

### Loop with Conditional

```html
{{@each(it.users) => user}}
  {{@if(user.isActive)}}
    <div class="user active">
      <p>{{user.name}} - Active</p>
    </div>
  {{#else}}
    <div class="user inactive">
      <p>{{user.name}} - Inactive</p>
    </div>
  {{/if}}
{{/each}}
```

### Empty State

```html
{{@if(it.posts && it.posts.length)}}
  {{@each(it.posts) => post}}
    <article>
      <h2>{{post.title}}</h2>
      <p>{{post.excerpt}}</p>
    </article>
  {{/each}}
{{#else}}
  <div class="empty-state">
    <p>No posts yet</p>
    <a href="/posts/create">Create your first post</a>
  </div>
{{/if}}
```

### First/Last Item Styling

```html
{{@each(it.items) => item, index}}
  <div class="item {{index === 0 ? 'first' : ''}} {{index === it.items.length - 1 ? 'last' : ''}}">
    {{item.name}}
  </div>
{{/each}}
```

---

## Partials & Layouts

### Include Partial

```html
<!-- Include simple partial -->
{{@include("partials/header.html") /}}

<!-- Include with closing tag -->
{{@include("partials/footer.html")}}{{/include}}
```

### Partial with Data

Partials automatically have access to the parent's `it` context.

```html
<!-- resources/views/page.html -->
{{@include("partials/header.html") /}}

<main>
  <h1>{{it.title}}</h1>
</main>

{{@include("partials/footer.html") /}}
```

```html
<!-- resources/views/partials/header.html -->
<header class="bg-white shadow">
  <nav class="max-w-7xl mx-auto px-4">
    <a href="/" class="font-bold">{{it.siteName}}</a>
    
    {{@if(it.user)}}
      <span>Welcome, {{it.user.name}}</span>
    {{#else}}
      <a href="/login">Login</a>
    {{/if}}
  </nav>
</header>
```

### Layout Pattern

**Base Layout:**

```html
<!-- resources/views/layouts/base.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{it.title}}</title>
  <meta name="description" content="{{it.description}}">
  
  {{@include("partials/meta.html") /}}
  
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body class="{{it.bodyClass}}">
  {{@include("partials/header.html") /}}
  
  <main class="container mx-auto px-4 py-8">
    {{it.content | safe}}
  </main>
  
  {{@include("partials/footer.html") /}}
  
  <script src="/assets/app.js"></script>
</body>
</html>
```

**Using Layout in Controller:**

```typescript
import { view } from "../services/View";

public async about(request: Request, response: Response) {
  // Render content section
  const content = view("pages/about-content.html", {
    team: await DB.from("team_members")
  });
  
  // Render with layout
  const html = view("layouts/base.html", {
    title: "About Us",
    description: "Learn about our company",
    content: content,
    user: request.user
  });
  
  return response.type("html").send(html);
}
```

### Reusable Components

**Card Component:**

```html
<!-- resources/views/partials/card.html -->
<div class="bg-white rounded-lg shadow p-6 {{it.cardClass}}">
  {{@if(it.cardTitle)}}
    <h3 class="text-lg font-semibold mb-4">{{it.cardTitle}}</h3>
  {{/if}}
  
  <div class="card-content">
    {{it.cardContent | safe}}
  </div>
</div>
```

---

## Filters

### Built-in Filters

```html
<!-- Safe (unescaped HTML) -->
<div>{{it.htmlContent | safe}}</div>

<!-- Trim whitespace -->
<p>{{it.text | trim}}</p>
```

### Custom Filters

Register custom filters in View service:

```typescript
// app/services/View.ts
import * as Sqrl from 'squirrelly';

// Format date
Sqrl.filters.define("formatDate", (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Format currency
Sqrl.filters.define("currency", (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
});

// Truncate text
Sqrl.filters.define("truncate", (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
});

// Slug
Sqrl.filters.define("slug", (text) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
});

// Capitalize
Sqrl.filters.define("capitalize", (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
});
```

**Using Custom Filters:**

```html
<!-- Date formatting -->
<p>Published: {{it.createdAt | formatDate}}</p>

<!-- Currency -->
<p>Price: {{it.price | currency}}</p>
<p>Price: {{it.price | currency("IDR")}}</p>

<!-- Truncate -->
<p>{{it.content | truncate(150)}}</p>

<!-- Slug -->
<a href="/posts/{{it.title | slug}}">{{it.title}}</a>

<!-- Capitalize -->
<p>Status: {{it.status | capitalize}}</p>
```

### Chaining Filters

```html
<!-- Multiple filters -->
<p>{{it.content | trim | truncate(100)}}</p>
```

---

## Helper Functions

### Define Helper in View Service

```typescript
// app/services/View.ts
import * as Sqrl from 'squirrelly';

// Asset URL helper
Sqrl.helpers.define("asset", function(content, blocks) {
  const path = content.params[0];
  const version = process.env.APP_VERSION || '1.0.0';
  return `/assets/${path}?v=${version}`;
});

// Active class helper
Sqrl.helpers.define("activeIf", function(content, blocks) {
  const currentPath = content.params[0];
  const targetPath = content.params[1];
  return currentPath === targetPath ? 'active' : '';
});

// Repeat helper
Sqrl.helpers.define("repeat", function(content, blocks) {
  const times = content.params[0];
  let result = '';
  for (let i = 0; i < times; i++) {
    result += blocks.exec();
  }
  return result;
});
```

**Using Helpers:**

```html
<!-- Asset with version -->
<link rel="stylesheet" href="{{@asset('css/style.css') /}}">
<script src="{{@asset('js/app.js') /}}"></script>

<!-- Active navigation -->
<nav>
  <a href="/" class="{{@activeIf(it.currentPath, '/') /}}">Home</a>
  <a href="/about" class="{{@activeIf(it.currentPath, '/about') /}}">About</a>
  <a href="/contact" class="{{@activeIf(it.currentPath, '/contact') /}}">Contact</a>
</nav>

<!-- Repeat -->
{{@repeat(5)}}
  <span class="star">*</span>
{{/repeat}}
```

---

## Controller Integration

### Basic SSR Page

```typescript
// app/controllers/PageController.ts
import { Request, Response } from "../../type";
import { view } from "../services/View";
import DB from "../services/DB";

class PageController {
  public async home(request: Request, response: Response) {
    const products = await DB.from("products")
      .where("is_featured", true)
      .limit(6);
    
    const testimonials = await DB.from("testimonials")
      .orderBy("created_at", "desc")
      .limit(3);
    
    const html = view("home.html", {
      title: "Welcome to Our Store",
      description: "Best products at best prices",
      products,
      testimonials,
      user: request.user || null
    });
    
    return response.type("html").send(html);
  }

  public async about(request: Request, response: Response) {
    const team = await DB.from("team_members").orderBy("order");
    
    const html = view("about.html", {
      title: "About Us",
      team,
      user: request.user || null
    });
    
    return response.type("html").send(html);
  }

  public async contact(request: Request, response: Response) {
    const html = view("contact.html", {
      title: "Contact Us",
      user: request.user || null,
      success: request.query.success === 'true'
    });
    
    return response.type("html").send(html);
  }
}

export default new PageController();
```

### Form Handling

```typescript
public async submitContact(request: Request, response: Response) {
  const { name, email, message } = await request.json();
  
  // Validate
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  if (!email) errors.email = "Email is required";
  if (!message) errors.message = "Message is required";
  
  if (Object.keys(errors).length > 0) {
    const html = view("contact.html", {
      title: "Contact Us",
      errors,
      formData: { name, email, message }
    });
    return response.type("html").send(html);
  }
  
  // Save to database
  await DB.table("contact_messages").insert({
    name,
    email,
    message,
    created_at: Date.now()
  });
  
  return response.redirect("/contact?success=true");
}
```

**Contact Form Template:**

```html
<!-- resources/views/contact.html -->
{{@include("partials/header.html") /}}

<main class="max-w-2xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
  
  {{@if(it.success)}}
    <div class="bg-green-100 text-green-800 p-4 rounded mb-6">
      Thank you! We'll get back to you soon.
    </div>
  {{/if}}
  
  <form method="POST" action="/contact" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Name</label>
      <input 
        type="text" 
        name="name" 
        value="{{it.formData.name}}"
        class="w-full border rounded px-3 py-2"
      >
      {{@if(it.errors?.name)}}
        <p class="text-red-500 text-sm mt-1">{{it.errors.name}}</p>
      {{/if}}
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input 
        type="email" 
        name="email"
        value="{{it.formData.email}}"
        class="w-full border rounded px-3 py-2"
      >
      {{@if(it.errors?.email)}}
        <p class="text-red-500 text-sm mt-1">{{it.errors.email}}</p>
      {{/if}}
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-1">Message</label>
      <textarea 
        name="message"
        rows="5"
        class="w-full border rounded px-3 py-2"
      >{{it.formData.message}}</textarea>
      {{@if(it.errors?.message)}}
        <p class="text-red-500 text-sm mt-1">{{it.errors.message}}</p>
      {{/if}}
    </div>
    
    <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
      Send Message
    </button>
  </form>
</main>

{{@include("partials/footer.html") /}}
```

---

## Best Practices

### 1. Keep Templates Simple

```html
<!-- Good - Simple logic -->
{{@if(it.user)}}
  <p>Welcome, {{it.user.name}}</p>
{{/if}}

<!-- Avoid - Complex logic in templates -->
{{@if(it.user && it.user.subscription && it.user.subscription.status === 'active' && new Date(it.user.subscription.expiresAt) > new Date())}}
  ...
{{/if}}
```

**Move complex logic to controller:**

```typescript
// Controller
const isSubscriptionActive = user?.subscription?.status === 'active' 
  && new Date(user.subscription.expiresAt) > new Date();

const html = view("page.html", {
  user,
  isSubscriptionActive
});
```

### 2. Use Partials for Reusability

```html
<!-- Bad - Duplicate code -->
<header>...</header>
<main>Page 1</main>
<footer>...</footer>

<header>...</header>
<main>Page 2</main>
<footer>...</footer>

<!-- Good - Partials -->
{{@include("partials/header.html") /}}
<main>Page Content</main>
{{@include("partials/footer.html") /}}
```

### 3. Escape User Input

```html
<!-- Always escape user input (default) -->
<p>{{it.userComment}}</p>

<!-- Only use safe for trusted HTML -->
<div>{{it.adminGeneratedHtml | safe}}</div>
```

### 4. Provide Default Values

```html
<!-- Use ternary for defaults (|| not supported) -->
<h1>{{it.title ? it.title : "Untitled"}}</h1>
<img src="{{it.avatar ? it.avatar : '/images/default-avatar.png'}}" alt="Avatar">
```

### 5. Organize Partials Logically

```
partials/
├── layout/
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
├── components/
│   ├── card.html
│   ├── button.html
│   └── modal.html
├── forms/
│   ├── input.html
│   ├── select.html
│   └── textarea.html
└── meta/
    ├── seo.html
    └── og-tags.html
```

---

## Complete Example

### Landing Page

```html
<!-- resources/views/landing.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{it.title}} | {{it.siteName}}</title>
  <meta name="description" content="{{it.description}}">
  <link rel="stylesheet" href="/js/index.css">
</head>
<body class="bg-gray-50">
  {{@include("partials/nav.html") /}}
  
  <!-- Hero -->
  <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <h1 class="text-5xl font-bold mb-6">{{it.hero.title}}</h1>
      <p class="text-xl mb-8 opacity-90">{{it.hero.subtitle}}</p>
      <a href="{{it.hero.ctaLink}}" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
        {{it.hero.ctaText}}
      </a>
    </div>
  </section>
  
  <!-- Features -->
  <section class="py-20">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
      <div class="grid md:grid-cols-3 gap-8">
        {{@each(it.features) => feature}}
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-4xl mb-4">{{feature.icon}}</div>
            <h3 class="text-xl font-semibold mb-2">{{feature.title}}</h3>
            <p class="text-gray-600">{{feature.description}}</p>
          </div>
        {{/each}}
      </div>
    </div>
  </section>
  
  <!-- Testimonials -->
  {{@if(it.testimonials && it.testimonials.length)}}
    <section class="bg-gray-100 py-20">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div class="grid md:grid-cols-2 gap-8">
          {{@each(it.testimonials) => testimonial}}
            <div class="bg-white p-6 rounded-lg shadow">
              <p class="text-gray-700 mb-4">"{{testimonial.quote}}"</p>
              <div class="flex items-center">
                <img src="{{testimonial.avatar}}" alt="" class="w-12 h-12 rounded-full mr-4">
                <div>
                  <p class="font-semibold">{{testimonial.name}}</p>
                  <p class="text-gray-500 text-sm">{{testimonial.role}}</p>
                </div>
              </div>
            </div>
          {{/each}}
        </div>
      </div>
    </section>
  {{/if}}
  
  <!-- CTA -->
  <section class="py-20 text-center">
    <div class="max-w-3xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p class="text-gray-600 mb-8">Join thousands of developers building with Laju.</p>
      <a href="/register" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
        Create Free Account
      </a>
    </div>
  </section>
  
  {{@include("partials/footer.html") /}}
</body>
</html>
```

---

## Next Steps

- [Tutorials](08-TUTORIALS.md)
- [Backend Services](03-BACKEND-SERVICES.md)
- [Best Practices](06-BEST-PRACTICES.md)
