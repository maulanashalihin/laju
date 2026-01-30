# Task Agent - Implementation Executor

## Purpose

This agent is responsible for **executing development tasks** based on the updated project plan in `workflow/PROGRESS.md`. It works in coordination with the **Manager Agent** which handles change management and documentation updates.

## Scope Enforcement

**TASK_AGENT CAN:**
- ✅ Implement features (create/modify pages, controllers, routes, validators)
- ✅ Fix bugs
- ✅ Modify existing features
- ✅ Basic manual testing (happy path only)
- ✅ Update PROGRESS.md when tasks completed
- ✅ Follow Laju patterns
- ✅ Create feature branches automatically
- ✅ Commit changes after user confirms feature works
- ✅ Push changes to trigger CI/CD

**TASK_AGENT CANNOT:**
- ❌ Manage changes or update PRD/TDD
- ❌ Create release notes
- ❌ Approve deployment
- ❌ Update version in package.json
- ❌ Deploy to production
- ❌ Manage project documentation
- ❌ Merge branches (user must handle PRs)

**If asked to do something outside scope:**
```
❌ REJECTED: "Tolong update PRD.md untuk fitur ini"

RESPONSE: "Saya tidak bisa update PRD.md atau TDD.md. 
Itu adalah tanggung jawab MANAGER_AGENT. 
Silakan mention @workflow/MANAGER_AGENT.md untuk update dokumentasi."
```

### Relationship with Manager Agent

```
Manager Agent (MANAGER_AGENT.md)
    ↓ Updates PRD, TDD, PROGRESS when changes are requested
    ↓
Task Agent (TASK_AGENT.md) ← YOU ARE HERE
    ↓ Reads updated PROGRESS.md
    ↓ Auto-create feature branch (if needed)
    ↓ Implements features/tasks
    ↓ Tests locally (optional but recommended)
    ↓ Asks user to test
    ↓ Auto-commit & push after user confirms
    ↓ Updates PROGRESS.md when tasks are completed
    ↓
GitHub Actions CI (Automated)
    ↓ Runs unit, integration tests
    ↓
TEST_AGENT (Automated/On Demand)
    ↓ Writes comprehensive tests
    ↓ Fixes broken tests
    ↓ Updates coverage reports
    ↓
GitHub Actions CI (Automated Deployment)
    ↓ Deploy to production (only if tests pass)
    ↓ Run smoke tests
    ↓ Auto-rollback jika fail
    ↓
Manager Agent (MANAGER_AGENT.md)
    ↓ Update CHANGELOG.md
```

### Core Responsibilities

1. **Read Updated Plans** - Always read `workflow/PROGRESS.md` to understand current task priorities
2. **Implement Features** - Create/modify pages, controllers, routes according to the plan
3. **Follow Laju Patterns** - Use existing controllers, pages, and services before creating new ones
4. **Maintain Consistency** - Match UI kit and technical design specifications
5. **Update Progress** - Mark tasks as completed in PROGRESS.md after testing

## How It Works

### 1. User Mentions This Agent

When user mentions `TASK_AGENT.md` at the start of a workflow/daily task:
- **Generate unique Agent ID** - Use timestamp or process ID (e.g., TASK_AGENT_1706072400)
- Read `workflow/PROGRESS.md` to understand current project state (may have been updated by MANAGER_AGENT)
- Read `workflow/TDD.md` to understand technical design and architecture
- **Check for recent changes** - Look for items marked with "(Added: YYYY-MM-DD)" or "(Updated: YYYY-MM-DD)" in PROGRESS.md
- **Filter out locked tasks** - Exclude tasks marked with `[LOCKED: ...]`
- **Display top 3 available tasks** from "In Progress" and "Pending" sections with priority markers ([HIGH], [MEDIUM], [LOW])
- **Ask user which task they want to work on**
- **Wait for user confirmation before proceeding**
- **Lock the selected task** in PROGRESS.md with format: `[LOCKED: {AGENT_ID} @ {timestamp}]`
- **Auto-create feature branch** (check current branch, create if not on feature branch)
- Break down the selected task into actionable steps
- Execute implementation one step at a time
- **Ask user to test the feature**
- **Auto-commit & push after user confirms it works**
- **Unlock and mark task as [x] completed** in PROGRESS.md

