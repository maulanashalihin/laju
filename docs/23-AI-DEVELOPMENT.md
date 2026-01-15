# AI-Driven Development

Build complete Laju applications using AI coding assistants without writing code manually.

## Real-World Example: Building a Task Management App

Throughout this guide, we'll build **TaskFlow** - a task management application for small teams.

**Project Requirements:**
- Users can create projects
- Projects contain tasks with status (todo, in-progress, done)
- Tasks can be assigned to team members
- Simple dashboard to view all tasks
- Mobile-responsive design

---

## Phase 1: Project Initialization

### Step 1: Create New Project

```bash
npx create-laju-app taskflow
cd taskflow
npm run dev
```

Server runs at `http://localhost:3000`

### Step 2: Review AGENTS.md

Laju comes with pre-configured AGENTS.md files. Review them to understand the framework conventions:

- `AGENTS.md` - Global rules and tech stack
- `app/controllers/AGENTS.md` - Controller patterns
- `app/middlewares/AGENTS.md` - Middleware patterns
- `app/services/AGENTS.md` - Database operations
- `migrations/AGENTS.md` - Migration patterns
- `routes/AGENTS.md` - Routing patterns
- `resources/js/AGENTS.md` - Frontend guidelines

---

## Phase 2: Define Requirements

### Step 5: Update README.md

```markdown
# TaskFlow

A simple task management application for small teams.

## Problem
Small teams (5-20 people) need a simple way to track tasks without complex project management overhead.

## Target Users
- Small startup teams
- Freelancers working with clients
- Project managers needing simple tracking

## Core Features
1. **Project Management**
   - Create, edit, delete projects
   - Project description and due dates

2. **Task Management**
   - Add tasks to projects
   - Set task status (todo, in-progress, done)
   - Assign tasks to team members
   - Set task priorities (low, medium, high)

3. **Dashboard**
   - View all tasks across projects
   - Filter by status and priority
   - Quick task creation

## Technical Requirements
- Mobile-responsive design
- Real-time status updates
- Simple, clean UI
- Fast performance (< 100ms page loads)
```

### Step 6: Generate TODOLIST.md

**Prompt to AI:**
```
Based on README.md, create TODOLIST.md for TaskFlow project.

Focus on:
1. Database migrations (users, projects, tasks)
2. Controllers (ProjectController, TaskController)
3. Services (ProjectService, TaskService)
4. Frontend pages (dashboard, projects, tasks)

Notes:
> Branding Color: Blue (#3B82F6)
> Theme: Light mode only
> Mobile-First: All pages responsive
> Use TailwindCSS for styling
```

**Generated TODOLIST.md:**
```markdown
# TODOLIST - TaskFlow

## Phase 1: Database Setup
- [ ] Create users table migration
- [ ] Create projects table migration
- [ ] Create tasks table migration
- [ ] Run all migrations

## Phase 2: Backend Services
- [ ] Create ProjectService
- [ ] Create TaskService
- [ ] Create UserService

## Phase 3: Controllers
- [ ] Create ProjectController
- [ ] Create TaskController
- [ ] Create DashboardController

## Phase 4: Frontend Pages
- [ ] Create dashboard page
- [ ] Create projects index page
- [ ] Create projects show page
- [ ] Create tasks index page

## Phase 5: Testing & Polish
- [ ] Test all CRUD operations
- [ ] Test responsive design
- [ ] Fix bugs and refine UI

## Progress
**Completed**: 0 / 16
**Current Phase**: Phase 1
```

---

## Phase 3: Database Setup

### Step 7: Create Users Migration

**Prompt to AI:**
```
Create a migration for users table with:
- id (UUID, primary key)
- name (string, required)
- email (string, unique, required)
- password_hash (string, required)
- created_at (timestamp)
- updated_at (timestamp)

After creating, run the migration and update TODOLIST.md.
```

**AI creates:** `migrations/20250115120000_create_users.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
```

**Commit:**
```bash
git add migrations/20250115120000_create_users.ts
git commit -m "feat: add users table migration"
```

