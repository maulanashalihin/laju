---
type: source
title: "Observation: hyper-express-inertia simplified integration"
slug: obs-2026-07-16-hyper-express-inertia-simplified-integration
status: observation
created: 2026-07-16
updated: 2026-07-16
relevance: high
observed_at: 2026-07-16T23:16:28.843Z
---
# ⭐ Observation: hyper-express-inertia simplified integration
Refactored Inertia integration in laju-ts to follow hyper-express-inertia package's standard API:

1. Removed `app/middlewares/inertia.middleware.ts` — `inertia.middleware()` called directly in server.ts
2. Simplified `app/services/inertia.ts` — removed wrapper exports (redirect/location/back), use plain string template for HTML render instead of Eta
3. Removed `templates/inertia.html` — replaced by inline template string
4. Handlers import `inertia` instance and use `inertia.render(req, res, component, props)` 
5. Handlers import `{ redirect, location, back }` from `hyper-express-inertia` package directly
6. Flash messages handled automatically via `inertia.shareFunc("flash", ...)` — no need to inject in render
7. Type augmentation simplified to just `inertia()` and `flash()` response helpers
*Relevance: high*
---
*Observed: 2026-07-16T23:16:28.843Z*