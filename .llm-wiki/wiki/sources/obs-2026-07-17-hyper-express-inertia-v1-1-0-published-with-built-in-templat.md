---
type: source
title: "Observation: hyper-express-inertia v1.1.0 published with built-in template customization"
slug: obs-2026-07-17-hyper-express-inertia-v1-1-0-published-with-built-in-templat
status: observation
created: 2026-07-17
updated: 2026-07-17
relevance: high
observed_at: 2026-07-17T00:26:52.168Z
---
# ⭐ Observation: hyper-express-inertia v1.1.0 published with built-in template customization
Published hyper-express-inertia v1.1.0 with:
- Built-in HTML template customization (title, favicon, csrf, devUrl, manifest, script, stylesheet)
- inertia.flash() instance method for flash messages
- No custom render function needed — package handles Vite dev/prod, CSRF, favicon

Now app/services/inertia.ts is just config + shared props. No custom render, no Eta, no flash helper.
Handlers use: inertia.render(req, res, component, props), inertia.flash(res, type, msg), redirect(res, url) from package.
No middleware needed in server.ts — inertia instance is self-contained.
*Relevance: high*
---
*Observed: 2026-07-17T00:26:52.168Z*