**Update TODOLIST.md:**
```markdown
## Phase 1: Database Setup
- [x] Create users table migration (commit: abc123)
- [ ] Create projects table migration
- [ ] Create tasks table migration
- [ ] Run all migrations
```

### Step 8: Create Projects Migration

**Prompt to AI:**
```
Create a migration for projects table with:
- id (UUID, primary key)
- name (string, required)
- description (text, nullable)
- user_id (UUID, foreign key to users)
- due_date (date, nullable)
- created_at (timestamp)
- updated_at (timestamp)

After creating, commit and update TODOLIST.md.
```

**AI creates:** `migrations/20250115120001_create_projects.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.text('description').nullable();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.date('due_date').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('projects');
}
```

**Commit:**
```bash
git add migrations/20250115120001_create_projects.ts
git commit -m "feat: add projects table migration"
```

**Update TODOLIST.md:**
```markdown
- [x] Create projects table migration (commit: def456)
```

### Step 9: Create Tasks Migration

**Prompt to AI:**
```
Create a migration for tasks table with:
- id (UUID, primary key)
- title (string, required)
- description (text, nullable)
- project_id (UUID, foreign key to projects)
- assigned_to (UUID, foreign key to users, nullable)
- status (enum: 'todo', 'in_progress', 'done', default: 'todo')
- priority (enum: 'low', 'medium', 'high', default: 'medium')
- due_date (date, nullable)
- created_at (timestamp)
- updated_at (timestamp)

After creating, commit and update TODOLIST.md.
```

**AI creates:** `migrations/20250115120002_create_tasks.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title').notNullable();
    table.text('description').nullable();
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.uuid('assigned_to').references('id').inTable('users').onDelete('SET NULL').nullable();
    table.enum('status', ['todo', 'in_progress', 'done']).defaultTo('todo');
    table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium');
    table.date('due_date').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks');
}
```

**Commit:**
```bash
git add migrations/20250115120002_create_tasks.ts
git commit -m "feat: add tasks table migration"
```

**Update TODOLIST.md:**
```markdown
- [x] Create tasks table migration (commit: ghi789)
```

### Step 10: Run Migrations

```bash
npm run migrate
```

**Commit:**
```bash
git add database/
git commit -m "chore: run database migrations"
```

**Update TODOLIST.md:**
```markdown
## Phase 1: Database Setup
- [x] Create users table migration (commit: abc123)
- [x] Create projects table migration (commit: def456)
- [x] Create tasks table migration (commit: ghi789)
- [x] Run all migrations (commit: jkl012)

## Progress
**Completed**: 4 / 16
**Current Phase**: Phase 2
```

---

## Phase 4: Backend Services

### Step 11: Create ProjectService

**Prompt to AI:**
```
Create ProjectService in app/services/ProjectService.ts with methods:
- getAll(userId): Get all projects for a user
- getById(id): Get project by ID
- create(data): Create new project
- update(id, data): Update project
- delete(id): Delete project

Use Knex for database operations. Follow Laju service patterns.
After creating, commit and update TODOLIST.md.
```

**AI creates:** `app/services/ProjectService.ts`

```typescript
import Database from '@ioc:Adonis/Lucid/Database';
import { Project } from '../types';

export class ProjectService {
  async getAll(userId: string) {
    return Database.from('projects')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
  }

  async getById(id: string) {
    return Database.from('projects').where('id', id).first();
  }

  async create(data: Partial<Project>) {
    const [project] = await Database('projects')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return project;
  }

  async update(id: string, data: Partial<Project>) {
    const [project] = await Database('projects')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return project;
  }

  async delete(id: string) {
    await Database('projects').where('id', id).delete();
  }
}
```

**Commit:**
```bash
git add app/services/ProjectService.ts
git commit -m "feat: create ProjectService"
```

**Update TODOLIST.md:**
```markdown
## Phase 2: Backend Services
- [x] Create ProjectService (commit: mno345)
- [ ] Create TaskService
- [ ] Create UserService
```

### Step 12: Create TaskService

