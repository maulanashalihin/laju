# AI-Driven Development

Build complete Laju applications using AI coding assistants without writing code manually.

## Overview

Laju's standardized structure makes it ideal for AI-assisted development. The conventions allow LLMs to understand, navigate, and build features accurately.

## Recommended AI Editors

- **Windsurf** - [codeium.com/windsurf](https://codeium.com/windsurf)
- **Trae.ai** - [trae.ai](https://trae.ai)
- **Cursor** - [cursor.sh](https://cursor.sh)

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
- Backend: HyperExpress + TypeScript
- Frontend: Svelte 5 + Inertia.js
- Database: BetterSQLite3 + Knex
- Styling: TailwindCSS 4

## Conventions
- Controllers in app/controllers/
- Pages in resources/js/Pages/
- Components in resources/js/Components/
- Use $state() and $props() for Svelte 5

## Style
- Mobile-first responsive design
- Dark mode support with dark: variant
- Primary color: Orange (#f97316)
- focus:outline-none on form inputs
```

### Directory-Specific AGENTS.md
Create AGENTS.md files in subdirectories for context-aware rules:

```
AGENTS.md (global rules)
├── app/controllers/AGENTS.md
├── app/middlewares/AGENTS.md
├── app/services/AGENTS.md
├── migrations/AGENTS.md
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
