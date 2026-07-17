---
type: source
title: "Observation: Laju-ts refactored: session-based auth, hyper-inertia package, kysely removed"
slug: obs-2026-07-16-laju-ts-refactored-session-based-auth-hyper-inertia-package-
status: observation
created: 2026-07-16
updated: 2026-07-16
relevance: high
observed_at: 2026-07-16T14:04:43.111Z
tags: ["refactoring", "session", "auth", "kysely", "inertia", "hyper-express"]
source_context: "Refactoring laju-ts to match laju-go's architecture"
---
# ⭐ Observation: Laju-ts refactored: session-based auth, hyper-inertia package, kysely removed
Major refactoring of laju-ts project. Key changes: (1) Created @laju/hyper-inertia standalone npm package implementing Inertia v3 protocol for HyperExpress (like fiber-inertia for Go). (2) Refactored auth system: sessions store user data as JSON payload (sessions.data column), auth middleware reads from session store instead of JOINing users table — mirrors laju-go's app/session/session.go. (3) Removed Kysely and kysely-generic-sqlite dependencies, using better-sqlite3 directly via DB service with cached prepared statements. (4) All DB queries moved to app/repositories/ — handlers never access DB directly. (5) Created raw SQL migration runner (app/services/Migrator.ts) that handles kysely_migration seeding. (6) Updated package.json: removed kysely, postcss, autoprefixer, ts-node, uuidv7, uuid; using tailwindcss v4, inertia v3, svelte 5. (7) Created .llm-wiki and minimal AGENTS.md. (8) 173 passing tests at 78% line coverage.
*Relevance: high*

*Context: Refactoring laju-ts to match laju-go's architecture*

*Tags: refactoring session auth kysely inertia hyper-express*
---
*Observed: 2026-07-16T14:04:43.111Z*