**Prompt to AI:**
```
Create TaskService in app/services/TaskService.ts with methods:
- getAll(projectId): Get all tasks for a project
- getById(id): Get task by ID
- create(data): Create new task
- update(id, data): Update task
- delete(id): Delete task
- updateStatus(id, status): Update task status

After creating, commit and update TODOLIST.md.
```

**AI creates:** `app/services/TaskService.ts`

```typescript
import Database from '@ioc:Adonis/Lucid/Database';
import { Task } from '../types';

export class TaskService {
  async getAll(projectId: string) {
    return Database.from('tasks')
      .where('project_id', projectId)
      .orderBy('priority', 'desc')
      .orderBy('created_at', 'desc');
  }

  async getById(id: string) {
    return Database.from('tasks').where('id', id).first();
  }

  async create(data: Partial<Task>) {
    const [task] = await Database('tasks')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return task;
  }

  async update(id: string, data: Partial<Task>) {
    const [task] = await Database('tasks')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return task;
  }

  async updateStatus(id: string, status: 'todo' | 'in_progress' | 'done') {
    return this.update(id, { status });
  }

  async delete(id: string) {
    await Database('tasks').where('id', id).delete();
  }
}
```

**Commit:**
```bash
git add app/services/TaskService.ts
git commit -m "feat: create TaskService"
```

**Update TODOLIST.md:**
```markdown
- [x] Create TaskService (commit: pqr678)
```

### Step 13: Create UserService

**Prompt to AI:**
```
Create UserService in app/services/UserService.ts with methods:
- getById(id): Get user by ID
- getByEmail(email): Get user by email
- create(data): Create new user

After creating, commit and update TODOLIST.md.
```

**AI creates:** `app/services/UserService.ts`

```typescript
import Database from '@ioc:Adonis/Lucid/Database';
import { User } from '../types';

export class UserService {
  async getById(id: string) {
    return Database.from('users').where('id', id).first();
  }

  async getByEmail(email: string) {
    return Database.from('users').where('email', email).first();
  }

  async create(data: Partial<User>) {
    const [user] = await Database('users')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return user;
  }
}
```

**Commit:**
```bash
git add app/services/UserService.ts
git commit -m "feat: create UserService"
```

**Update TODOLIST.md:**
```markdown
## Phase 2: Backend Services
- [x] Create ProjectService (commit: mno345)
- [x] Create TaskService (commit: pqr678)
- [x] Create UserService (commit: stu901)

## Progress
**Completed**: 7 / 16
**Current Phase**: Phase 3
```

---

## Phase 5: Controllers

### Step 14: Create ProjectController

**Prompt to AI:**
```
Create ProjectController in app/controllers/ProjectController.ts with routes:
- GET /projects - Index all projects
- GET /projects/:id - Show single project
- POST /projects - Create new project
- PUT /projects/:id - Update project
- DELETE /projects/:id - Delete project

Use Inertia for page routes, JSON for API. Follow Laju controller patterns.
After creating, commit and update TODOLIST.md.
```

**AI creates:** `app/controllers/ProjectController.ts`

```typescript
import ProjectService from '../services/ProjectService';
import { Request, Response } from 'hyper-express';

export default class ProjectController {
  private projectService = new ProjectService();

  async index({ request, inertia }: { request: Request; inertia: any }) {
    const userId = request.user?.id;
    const projects = await this.projectService.getAll(userId);
    
    return inertia.render('Projects/Index', { projects });
  }

  async show({ request, inertia, params }: { request: Request; inertia: any; params: any }) {
    const project = await this.projectService.getById(params.id);
    
    return inertia.render('Projects/Show', { project });
  }

  async store({ request, response }: { request: Request; response: Response }) {
    const data = await request.json();
    const userId = request.user?.id;
    
    const project = await this.projectService.create({
      ...data,
      user_id: userId,
    });
    
    return response.json(project);
  }

  async update({ request, response, params }: { request: Request; response: Response; params: any }) {
    const data = await request.json();
    const project = await this.projectService.update(params.id, data);
    
    return response.json(project);
  }

  async destroy({ response, params }: { response: Response; params: any }) {
    await this.projectService.delete(params.id);
    
    return response.status(204).send();
  }
}
```

