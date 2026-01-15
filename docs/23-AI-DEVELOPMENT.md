# AI-Driven Development

Build complete Laju applications using AI coding assistants without writing code manually.

## Overview

Laju's standardized structure makes it ideal for AI-assisted development. The conventions allow LLMs to understand, navigate, and build features accurately.

## Recommended AI Editors

- **Windsurf** - [codeium.com/windsurf](https://codeium.com/windsurf)
- **Trae.ai** - [trae.ai](https://trae.ai)
- **Cursor** - [cursor.sh](https://cursor.sh)
- **Claude Code** - [anthropic.com/claude](https://anthropic.com/claude)
- **Open Code** - [openai.com](https://openai.com)
- **GitHub Copilot** - [github.com/features/copilot](https://github.com/features/copilot)

## Step-by-Step Workflow

### 1. Initialize Project

```bash
npx create-laju-app project-name
cd project-name
```

### 2. Define Requirements in README

Clear the default README and describe your project:

- What problem does it solve?
- Who are the target users?
- What are the core features?
- What integrations are needed?

**Example prompt:**

```
Write new README.md based on this project description:

I want to build a task management application for small teams.

Target users: 5-20 person teams who need simple project tracking

Project name: TaskEase

Core features: 
- Create/edit/delete projects
- Add tasks with status (todo, in-progress, done)
- Assign tasks to team members
- File attachments (S3/Wasabi)
- Activity timeline

Technical requirements:
- Mobile-responsive UI
- Email notifications
- Dark mode support
```

### 3. Generate TODOLIST

Ask AI to create a structured task list:

**Prompt:**

```
Based on @README.md, create a TODOLIST.md file focusing on:
- Database migrations
- Controllers
- Svelte pages
- Components

Notes:
> Branding Color: Orange
> Theme: Dark Mode & Light Mode
> Mobile-First: All pages responsive
```

**Example output structure:**

```markdown
# TODOLIST - TaskEase

## Phase 1: Database Setup
- [ ] Create `projects` table migration
- [ ] Create `tasks` table migration
- [ ] Run migrations

## Phase 2: Backend - Controllers
- [ ] Create ProjectController
- [ ] Create TaskController

## Phase 3: Frontend - Pages
- [ ] Create projects/index.svelte
- [ ] Create projects/show.svelte
- [ ] Create tasks/index.svelte

## Progress
**Completed**: 0 / 20
**Current Phase**: Phase 1
```

### 4. Execute Tasks

Work through TODOLIST sequentially:

**Prompt examples:**

```
Based on TODOLIST.md, what should we work on now?
```

```
Implement the projects table migration. After done, update TODOLIST.md.
```

```
Create ProjectController with index, store, update, destroy methods.
```

### 5. Iterate and Refine

- Ask AI to fix bugs or adjust implementations
- Request code improvements
- Add new tasks as requirements evolve
- Update README with decisions

## Tips for Effective AI Development

1. **Be Specific** - Detailed requirements = better output

2. **One Task at a Time** - Don't overwhelm with multiple complex tasks

3. **Review Everything** - Understand generated code before approving

4. **Use Conventions** - Leverage Laju's structure (controllers, Inertia pages, migrations)

5. **Test Frequently** - Run `npm run dev` after each change

6. **Version Control** - Commit after completing each feature

7. **Ask Questions** - Request explanations for unclear implementations

## Project Rules

For consistent AI behavior, use **AGENTS.md** files:

### Root AGENTS.md
Create `AGENTS.md` at project root for global rules:

```markdown
# Laju Framework - Global Rules

## Tech Stack
- **Backend**: HyperExpress, Knex, BetterSQLite3 (WAL mode), Eta
- **Frontend**: Svelte 5 (runes), Inertia.js, TailwindCSS 4, Vite

## Architecture Overview

Controllers → Services → Database
Middlewares intercept requests before Controllers

## Critical References

- **Routing**: See `routes/AGENTS.md` (middleware arrays, catch-all order)
- **Middleware Pattern**: See `app/middlewares/AGENTS.md` (NO `next()`!)
- **Controller Pattern**: See `app/controllers/AGENTS.md` (NO `this`!)
- **Database Operations**: See `app/services/AGENTS.md` (Knex vs Native SQLite)
- **Migrations**: See `migrations/AGENTS.md`

## Cross-Cutting Concerns

### Security
- Always validate input before processing
- Use parameterized queries only
- Apply rate limiting to auth/API routes

### Authentication
- Use `Authenticate.hash()` / `Authenticate.compare()` for passwords
- Check `request.user` in protected routes

### SSR vs Inertia
- **Eta SSR**: Landing pages, SEO, emails
- **Inertia + Svelte**: Dashboard, interactive apps

## Frontend Guidelines
- TailwindCSS v4, Svelte 5 (runes), CSS-in-JS
- Custom components over libraries
- Modern CSS (Container Queries, Grid), focus:outline-none
- Minimal emoji usage
```

### Directory-Specific AGENTS.md
Create AGENTS.md files in subdirectories for context-aware rules:

```
AGENTS.md (global rules)
├── app/controllers/AGENTS.md
├── app/middlewares/AGENTS.md
├── app/services/AGENTS.md
├── migrations/AGENTS.md
├── routes/AGENTS.md
├── resources/views/AGENTS.md
└── resources/js/AGENTS.md
```

Each directory's AGENTS.md provides specific guidelines for that part of the codebase.

## Example Session

```
User: Create the projects migration

AI: [Creates migration file]

User: Now create ProjectController with CRUD methods

AI: [Creates controller with index, store, update, destroy]

User: Create the projects index page with a grid of project cards

AI: [Creates Svelte page with responsive grid]

User: Update TODOLIST.md to mark these as done

AI: [Updates TODOLIST with [x] marks]
```

This workflow allows you to build complete applications by describing what you want, letting AI handle implementation details.

---

## Autonomous Development with Ralph

For fully autonomous AI-driven development, you can use **Ralph** - an autonomous AI agent loop that runs repeatedly until all PRD items are complete.

### Overview

Ralph is an autonomous agent that:
- Runs Amp (AI coding assistant) repeatedly until all PRD items are complete
- Each iteration is a fresh Amp instance with clean context
- Memory persists via git history, `progress.txt`, and `prd.json`
- Automatically picks, implements, tests, and commits features

### When to Use Ralph

**Use Ralph for:**
- Well-defined features with clear requirements
- Repetitive tasks (CRUD operations, standard components)
- Large refactoring with clear scope
- Features that follow established patterns

**Use manual AI approach for:**
- Exploration and experimentation
- Complex business logic requiring discussion
- Learning and understanding the codebase
- Features with unclear requirements

### Setup

1. **Install Ralph scripts:**
```bash
mkdir -p scripts/ralph
# Copy ralph.sh and supporting scripts from https://github.com/snarktank/ralph
```

2. **Ensure feedback loops exist:**
```bash
# Typecheck
npm run typecheck

# Tests
npm run test
```

3. **Configure Amp auto-handoff** (recommended)

### Workflow

#### 1. Create PRD

Use the PRD skill to generate a detailed requirements document:

```
Load the prd skill and create a PRD for [your feature description]
```

Example:
```
Load the prd skill and create a PRD for user profile management feature

Requirements:
- Users can update their profile (name, email, bio)
- Profile photo upload to S3
- Email verification required
- Profile visibility settings
```

This creates `tasks/prd-[feature-name].md`

#### 2. Convert PRD to Ralph Format

Convert the markdown PRD to JSON:

```
Load the ralph skill and convert tasks/prd-[feature-name].md to prd.json
```

This creates `prd.json` with user stories structured for autonomous execution.

#### 3. Run Ralph

```bash
./scripts/ralph/ralph.sh [max_iterations]
```

Default is 10 iterations.

Ralph will:
1. Create a feature branch (from PRD `branchName`)
2. Pick the highest priority story where `passes: false`
3. Implement that single story
4. Run quality checks (typecheck, tests)
5. Commit if checks pass
6. Update `prd.json` to mark story as `passes: true`
7. Append learnings to `progress.txt`
8. Update relevant `AGENTS.md` files with discovered patterns
9. Repeat until all stories pass or max iterations reached

#### 4. Review and Merge

After Ralph completes:
```bash
# Review the changes
git diff main

# Run tests manually
npm run test

# Merge if satisfied
git checkout main
git merge feature-branch
```

### Critical Concepts

#### Each Iteration = Fresh Context

Each iteration spawns a new Amp instance with clean context. The only memory between iterations is:
- Git history (commits from previous iterations)
- `progress.txt` (learnings and context)
- `prd.json` (which stories are done)

#### Small Tasks

Each PRD item should be small enough to complete in one context window.

**Right-sized stories:**
- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

**Too big (split these):**
- "Build the entire dashboard"
- "Add authentication"
- "Refactor the API"

#### AGENTS.md Updates Are Critical

After each iteration, Ralph updates the relevant `AGENTS.md` files with learnings. This is key because Amp automatically reads these files, so future iterations (and future human developers) benefit from discovered patterns, gotchas, and conventions.

**Examples of what to add to AGENTS.md:**
- Patterns discovered ("this codebase uses X for Y")
- Gotchas ("do not forget to update Z when changing W")
- Useful context ("the settings panel is in component X")

#### Feedback Loops

Ralph only works if there are feedback loops:
- Typecheck catches type errors
- Tests verify behavior
- CI must stay green (broken code compounds across iterations)

#### Browser Verification for UI Stories

Frontend stories must include "Verify in browser using dev-browser skill" in acceptance criteria. Ralph will use the dev-browser skill to navigate to the page, interact with the UI, and confirm changes work.

#### Stop Condition

When all stories have `passes: true`, Ralph outputs `<promise>COMPLETE</promise>` and the loop exits.

### Example prd.json for Laju

```json
{
  "branchName": "feature/user-profile",
  "stories": [
    {
      "id": 1,
      "priority": 1,
      "description": "Add profile photo upload to S3",
      "acceptanceCriteria": [
        "User can upload photo from profile page",
        "Photo is stored in S3 bucket",
        "Database stores photo URL",
        "Verify in browser using dev-browser skill"
      ],
      "passes": false
    },
    {
      "id": 2,
      "priority": 2,
      "description": "Add email verification for profile updates",
      "acceptanceCriteria": [
        "Email change requires verification",
        "Verification token sent to new email",
        "Email only updates after verification",
        "Verify in browser using dev-browser skill"
      ],
      "passes": false
    },
    {
      "id": 3,
      "priority": 3,
      "description": "Add profile visibility settings",
      "acceptanceCriteria": [
        "User can set profile to public/private",
        "Private profiles only show name to non-followers",
        "Settings persisted in database",
        "Verify in browser using dev-browser skill"
      ],
      "passes": false
    }
  ]
}
```

### Example progress.txt

```
# User Profile Feature - Progress Log

## Iteration 1
- Story: Add profile photo upload to S3
- Implementation: Created UploadController, added S3 service, updated migration
- Learnings:
  - Use S3Service.upload() for all file uploads
  - Remember to add multipart/form-data parser to routes
  - Photo URLs should be stored in users.avatar_url column
- AGENTS.md updated: app/controllers/AGENTS.md, app/services/AGENTS.md

## Iteration 2
- Story: Add email verification for profile updates
- Implementation: Created EmailVerificationService, added email_change_tokens table
- Learnings:
  - Email changes require token verification before updating database
  - Use MailService.send() for all emails
  - Token expires after 24 hours
- AGENTS.md updated: app/services/AGENTS.md
```

### Hybrid Workflow

For best results, combine both approaches:

1. **Exploration Phase** - Use manual AI approach to explore and understand requirements
2. **Definition Phase** - Create clear PRD based on exploration
3. **Implementation Phase** - Run Ralph for autonomous implementation
4. **Refinement Phase** - Use manual AI approach to fix issues and add polish

### Troubleshooting

**Ralph gets stuck on a story:**
- Story might be too large - split it into smaller stories
- Check if feedback loops (tests, typecheck) are working
- Review `progress.txt` for learnings that might help

**Tests failing after Ralph commits:**
- Ralph might have made incorrect assumptions
- Manually fix the issue
- Update `AGENTS.md` with the fix
- Re-run Ralph or continue manually

**Ralph produces poor code:**
- Ensure stories are small and well-defined
- Check that `AGENTS.md` has sufficient context
- Add more specific acceptance criteria

### Resources

- [Ralph Repository](https://github.com/snarktank/ralph)
- [Original Ralph Pattern](https://ghuntley.com/ralph/)
- [Amp](https://ampcode.com)
