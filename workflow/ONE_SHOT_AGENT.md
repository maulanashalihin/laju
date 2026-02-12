# One-Shot Agent - Sequential Executor

Execute ALL features from `PROGRESS.md` in one session.

## Quick Start

1. **Read** `IMPLEMENTATION_BRIEF.md` → Check project status & tech stack
2. **Read** `PROGRESS.md` → Count total features
3. **Display** summary → Wait 5s (or STOP)
4. **Execute** sequentially: Feature 1 → Commit → Feature 2 → ...
5. **Stop** only on critical errors or when done

## Golden Rules

1. ✅ **Sequential only** - 1 feature at a time, no parallel
2. ✅ **Auto-commit every feature** - Don't wait until end
3. ✅ **Continue until done** - Don't stop unless critical error
4. ✅ **Handle dependencies first** - Reorder if needed
5. ✅ **Dark mode support** - ALL pages must use `dark:` classes
6. ❌ **Never update PRD/TDD** - Manager Agent only

## Execution Loop

```
FOR each feature in PROGRESS.md:
    ├── Lock with `[LOCKED: ONESHOT_{ID}]`
    ├── Check existing files
    ├── Implement (see skills/)
    ├── Basic test (happy path)
    ├── Update PROGRESS.md → `[x]`
    ├── Commit: "feat: implement [Feature Name]"
    └── NEXT
```

## Pre-Flight Check

- [ ] Read `IMPLEMENTATION_BRIEF.md` - Check Status
  - If 🔴 **NOT READY**: Stop and ask user to complete setup
  - If 🟢 **READY**: Continue
- [ ] If >20 features: Warn user, suggest TASK_AGENT instead
- [ ] Identify dependencies, reorder if needed
- [ ] Ensure git repo exists

## Error Handling

| Type | Action |
|------|--------|
| Type/import errors | Auto-fix, continue |
| Database/Env issues | Pause, notify user |
| Git failures | Pause, notify user |

## Recovery (If Disconnected)

1. Check `git log --oneline` for last commit
2. Check `PROGRESS.md` for last completed
3. Resume from next feature

## References

| Topic | File |
|-------|------|
| Project Brief | `workflow/IMPLEMENTATION_BRIEF.md` |
| Patterns | `skills/feature-implementation-patterns.md` |
| Controller | `skills/create-controller.md` |
| Request/Response | `skills/hyper-express.md` |
| Svelte Page | `skills/create-svelte-inertia-page.md` |
| Database | `skills/kysely.md` |
| UI Kit | `workflow/ui-kit.html` |

## Notes

- Server already running - Don't run `npm run dev`
- Use Svelte 5 runes: `$state`, `$props`
- Commit message: `feat: implement [Feature Name]`