**Commit:**
```bash
git add app/controllers/ProjectController.ts
git commit -m "feat: create ProjectController"
```

**Update TODOLIST.md:**
```markdown
## Phase 3: Controllers
- [x] Create ProjectController (commit: vwx234)
- [ ] Create TaskController
- [ ] Create DashboardController
```

### Step 15: Create TaskController

**Prompt to AI:**
```
Create TaskController in app/controllers/TaskController.ts with routes:
- GET /projects/:projectId/tasks - Index tasks for project
- POST /projects/:projectId/tasks - Create task
- PUT /tasks/:id - Update task
- PUT /tasks/:id/status - Update task status
- DELETE /tasks/:id - Delete task

After creating, commit and update TODOLIST.md.
```

**AI creates:** `app/controllers/TaskController.ts`

```typescript
import TaskService from '../services/TaskService';
import { Request, Response } from 'hyper-express';

export default class TaskController {
  private taskService = new TaskService();

  async index({ params, response }: { params: any; response: Response }) {
    const tasks = await this.taskService.getAll(params.projectId);
    
    return response.json(tasks);
  }

  async store({ request, response, params }: { request: Request; response: Response; params: any }) {
    const data = await request.json();
    
    const task = await this.taskService.create({
      ...data,
      project_id: params.projectId,
    });
    
    return response.json(task);
  }

  async update({ request, response, params }: { request: Request; response: Response; params: any }) {
    const data = await request.json();
    const task = await this.taskService.update(params.id, data);
    
    return response.json(task);
  }

  async updateStatus({ request, response, params }: { request: Request; response: Response; params: any }) {
    const { status } = await request.json();
    const task = await this.taskService.updateStatus(params.id, status);
    
    return response.json(task);
  }

  async destroy({ response, params }: { response: Response; params: any }) {
    await this.taskService.delete(params.id);
    
    return response.status(204).send();
  }
}
```

**Commit:**
```bash
git add app/controllers/TaskController.ts
git commit -m "feat: create TaskController"
```

**Update TODOLIST.md:**
```markdown
- [x] Create TaskController (commit: yza567)
```

### Step 16: Create DashboardController

**Prompt to AI:**
```
Create DashboardController in app/controllers/DashboardController.ts with:
- GET / - Show dashboard with all tasks across projects

After creating, commit and update TODOLIST.md.
```

**AI creates:** `app/controllers/DashboardController.ts`

```typescript
import Database from '@ioc:Adonis/Lucid/Database';
import { Request } from 'hyper-express';

export default class DashboardController {
  async index({ request, inertia }: { request: Request; inertia: any }) {
    const userId = request.user?.id;
    
    const tasks = await Database('tasks')
      .join('projects', 'tasks.project_id', 'projects.id')
      .where('projects.user_id', userId)
      .select('tasks.*', 'projects.name as project_name')
      .orderBy('tasks.created_at', 'desc');
    
    const stats = {
      total: tasks.length,
      todo: tasks.filter((t: any) => t.status === 'todo').length,
      inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
      done: tasks.filter((t: any) => t.status === 'done').length,
    };
    
    return inertia.render('Dashboard/Index', { tasks, stats });
  }
}
```

**Commit:**
```bash
git add app/controllers/DashboardController.ts
git commit -m "feat: create DashboardController"
```

**Update TODOLIST.md:**
```markdown
## Phase 3: Controllers
- [x] Create ProjectController (commit: vwx234)
- [x] Create TaskController (commit: yza567)
- [x] Create DashboardController (commit: bcd890)

## Progress
**Completed**: 10 / 16
**Current Phase**: Phase 4
```

---

## Phase 6: Frontend Pages

### Step 17: Create Dashboard Page

**Prompt to AI:**
```
Create dashboard page in resources/js/Pages/Dashboard/Index.svelte with:
- Display task stats (total, todo, in-progress, done)
- List all tasks with project name
- Show task status badges (different colors)
- Mobile-responsive grid layout
- Use TailwindCSS with blue theme (#3B82F6)

After creating, commit and update TODOLIST.md.
```

