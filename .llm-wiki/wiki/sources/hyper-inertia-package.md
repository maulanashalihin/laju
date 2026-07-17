---
type: source
title: "@laju/hyper-inertia - Standalone Inertia v3 Adapter"
slug: hyper-inertia-package
status: insight
created: 2026-07-16
updated: 2026-07-16
category: architecture
---
# @laju/hyper-inertia - Standalone Inertia v3 Adapter
Created `@laju/hyper-inertia` as a standalone npm package at `packages/hyper-inertia/`. It implements the Inertia v3 protocol for HyperExpress with zero dependencies beyond the peer dependency on hyper-express. Features: auto-detect XHR vs initial load, asset versioning (409 Conflict), shared props (static and per-request via shareFunc), partial reloads (X-Inertia-Partial-Data/Except), internal redirects (303), external redirects (409 + X-Inertia-Location), back navigation, and custom root template rendering. Pattern inspired by [[sources/obs-2026-07-16-fiber-inertia-library-created-inertia-js-adapter-for-go-fibe]].
*Category: architecture*
---
*Captured: 2026-07-16*
## Related
_Add links to related pages._