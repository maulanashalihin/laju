# Translation (Multi-Language)

Laju provides a lightweight and stateless Translation service for multi-language support.

> **Note**: `app/services/Translation.ts` is designed for **SSR (Server-Side Rendering) only**. Use it in controllers or Eta templates. For Svelte/Inertia pages, use the provided `Translation.js` helper in `resources/js/Components/Translation.js`.

## Basic Usage

```typescript
import { t } from "app/services/Translation";

// Basic translation
t('welcome', 'id')     // "Selamat datang"
t('welcome', 'en')     // "Welcome"

// With interpolation
t('greeting', 'id', { name: 'Budi' })  // "Halo, Budi!"

// Nested keys
t('errors.required', 'id', { field: 'Email' })  // "Email wajib diisi"
```

## Language Files

### Server-Side (SSR)

Translation files for server-side rendering are stored in `app/services/languages/`:

```
app/services/languages/
├── en.json
├── id.json
├── ar.json
├── fr.json
└── ...
```

### Client-Side (Svelte/Inertia)

Translation files for client-side rendering are stored in `resources/js/Components/languages/`:

```
resources/js/Components/languages/
├── en.json
├── id.json
├── ar.json
├── fr.json
└── ...
```

> **Note**: You can copy language files from `app/services/languages/` to `resources/js/Components/languages/` or maintain separate translations for server and client.

### Basic Structure

```json
// app/services/languages/id.json
{
  "welcome": "Selamat datang",
  "login": "Masuk",
  "logout": "Keluar",
  "register": "Daftar"
}
```

### With Interpolation

```json
{
  "greeting": "Halo, {name}!",
  "items_count": "Anda memiliki {count} item",
  "order_total": "Total: Rp {amount}"
}
```

Usage:
```typescript
t('greeting', 'id', { name: 'Budi' })        // "Halo, Budi!"
t('items_count', 'id', { count: 5 })         // "Anda memiliki 5 item"
t('order_total', 'id', { amount: '150.000' }) // "Total: Rp 150.000"
```

### Nested Keys

```json
{
  "errors": {
    "required": "{field} wajib diisi",
    "min_length": "{field} minimal {min} karakter",
    "email": "Format email tidak valid"
  },
  "success": {
    "created": "{item} berhasil dibuat",
    "updated": "{item} berhasil diperbarui",
    "deleted": "{item} berhasil dihapus"
  }
}
```

Usage:
```typescript
t('errors.required', 'id', { field: 'Email' })     // "Email wajib diisi"
t('errors.min_length', 'id', { field: 'Password', min: 8 })  // "Password minimal 8 karakter"
t('success.created', 'id', { item: 'Produk' })     // "Produk berhasil dibuat"
```

## Usage in Controllers

```typescript
import { t } from "app/services/Translation";
import { Request, Response } from "../../type";

class UserController {
  async store(request: Request, response: Response) {
    const lang = request.query.lang as string || 'en';
    
    // Validation error
    if (!request.body.email) {
      return response.status(422).json({
        success: false,
        message: t('errors.required', lang, { field: 'Email' })
      });
    }
    
    // Success response
    return response.json({
      success: true,
      message: t('success.created', lang, { item: t('user', lang) })
    });
  }
}
```

## Usage in Template Engines (Eta)

The `t` function is automatically available in all Eta templates as `it.t`. You don't need to import or pass it manually.

### Basic Usage

```html
<!-- resources/views/index.html -->
<h1><%= it.t('welcome', 'en') %></h1>
<p><%= it.t('description', 'id') %></p>
```

### With Interpolation

```html
<h1><%= it.t('greeting', 'en', { name: 'John' }) %></h1>
<p><%= it.t('items_count', 'id', { count: 5 }) %></p>
```

### Nested Keys

```html
<p><%= it.t('errors.required', 'en', { field: 'Email' }) %></p>
<p><%= it.t('success.created', 'id', { item: 'Produk' }) %></p>
```

### Dynamic Language from Controller

```typescript
// Controller
public async index(request: Request, response: Response) {
  const lang = request.cookies.lang || 'en';
  
  const html = view("index.html", {
    lang: lang
  });
  
  return response.type("html").send(html);
}
```

```html
<!-- Template -->
<h1><%= it.t('welcome', it.lang) %></h1>
<p><%= it.t('description', it.lang) %></p>
```

