---
type: source
title: "Three-Tier Architecture in Laju TS"
slug: three-tier-architecture-ts
status: insight
created: 2026-07-16
updated: 2026-07-16
category: architecture
---
# Three-Tier Architecture in Laju TS
The laju-ts project now follows the same **Handler → Service → Repository → DB** architecture as laju-go. No handler directly accesses the database. The three-tier rule is enforced: Handlers call Services, Services call Repositories, and only Repositories execute SQL. The session store (`app/session/store.ts`) mirrors laju-go's `app/session/session.go` — user data is stored as JSON in the sessions table, enabling auth without querying the users table. The `@laju/hyper-inertia` package provides Inertia v3 protocol support, extracted as a standalone package like `fiber-inertia` for Go.
*Category: architecture*
---
*Captured: 2026-07-16*
## Related
_Add links to related pages._