**AI creates:** `resources/js/Pages/Dashboard/Index.svelte`

```svelte
<script lang="ts">
  import { page } from '$app/stores';

  export let tasks: any[];
  export let stats: any;

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div class="text-sm text-gray-600">Total Tasks</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-gray-900">{stats.todo}</div>
        <div class="text-sm text-gray-600">To Do</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        <div class="text-sm text-gray-600">In Progress</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-green-600">{stats.done}</div>
        <div class="text-sm text-gray-600">Done</div>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Recent Tasks</h2>
      </div>
      <div class="divide-y">
        {#each tasks as task}
          <div class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{task.title}</h3>
                <p class="text-sm text-gray-600">{task.project_name}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium {statusColors[task.status]}">
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
```

**Commit:**
```bash
git add resources/js/Pages/Dashboard/Index.svelte
git commit -m "feat: create dashboard page"
```

**Update TODOLIST.md:**
```markdown
## Phase 4: Frontend Pages
- [x] Create dashboard page (commit: efg123)
- [ ] Create projects index page
- [ ] Create projects show page
- [ ] Create tasks index page
```

### Step 18: Create Projects Index Page

**Prompt to AI:**
```
Create projects index page in resources/js/Pages/Projects/Index.svelte with:
- Grid of project cards
- Each card shows: name, description, task count
- "Create Project" button
- Mobile-responsive (1 column mobile, 2 tablet, 3 desktop)
- Use blue theme

After creating, commit and update TODOLIST.md.
```

**AI creates:** `resources/js/Pages/Projects/Index.svelte`

```svelte
<script lang="ts">
  export let projects: any[];

  function getTaskCount(project: any) {
    // This would be fetched from API
    return 0;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Create Project
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each projects as project}
        <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p class="text-sm text-gray-600 mb-4">{project.description || 'No description'}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">{getTaskCount(project)} tasks</span>
              <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View →
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
```

**Commit:**
```bash
git add resources/js/Pages/Projects/Index.svelte
git commit -m "feat: create projects index page"
```

**Update TODOLIST.md:**
```markdown
- [x] Create projects index page (commit: hij456)
```

### Step 19: Create Projects Show Page

**Prompt to AI:**
```
Create projects show page in resources/js/Pages/Projects/Show.svelte with:
- Project details (name, description, due date)
- Tasks list for this project
- Add task form
- Task status badges
- Mobile-responsive

After creating, commit and update TODOLIST.md.
```

**AI creates:** `resources/js/Pages/Projects/Show.svelte`

```svelte
<script lang="ts">
  export let project: any;
  export let tasks: any[] = [];

  let newTaskTitle = '';
  let newTaskDescription = '';

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  async function addTask() {
    // API call to create task
    newTaskTitle = '';
    newTaskDescription = '';
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Project Header -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900">{project.name}</h1>
        <p class="text-gray-600 mt-1">{project.description}</p>
        {#if project.due_date}
          <p class="text-sm text-gray-500 mt-2">Due: {project.due_date}</p>
        {/if}
      </div>
    </div>

    <!-- Add Task Form -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Add Task</h2>
        <form on:submit|preventDefault={addTask}>
          <div class="space-y-4">
            <input
              type="text"
              bind:value={newTaskTitle}
              placeholder="Task title"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              bind:value={newTaskDescription}
              placeholder="Task description"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Tasks</h2>
      </div>
      <div class="divide-y">
        {#each tasks as task}
          <div class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{task.title}</h3>
                {#if task.description}
                  <p class="text-sm text-gray-600">{task.description}</p>
                {/if}
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium {statusColors[task.status]}">
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
```

**Commit:**
```bash
git add resources/js/Pages/Projects/Show.svelte
git commit -m "feat: create projects show page"
```

**Update TODOLIST.md:**
```markdown
- [x] Create projects show page (commit: klm789)
```

### Step 20: Create Tasks Index Page

