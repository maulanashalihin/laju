---
type: source
title: "hyper-express-inertia — Standalone Inertia v3 Adapter for HyperExpress"
slug: hyper-inertia-package
status: insight
created: 2026-07-16
updated: 2026-07-17
category: architecture
---

# hyper-express-inertia — Standalone Inertia v3 Adapter for HyperExpress

Published at [`hyper-express-inertia`](https://npmjs.com/package/hyper-express-inertia) on npm.
Source repo at `packages/hyper-inertia/` (later moved to `/Volumes/data/Project/hyper-inertia`).

Implements Inertia v3 protocol for HyperExpress with zero dependencies (only peer dep on hyper-express).

## Features

- Auto-detect XHR vs initial load (via `X-Inertia` header)
- Asset versioning (409 Conflict on mismatch)
- Shared props — static (`share`) and per-request (`shareFunc`)
- Partial reloads (`X-Inertia-Partial-Data` / `Except`)
- Internal redirects (303 See Other)
- External redirects (409 + `X-Inertia-Location`)
- Back navigation via Referer header
- Flash messages (cookie-based, 5s TTL)
- Custom root template rendering (`config.render`)

## HTML Render — Inertia v3 (since v1.3.0)

```html
<div id="app"></div>
<script data-page="app" type="application/json">{"component":"Home",...}</script>
<link rel="stylesheet" href="/assets/index-abc.css">
<script type="module" src="/assets/app-xyz.js"></script>
```

Sebelumnya (v1.2.x): page data di attribute `data-page` pada `#app` div.

## API — instance methods

Semua method tersedia di instance `Inertia`. Jangan import `redirect`, `location`, `back` terpisah.

```ts
inertia.render(req, res, component, props?)
inertia.flash(res, type, message)
inertia.redirect(res, url)       // 303
inertia.location(res, url)       // 409
inertia.back(res, req, fallback?)
```

## Shared Props

Key harus sesuai dengan yang dibaca frontend. Laju-ts pake key `"user"` langsung (bukan `"auth"` dengan nested `{ user }`).

*Category: architecture*
---

*Captured: 2026-07-16*
