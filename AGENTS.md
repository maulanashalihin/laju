# Laju TS — Agent Instructions

High-performance TypeScript web framework: HyperExpress + Svelte 5 + Inertia v3 + SQLite.

> 🔴 **JANGAN jalankan dev server.** User handle dev server secara manual.

## Architecture

```
routes/web.ts → app/handlers/ → app/services/ → app/repositories/ → SQLite
                                        ↕
                              app/session/ (in-memory cache)
```

- **Handlers**: Parse requests, call services, return responses. No business logic. **Setiap module/feature handler file terpisah.**
- **Services**: Business logic, auth flows, external APIs.
- **Repositories**: `app/repositories/` — **SATU-SATUNYA** layer yang execute SQL via better-sqlite3. Pake raw SQL, no ORM.
- **Session**: `app/session/` — Session store dengan data user di-cache (JSON payload di `sessions.data` column). Auth middleware baca dari sini, **TIDAK** query users table.
- **Frontend**: Svelte 5 + Inertia.js v3. Entry at `frontend/src/app.js`.

## Three-Tier Rule (🔴 CRITICAL)

**Handler → Service → Repository → DB.** Tidak ada layer yang boleh lompat.

| Layer | Boleh | Tidak Boleh |
|-------|-------|-------------|
| **Handler** | Parse request, panggil Service, return response | Panggil Repository langsung, akses DB, business logic |
| **Service** | Business logic, panggil Repository atau Session | `db.Exec`, raw SQL |
| **Repository** | **SATU-SATUNYA** yang execute SQL | — |

⚠️ Pengecualian: File test (`*.test.ts`) BOLEH panggil repository langsung.

🔴 **Ini aturan paling penting — jangan pernah dilanggar.**

## Inertia v3 Protocol

Package: [`hyper-express-inertia`](https://npmjs.com/package/hyper-express-inertia) — standalone Inertia v3 adapter for HyperExpress.

### Import — cukup satu import inertia instance

```ts
import inertia from "app/services/inertia";
```

**JANGAN** import `{ redirect, location, back }` terpisah dari package. Semua method udah tersedia di instance `inertia`.

### Render page

```ts
inertia.render(req, res, "Home", { title: "Welcome" })
```

### Flash message

```ts
inertia.flash(res, "error", "Invalid credentials")
```

### Redirect helpers — via instance

```ts
inertia.redirect(res, "/dashboard")      // 303 See Other, form submissions
inertia.location(res, "https://...")     // 409 + X-Inertia-Location (external/full page nav)
inertia.back(res, req, "/fallback")      // Back via Referer
```

### HTML Render — Inertia v3 format

Package otomatis render HTML dengan format Inertia v3:

```html
<div id="app"></div>
<script data-page="app" type="application/json">{"component":"Home",...}</script>
<link rel="stylesheet" href="/assets/index-abc.css">
<script type="module" src="/assets/app-xyz.js"></script>
```

Page data di `script[data-page]` (bukan attribute `data-page` di div).

### Shared Props — key harus sesuai frontend

```ts
// app/services/inertia.ts
inertia.shareFunc("user", (req) => {
  const session = SessionStore.get(req);
  if (!session.user_id) return null;
  return { id: session.user_id, name: session.name, ... };
});
```

Frontend akses via `page.props.user` langsung (bukan `page.props.auth.user`).

## Svelte 5 Rules

- ❌ Jangan `$effect` untuk derived state → ganti `$derived()`
- ❌ Jangan `$effect` untuk init state dari props → `$state(value ?? default)`
- ✅ `$effect` hanya untuk side effects: `document.title`, `localStorage`
- ✅ Internal link WAJIB `use:inertia`
- 🔴 `fetch()` ke `/app/*` WAJIB `X-XSRF-TOKEN` header. Inertia's `router.*` auto-handle ini.

## Session Auth

Session store di `app/session/` — user data disimpan sebagai JSON di `sessions.data` column. Auth middleware ambil dari session, set `req.user` langsung. **TIDAK** query users table.

```ts
// Auth middleware
req.user = {
  id: session.user_id,
  name: session.name,
  email: session.email,
  ...
};
```

## Frontend — Inertia v3 + @inertiajs/vite

```js
// frontend/src/app.js
import { createInertiaApp } from "@inertiajs/svelte";
createInertiaApp();
```

Vite plugin `@inertiajs/vite` handle dev HTML rendering. Backend (`hyper-express-inertia`) handle production HTML.

## Migration Rules

- 🔴 **Jangan edit migration yang sudah di-deploy.** Buat file migrasi baru.
- Migrations via better-sqlite3 langsung, file di `migrations/`.
- Satu file = satu tabel.

## Testing

- `vitest run` — unit/integration (in-memory/test SQLite, no mock)
- `playwright test` — E2E

## Wiki

Detail lebih lanjut di `.llm-wiki/wiki/`. Gunakan `wiki_search` / `wiki_recall` / `wiki_observe`.

## Gotchas

- `.vite-port` stale? `rm .vite-port && restart`
- Hyper-Express `max_body_length: 10MB`
- Session store regenerates ID on login (fixation prevention)
- Middleware (`rate-limit`) tetap pake `inertia.flash()` bukan `response.flash()`