**Prompt to AI:**
```
Create tasks index page in resources/js/Pages/Tasks/Index.svelte with:
- Filter by status (all, todo, in-progress, done)
- Filter by priority (all, low, medium, high)
- Task list with filters applied
- Mobile-responsive filters

After creating, commit and update TODOLIST.md.
```

**AI creates:** `resources/js/Pages/Tasks/Index.svelte`

```svelte
<script lang="ts">
  export let tasks: any[] = [];

  let statusFilter = 'all';
  let priorityFilter = 'all';

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  $: filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">All Tasks</h1>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            bind:value={statusFilter}
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            bind:value={priorityFilter}
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="bg-white rounded-lg shadow">
      <div class="divide-y">
        {#each filteredTasks as task}
          <div class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{task.title}</h3>
                <p class="text-sm text-gray-600">{task.project_name}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-medium {statusColors[task.status]}">
                  {task.status.replace('_', ' ')}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
```

**Commit:**
```bash
git add resources/js/Pages/Tasks/Index.svelte
git commit -m "feat: create tasks index page"
```

**Update TODOLIST.md:**
```markdown
## Phase 4: Frontend Pages
- [x] Create dashboard page (commit: efg123)
- [x] Create projects index page (commit: hij456)
- [x] Create projects show page (commit: klm789)
- [x] Create tasks index page (commit: nop012)

## Progress
**Completed**: 14 / 16
**Current Phase**: Phase 5
```

---

## Phase 7: Testing & Polish

### Step 21: Test CRUD Operations

**Test Projects:**
```bash
# Navigate to http://localhost:3000/projects
# Try creating a project
# Try viewing a project
# Try editing a project
# Try deleting a project
```

**Test Tasks:**
```bash
# Navigate to a project page
# Try adding a task
# Try updating task status
# Try deleting a task
```

**Prompt to AI if issues found:**
```
There's an error when creating a task: [error message]. Fix it.
```

### Step 22: Test Responsive Design

**Test on different screen sizes:**
- Mobile (375px)
- Tablet (768px)
- Desktop (1024px+)

**Prompt to AI if issues found:**
```
The projects grid doesn't look good on mobile. Fix the responsive layout.
```

### Step 23: Fix Bugs and Refine UI

**Common issues to address:**
- Loading states
- Error handling
- Form validation
- Empty states
- Accessibility

**Example prompt:**
```
Add loading states to all pages and proper error handling for API calls.
```

**Commit fixes:**
```bash
git add .
git commit -m "fix: add loading states and error handling"
```

**Update TODOLIST.md:**
```markdown
## Phase 5: Testing & Polish
- [x] Test all CRUD operations
- [x] Test responsive design
- [x] Fix bugs and refine UI

## Progress
**Completed**: 16 / 16
**Current Phase**: Complete ✓
```

---

## Phase 8: Deployment

### Step 24: Final Testing

```bash
# Run tests
npm run test

# Typecheck
npm run typecheck

# Build
npm run build
```

### Step 25: Deploy to Production

```bash
# Deploy using your preferred method
npm run deploy
```

### Step 26: Celebrate! 🎉

Your TaskFlow app is live!

---

## Summary

**Total Commits:** ~16
**Total Time:** ~4-6 hours (with AI assistance)
**Lines of Code:** ~1000+ (written by AI)

**Key Files Created:**
- 3 migrations
- 3 services
- 3 controllers
- 4 Svelte pages
- 1 AGENTS.md (root)
- 7 AGENTS.md (directories)

**Workflow Recap:**
1. Initialize project
2. Create AGENTS.md files
3. Define requirements (README.md)
4. Generate TODOLIST.md
5. Work through TODOLIST iteratively
6. Commit after each task
7. Update TODOLIST.md
8. Test and refine
9. Deploy

**Tips for Success:**
- Keep tasks small and focused
- Commit frequently
- Update TODOLIST.md religiously
- Test as you go
- Ask AI for explanations when unsure
- Review code before approving

This workflow allows you to build complete applications by describing what you want, letting AI handle implementation details, while maintaining control and understanding of the codebase.