For more detailed examples, see the [Eta Template Guide](./15-ETA.md#translation).

## Usage in Inertia Pages (Svelte)

For Svelte/Inertia pages, use the simple `Translation.js` helper in `resources/js/Components/Translation.js`. Language files are stored in `resources/js/Components/languages/`.

> **Note**: The `Translation.js` helper uses localStorage to store the current language. You don't need to pass the language parameter to `t()` - it automatically uses the stored language (defaults to 'en'). The `t()` function will automatically load the language if it hasn't been loaded yet.

### Basic Usage

```svelte
<!-- resources/js/Pages/Dashboard.svelte -->
<script>
  import { t } from '../Components/Translation.js';
</script>

<h1>{t('welcome')}</h1>
<p>{t('dashboard')}</p>
```

### With Interpolation

```svelte
<script>
  import { t } from '../Components/Translation.js';
  let userName = $state('John');
</script>

<h1>{t('greeting', { name: userName })}</h1>
```

### Change Language Dynamically

```svelte
<script>
  import { t, setLanguage } from '../Components/Translation.js';
  let currentLang = $state('en');

  async function changeLanguage(newLang) {
    currentLang = newLang;
    await setLanguage(newLang); // Saves to localStorage automatically
  }
</script>

<select bind:value={currentLang} onchange={(e) => changeLanguage(e.target.value)}>
  <option value="en">English</option>
  <option value="id">Indonesian</option>
  <option value="ar">Arabic</option>
</select>

<h1>{t('welcome')}</h1>
```

## Language Detection

### From Query Parameter

```typescript
const lang = request.query.lang as string || 'en';
```

### From Cookie

```typescript
const lang = request.cookies.lang || 'en';
```

### From Accept-Language Header

```typescript
function detectLanguage(request: Request): string {
  const acceptLang = request.headers['accept-language'] as string;
  
  if (!acceptLang) return 'en';
  
  // Parse "id-ID,id;q=0.9,en;q=0.8"
  const preferred = acceptLang.split(',')[0].split('-')[0];
  const supported = ['en', 'id', 'ar', 'fr', 'de', 'tr'];
  
  return supported.includes(preferred) ? preferred : 'en';
}
```

### From User Preference (Database)

```typescript
const lang = request.user?.language || 'en';
```

## Adding New Language

You can add any language to the translation system.

### Server-Side (SSR)

For controllers and Eta templates:

1. Create language file:

```json
// app/services/languages/es.json
{
  "welcome": "Bienvenido",
  "login": "Iniciar sesión",
  "logout": "Cerrar sesión"
}
```

2. Import in Translation.ts:

```typescript
import es from './languages/es.json';

const lang_data = {
  // ... existing languages
  "es": { ...es }
} as any;
```

### Client-Side (Svelte/Inertia)

For Svelte/Inertia pages:

1. Create language file:

```json
// resources/js/Components/languages/es.json
{
  "welcome": "Bienvenido",
  "login": "Iniciar sesión",
  "logout": "Cerrar sesión"
}
```

That's it! The language is now available for use. The `Translation.js` helper will automatically load it when `setLanguage('es')` is called.

## Fallback Behavior

If a key is not found, the function returns the key itself:

```typescript
t('unknown_key', 'id')  // Returns: "unknown_key"
```

This makes debugging easier - you can directly see which keys haven't been translated.

## Best Practices

### 1. Consistent Key Naming

```json
{
  "btn_save": "Save",
  "btn_cancel": "Cancel",
  "btn_delete": "Delete",
  
  "label_name": "Name",
  "label_email": "Email",
  
  "msg_success": "Success",
  "msg_error": "An error occurred"
}
```

### 2. Group by Feature

```json
{
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register"
  },
  "product": {
    "title": "Product",
    "add": "Add Product",
    "edit": "Edit Product"
  }
}
```

### 3. Use Interpolation for Dynamic Content

```json
// Good
{ "welcome_user": "Welcome, {name}!" }

// Avoid
{ "welcome_john": "Welcome, John!" }
```

### 4. Store User Language Preference

**Server-Side (SSR):**

```typescript
// Save to cookie
response.cookie('lang', 'id', 1000 * 60 * 60 * 24 * 365); // 1 year

// Or save to database
await DB.from('users').where('id', userId).update({ language: 'id' });
```

**Client-Side (Svelte/Inertia):**

```javascript
// Translation.js automatically saves to localStorage
await setLanguage('id');

// Language persists across page reloads
```

## Why Not i18next?

Laju uses its own Translation service because:

| Aspect | Translation.ts | i18next |
|-------|---------------|---------|
| **Stateless** | ✅ Safe for multi-user | ⚠️ Global state |
| **Bundle size** | 0 KB | ~40 KB |
| **Setup** | Zero config | Requires init |
| **Server-side** | ✅ Perfect fit | ⚠️ Needs `getFixedT()` |

i18next uses global state which can cause race conditions on servers with concurrent requests. Translation.ts is stateless - every call is independent.
