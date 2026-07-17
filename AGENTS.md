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

Package: [`hyper-express-inertia`](https://npmjs.com/package/hyper-express-inertia) — implements Inertia v3 protocol for HyperExpress. Mirip `fiber-inertia` di laju-go.

**Render — via instance (standard API):**

```ts
import inertia from "app/services/inertia";

// handler
inertia.render(req, res, "Home", { title: "Welcome" })
```

**Flash message — via response helper (attached by package middleware):**

```ts
res.flash("error", "msg")
```

**Redirect helpers — import langsung dari package:**

```ts
import { redirect, location, back } from "hyper-express-inertia";

redirect(res, "/dashboard")      // 303 See Other, form submissions
location(res, "https://...")    // 409 + X-Inertia-Location (external/full page nav)
back(res, req, "/fallback")     // Back via Referer

## Svelte 5 Rules

- ❌ Jangan `$effect` untuk derived state → ganti `$derived()`
- ❌ Jangan `$effect` untuk init state dari props → `$state(value ?? default)`
- ✅ `$effect` hanya untuk side effects: `document.title`, `localStorage`
- ✅ Internal link WAJIB `use:inertia`
- 🔴 `fetch()` ke `/app/*` WAJIB `X-XSRF-TOKEN` header. Inertia's `router.*` auto-handle ini.

## Session Auth

Session store di `app/session/` — user data disimpan sebagai JSON di `sessions.data` column. Auth middleware ambil dari session, **TIDAK** query users table. Mirip `app/session/session.go` di laju-go.

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
