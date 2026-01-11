# Translation (Multi-Language)

Laju menyediakan Translation service yang ringan dan stateless untuk multi-language support.

## Basic Usage

```typescript
import { t } from "../services/Translation";

// Basic translation
t('welcome', 'id')     // "Selamat datang"
t('welcome', 'en')     // "Welcome"

// With interpolation
t('greeting', 'id', { name: 'Budi' })  // "Halo, Budi!"

// Nested keys
t('errors.required', 'id', { field: 'Email' })  // "Email wajib diisi"
```

## Supported Languages

| Code | Language |
|------|----------|
| `en` | English |
| `id` | Indonesian |
| `ar` | Arabic |
| `fr` | French |
| `de` | German |
| `tr` | Turkish |
| `ur` | Urdu |
| `ps` | Pashto |
| `fa` | Persian |
| `sw` | Swahili |

## Language Files

Translation files disimpan di `app/services/languages/`:

```
app/services/languages/
├── en.json
├── id.json
├── ar.json
├── fr.json
└── ...
```

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
import { t } from "../services/Translation";
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

## Usage in Inertia Pages (Svelte)

### Pass Language from Controller

```typescript
// Controller
async index(request: Request, response: Response) {
  const lang = request.cookies.lang || 'en';
  
  return response.inertia('dashboard', {
    lang,
    translations: {
      welcome: t('welcome', lang),
      dashboard: t('dashboard', lang)
    }
  });
}
```

### Use in Svelte Component

```svelte
<script>
  let { translations } = $props();
</script>

<h1>{translations.welcome}</h1>
<p>{translations.dashboard}</p>
```

### Alternative: Import Translation in Frontend

```svelte
<script>
  import { t } from '../../services/Translation';
  
  let { lang = 'en' } = $props();
</script>

<h1>{t('welcome', lang)}</h1>
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

## Fallback Behavior

Jika key tidak ditemukan, function mengembalikan key itu sendiri:

```typescript
t('unknown_key', 'id')  // Returns: "unknown_key"
```

Ini memudahkan debugging - Anda bisa langsung lihat key mana yang belum ditranslasi.

## Best Practices

### 1. Consistent Key Naming

```json
{
  "btn_save": "Simpan",
  "btn_cancel": "Batal",
  "btn_delete": "Hapus",
  
  "label_name": "Nama",
  "label_email": "Email",
  
  "msg_success": "Berhasil",
  "msg_error": "Terjadi kesalahan"
}
```

### 2. Group by Feature

```json
{
  "auth": {
    "login": "Masuk",
    "logout": "Keluar",
    "register": "Daftar"
  },
  "product": {
    "title": "Produk",
    "add": "Tambah Produk",
    "edit": "Edit Produk"
  }
}
```

### 3. Use Interpolation for Dynamic Content

```json
// Good
{ "welcome_user": "Selamat datang, {name}!" }

// Avoid
{ "welcome_john": "Selamat datang, John!" }
```

### 4. Store User Language Preference

```typescript
// Save to cookie
response.cookie('lang', 'id', 1000 * 60 * 60 * 24 * 365); // 1 year

// Or save to database
await DB.from('users').where('id', userId).update({ language: 'id' });
```

## Why Not i18next?

Laju menggunakan Translation service sendiri karena:

| Aspek | Translation.ts | i18next |
|-------|---------------|---------|
| **Stateless** | ✅ Aman multi-user | ⚠️ Global state |
| **Bundle size** | 0 KB | ~40 KB |
| **Setup** | Zero config | Perlu init |
| **Server-side** | ✅ Perfect fit | ⚠️ Perlu `getFixedT()` |

i18next menggunakan global state yang bisa menyebabkan race condition di server dengan concurrent requests. Translation.ts stateless - setiap call independen.
