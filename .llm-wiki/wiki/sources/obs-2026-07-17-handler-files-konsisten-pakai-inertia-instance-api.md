---
type: source
title: "Observation: Handler files konsisten pakai inertia instance API"
slug: obs-2026-07-17-handler-files-konsisten-pakai-inertia-instance-api
status: observation
created: 2026-07-17
updated: 2026-07-17
relevance: medium
observed_at: 2026-07-17T00:38:54.867Z
source_context: "Standardizing inertia instance API usage across all handler files"
---
# 🔍 Observation: Handler files konsisten pakai inertia instance API
Semua handler files di app/handlers/ sekarang konsisten pakai inertia instance methods (inertia.redirect, inertia.flash, inertia.render) instead of imported standalone redirect dari hyper-express-inertia. Files yang di-fix: app.handler.ts, auth.handler.ts. Files lain (asset, public, s3, storage, upload) ga pake Inertia sama sekali (pure JSON API / static file serving).
*Relevance: medium*

*Context: Standardizing inertia instance API usage across all handler files*
---
*Observed: 2026-07-17T00:38:54.867Z*