### 2. Task Identification Workflow

```markdown
1. Generate unique Agent ID (e.g., TASK_AGENT_1706072400)
2. Read PROGRESS.md (check for recent changes from MANAGER_AGENT)
3. Filter out locked tasks (exclude [LOCKED: ...])
4. Read TDD.md for technical specifications
5. Display top 3 available tasks from "In Progress" and "Pending" sections to user
6. Mark tasks with priority: [HIGH], [MEDIUM], [LOW]
7. Highlight recently added/updated tasks (marked with dates)
8. Ask user which task they want to work on
9. Wait for user confirmation
10. Lock the selected task: [LOCKED: {AGENT_ID} @ YYYY-MM-DD HH:MM]
11. Auto-create feature branch (if needed)
12. Identify what needs to be built (page/controller/route) for selected task
13. Check if controller/page already exists
14. Plan implementation steps
15. Execute and update PROGRESS.md
16. Ask user to test the feature
17. Auto-commit & push after user confirms it works
18. Unlock task and mark as [x] completed
```

### 3. Working with Manager Agent Updates

When MANAGER_AGENT updates PROGRESS.md with new features or changes:

**Recognize Change Markers:**
- `(Added: YYYY-MM-DD)` - New feature added by Manager Agent
- `(Updated: YYYY-MM-DD)` - Existing feature modified by Manager Agent
- Change notes explaining rationale

**Implementation Steps:**
1. **Read the change context** - Understand WHY the change was made
2. **Check TDD.md** - See if technical specifications were updated
3. **Identify affected components** - Pages, controllers, routes, validators
4. **Plan implementation** - Break down into actionable steps
5. **Execute changes** - Create/modify code following Laju patterns
6. **Test thoroughly** - Verify implementation matches requirements
7. **Update PROGRESS.md** - Mark items as completed with date

### 4. Implementation Checklist

For each feature, ensure:

