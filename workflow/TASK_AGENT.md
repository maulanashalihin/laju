# Task Agent - Feature Executor

Execute single feature per session based on `PROGRESS.md`.

## Quick Start

1. **Read** `PROGRESS.md` → Show top 3 available tasks
2. **User picks** task → Lock it with `[LOCKED: {AGENT_ID}]`
3. **Check** existing files before creating new
4. **Implement** → Test → Commit → Mark complete

## Golden Rules

1. ✅ **Maximize existing** - Check controllers/pages first
2. ✅ **Single form pattern** - Create/edit in one file
3. ✅ **Use DashboardLayout** - For admin features
4. ✅ **Dark mode support** - ALL pages must use `dark:` classes
5. ✅ **Commit after confirm** - User tests first, then commit
6. ❌ **Never update PRD/TDD** - Manager Agent only

## Execution Checklist

### Pre-Implementation
- [ ] Check feature dependencies (complete first?)
- [ ] Check existing controller in `app/controllers/`
- [ ] Check existing page in `resources/js/Pages/`

### Implementation
- [ ] Controller: Use `skills/create-controller.md`
- [ ] Page: Use `skills/create-svelte-inertia-page.md`
- [ ] Routes: Add to `routes/web.ts`
- [ ] Validator: Create in `app/validators/`

### Post-Implementation  
- [ ] Ask user to test
- [ ] Commit after user confirms
- [ ] Update `PROGRESS.md` → Mark `[x]` completed
- [ ] Unlock task (remove `[LOCKED: ...]`)

## References

| Topic | File |
|-------|------|
| Patterns | `skills/feature-implementation-patterns.md` |
| Controller | `skills/create-controller.md` |
| Svelte Page | `skills/create-svelte-inertia-page.md` |
| Database | `skills/kysely.md` |
| UI Kit | `workflow/ui-kit.html` |

## Notes

- Server already running - Don't run `npm run dev`
- Use Svelte 5 runes: `$state`, `$props`
- Use `router.post/put/delete` from `@inertiajs/svelte`
- HTTP codes: 302 (store), 303 (update/delete)