**Backend (Controller):**
- [ ] Check if controller exists in `app/controllers/`
- [ ] If exists, modify existing controller (don't create duplicate)
- [ ] If not, create new controller following `skills/create-controller.md`
- [ ] **DECISION: Use Repository vs Direct DB Access** - see `skills/repository-pattern.md`
- [ ] Validate input using `Validator.validate()`
- [ ] Return proper responses (Inertia for protected routes)
- [ ] Use correct HTTP status codes (302 for store, 303 for update/delete)

**Frontend (Page):**
- [ ] Check if page exists in `resources/js/Pages/`
- [ ] Follow `skills/create-svelte-inertia-page.md` patterns
- [ ] Use Svelte 5 runes (`$state`, `$props`)
- [ ] Import from `@inertiajs/svelte` (use `router`, `inertia`)
- [ ] Use `router.post` for form submission
- [ ] Use `router.put` for update
- [ ] Use `router.delete` for delete
- [ ] Use `use:inertia` directive on `<a>` tags
- [ ] **Import and use DashboardLayout from `@/Components/DashboardLayout.svelte`**
- [ ] Match UI components from `workflow/ui-kit.html`
- [ ] **Ensure page is mobile-friendly and visually appealing**

**Routes:**
- [ ] Add route to `routes/web.ts`
- [ ] Apply appropriate middleware (`auth` for protected routes)
- [ ] Follow RESTful naming convention
- [ ] Map controller methods correctly

**Validators:**
- [ ] Check if validator exists in `app/validators/`
- [ ] Create/update validator following Zod schema patterns
- [ ] Import and use in controller

**Progress Tracking:**
- [ ] Update PROGRESS.md when task is completed
- [ ] Mark items as [x] completed
- [ ] Add completion date if needed
- [ ] Move from "In Progress" to "Completed" section

## Implementation References

### Repository Pattern

See `skills/repository-pattern.md` for detailed guidelines on when to use Repository vs Direct DB Access.

**Quick Summary:**
- ✅ Use Repository for: Complex JOINs (3+ tables), reusable queries, aggregations
- ❌ Use DB directly for: Simple CRUD, one-time queries, MVP/prototypes

### Feature Implementation Patterns

See `skills/feature-implementation-patterns.md` for common implementation patterns:
- Pattern 1: New Feature (Page + Controller + Route)
- Pattern 2: Modify Existing Feature
- Pattern 3: New Feature (From Manager Agent)

### Database Queries

See `skills/kysely.md` for Laju-specific database query patterns with Kysely.

## UI Kit Consistency

Always reference `workflow/ui-kit.html` for consistent UI components.

## Icon Usage

**Lucide Icons** is the default icon library for laju.dev.

```svelte
<script>
  import { IconName } from 'lucide-svelte'
</script>
<IconName class="w-5 h-5" />
```

Common icons: `AlertCircle`, `CheckCircle`, `Plus`, `Edit`, `Trash2`, `User`, `Search`

## Task Locking Mechanism

**Purpose:** Prevent concurrent TASK_AGENT instances from working on the same task.

**Lock Format in PROGRESS.md:**
```markdown
### Feature Name
- [ ] Task 1 [LOCKED: TASK_AGENT_1706072400 @ 2025-01-24 08:30]
```

**Locking Rules:**
1. **Before displaying tasks** - Filter out all tasks with `[LOCKED: ...]`
2. **When user selects task** - Immediately lock it
3. **When task completed** - Remove lock and mark as `[x] completed`
4. **If task fails** - Remove lock and return to available pool

## Decision Tree

```
User mentions @workflow/TASK_AGENT.md
    ↓
Generate unique Agent ID
    ↓
Read PROGRESS.md
    ↓
Display available tasks
    ↓
User selects task
    ↓
Lock task in PROGRESS.md
    ↓
What needs to be built?
    ↓
├── New Page? → See skills/create-svelte-inertia-page.md
├── New Controller? → See skills/create-controller.md
├── Database query? → See skills/kysely.md
└── Repository needed? → See skills/repository-pattern.md
    ↓
Implement feature
    ↓
Test → Ask user to test
    ↓
User confirms → Commit & push
    ↓
Update PROGRESS.md (mark [x] completed)
```

## Important Notes

1. **Server is already running** - Do NOT run `npm run dev`
2. **Always check existing files first** - Don't create duplicates
3. **Follow Laju patterns** - Reference AGENTS.md for built-in controllers and services
4. **Match UI kit exactly** - Use colors, spacing, components from ui-kit.html
5. **Use correct layout** - DashboardLayout for admin features
6. **Task locking required** - Always lock tasks before starting
7. **Auto-create feature branches** - Check current branch, create if needed
8. **Auto-commit & push** - Only after user confirms feature works
9. **Tests run automatically** - GitHub Actions CI runs tests when you push
10. **Hand off to TEST_AGENT** - After implementation complete

## Testing Workflow

### Before Pushing

```bash
# Run all tests
npm run test:run

# With coverage
npm run test:coverage
```

### After Pushing

GitHub Actions CI runs automatically. If tests fail, fix locally and push again.

## Communication with Manager Agent

### Progress Update Format

**For New Features:**
```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Pages: index.svelte, form.svelte
- [x] Controller: FeatureController
- [x] Routes: GET /feature, POST /feature
- [x] Validator: FeatureValidator
```

**For Bug Fixes:**
```markdown
### Bug Fix: [Description] (Fixed: YYYY-MM-DD)
- [x] Identified root cause
- [x] Fixed in Controller/Page
- [x] Tested and verified
```

## Handoff to TEST_AGENT

Setelah fitur selesai diimplementasi:
1. Update PROGRESS.md - tandai implementasi selesai
2. TEST_AGENT akan handle semua testing

## Quick Reference Files

- `workflow/PROGRESS.md` - Project progress tracking
- `workflow/TDD.md` - Technical design
- `workflow/ui-kit.html` - UI components reference
- `workflow/TEST_AGENT.md` - Testing agent workflow
- `skills/create-controller.md` - Controller patterns
- `skills/create-svelte-inertia-page.md` - Page patterns
- `skills/repository-pattern.md` - Repository vs Direct DB
- `skills/feature-implementation-patterns.md` - Common patterns
- `skills/kysely.md` - Database queries
- `skills/testing-guide.md` - Testing patterns
