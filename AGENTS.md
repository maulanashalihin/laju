# Laju Framework - AI Assistant Rules

## Primary Goal

Help users build applications using Laju framework by understanding their needs and implementing them correctly.

## Workflow

### 1. Understand Requirements
Gather information about what the user wants:
- Ask clarifying questions
- Confirm understanding
- Break down complex ideas
- Suggest simpler alternatives if appropriate

### 1.5. Initialize Project README
When user starts a new project, help them replace the default Laju README:

```
AI: "Let's update README.md with your project details.
I'll replace the default Laju content with information about your app.

What should we call this project?
What does it do?
Who will use it?"
```

Create a project-specific README:
```markdown
# [Your Project Name]

## Quick Start
```bash
npm install
npm run dev
```

Visit http://localhost:5555

## Overview
[Brief description - 1-2 sentences what this app does]

## Installation
[Installation steps if needed beyond npm install]

## Usage
[Basic usage instructions]

## Tech Stack
- Laju Framework
- [Database]
- [Frontend]

## Documentation
- See PRD.md for detailed requirements
- See PROGRESS.md for development progress
```
 
### 1.6. Initialize Git Repository
After replacing README, initialize git:

```
AI: "Now let's set up git so we can save your progress.
I'll initialize the repository and make the first commit."
```

Auto-run git initialization:
```bash
git init
git add .
git commit -m "Initial commit: [project name]"
```

Explain what was done:
```
AI: "I've set up git for your project.
This means every time we complete a feature,
I'll automatically save your progress.
You don't need to worry about git commands."
```

### 1.7. Create PRD.md and PROGRESS.md
After initializing git, create project documentation:

```
AI: "Now let's create documentation files to track our project.
I'll create PRD.md for the complete project overview
and PROGRESS.md to track our progress."
```

Create PRD.md:
```markdown
# Product Requirements Document

## Project Overview
[Detailed description of the project - what problem it solves, why it exists]

## Objectives
- Objective 1 - [What we want to achieve]
- Objective 2 - [What we want to achieve]
- Objective 3 - [What we want to achieve]

## Target Users
[Detailed user personas - who will use this application and their needs]

## Key Features
1. Feature 1 - [Detailed description, user stories, acceptance criteria]
2. Feature 2 - [Detailed description, user stories, acceptance criteria]
3. Feature 3 - [Detailed description, user stories, acceptance criteria]

## Technical Stack
- Framework: Laju
- Database: [PostgreSQL/MySQL/etc] - [Reasoning for choice]
- Frontend: [Inertia/React/etc] - [Reasoning for choice]

## Success Criteria
- [ ] Success criteria 1 - [Measurable outcome]
- [ ] Success criteria 2 - [Measurable outcome]
- [ ] Success criteria 3 - [Measurable outcome]
```

Create PROGRESS.md:
```markdown
# Project Progress

## Completed Features
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

## In Progress
- [ ] Current task

## Pending
- [ ] Future feature 1
- [ ] Future feature 2

## Notes
[Any important notes or decisions]
```

Explain what was done:
```
AI: "I've created:
- PRD.md - Complete project overview with features and objectives
- PROGRESS.md - Progress tracking with checkboxes

Every time we complete a task, I'll update PROGRESS.md
and commit the changes so you can track our progress."
```

### 2. Plan Implementation
- Outline what you'll build
- Get approval on the plan
- Explain approach appropriately
- Start with most important features

### 3. Build Incrementally
- Build one feature at a time
- Test before moving on
- Show what was built
- Get feedback

### 4. Review and Refine
- Explain what was done
- Test together
- Fix issues
- Commit when working

## Technical Implementation

### Use Existing Built-in Functionality
The Laju framework comes with pre-built controllers, services, and middlewares. **Always check if functionality exists before creating new ones.**

**Built-in Controllers:**
- `HomeController` - Home page
- `LoginController` - User authentication (login)
- `RegisterController` - User registration
- `PasswordController` - Password reset (forgot/reset/change)
- `ProfileController` - User profile management
- `OAuthController` - OAuth authentication (Google, etc.)
- `VerificationController` - Email verification
- `UploadController` - File uploads (local/S3)
- `StorageController` - Storage management
- `S3Controller` - AWS S3 operations
- `AssetController` - Asset serving

**Built-in Services:**
- `Authenticate` - Password hashing, login/logout, session management
- `Validator` - Input validation with Zod schemas
- `DB` - Database operations (Knex)
- `CacheService` - Caching layer
- `Mailer` / `Resend` - Email sending
- `CSRF` - CSRF protection
- `RateLimiter` - Rate limiting
- `Logger` - Logging
- `Translation` - Multi-language support
- `View` - SSR template rendering
- `S3` - AWS S3 integration
- `Redis` - Redis client
- `LocalStorage` - Local file storage
- `GoogleAuth` - Google OAuth

**Built-in Middlewares:**
- `auth` - Authentication (checks user session)
- `csrf` - CSRF protection
- `inertia` - Inertia.js headers
- `rateLimit` - Rate limiting
- `securityHeaders` - Security headers

**Rule:** If functionality exists, **use or modify** existing code instead of creating redundant controllers/services/middlewares.

### Follow Laju Conventions
Always reference the appropriate AGENTS.md files:

**Backend:**
- `app/controllers/AGENTS.md` - Controller patterns (REST API, SSR vs Inertia, validation)
- `app/validators/AGENT.md` - Validation schemas (Zod, store/update patterns)
- `app/middlewares/AGENTS.md` - Middleware patterns
- `app/services/AGENTS.md` - Database operations
- `migrations/AGENTS.md` - Migration patterns

**Routing:**
- `routes/AGENTS.md` - Routing patterns (RESTful routes, rate limiting, middleware)

**Frontend:**
- `resources/js/Pages/AGENT.md` - Svelte 5 pages (Inertia, forms, transitions, frontend rules)
- `resources/js/Components/AGENT.md` - Reusable components (props, state, events)
- `resources/views/AGENTS.md` - SSR templates (Eta)

### Use Standard Patterns
- Controllers → Services → Database
- NO `this` in controllers
- NO `next()` in middlewares
- Use Knex for database operations
- Use Inertia for interactive pages
- Use Eta for SSR pages

### Project Structure

```
laju/
├── app/
│   ├── controllers/           # HTTP request handlers
│   │   ├── AGENTS.md         # Controller guide
│   │   ├── HomeController.ts
│   │   ├── LoginController.ts
│   │   └── ...
│   ├── middlewares/          # Request/response middleware
│   │   ├── AGENTS.md         # Middleware guide
│   │   ├── auth.ts
│   │   ├── csrf.ts
│   │   └── ...
│   ├── services/             # Business logic & utilities
│   │   ├── AGENTS.md         # Service guide
│   │   ├── DB.ts             # Database operations
│   │   ├── Validator.ts      # Input validation
│   │   └── ...
│   └── validators/           # Validation schemas
│       ├── AGENT.md          # Validator guide
│       ├── AuthValidator.ts
│       ├── ProfileValidator.ts
│       └── ...
├── routes/                   # Route definitions
│   ├── AGENTS.md             # Routing guide
│   └── web.ts                # Main routes file
├── migrations/               # Database migrations
│   ├── AGENTS.md             # Migration guide
│   └── *.ts                  # Migration files
├── resources/
│   ├── js/
│   │   ├── Pages/            # Svelte 5 Inertia pages
│   │   │   ├── AGENT.md       # Pages guide
│   │   │   ├── home.svelte
│   │   │   ├── profile.svelte
│   │   │   └── ...
│   │   └── Components/       # Reusable Svelte components
│   │       ├── AGENT.md       # Components guide
│   │       ├── Header.svelte
│   │       ├── DarkModeToggle.svelte
│   │       └── ...
│   └── views/                 # SSR templates (Eta)
│       ├── AGENTS.md         # Views guide
│       ├── index.html
│       └── ...
├── public/                   # Static assets
├── storage/                  # File storage
├── tests/                    # Test files
├── docs/                     # Documentation
├── package.json
├── server.ts                 # Application entry point
└── AGENTS.md                 # Main AI guide (this file)
```

### Security Best Practices
- Always validate input
- Use parameterized queries only
- Apply rate limiting to auth/API routes
- Check `request.user` in protected routes
- Use `Authenticate.hash()` / `Authenticate.compare()` for passwords

## Commit Guidance

### Auto-Commit After Working Features
After completing a feature, automatically commit:

```
AI: "The feature is working! Saving progress..."
[runs git commands]
"Saved! Your work is safe."
```

### When to Commit
Always commit when:
- Feature is complete and working
- Bug fix is verified
- User is happy with changes

Don't commit when:
- Code is broken
- User hasn't tested
- User wants more changes

### Explain What Was Committed
```
AI: "I've saved:
- Added [feature]
- Connected to [component]
- Made sure it works

Your progress is safe."
```

### Update PROGRESS.md and Commit
After completing each feature or task:

1. Update PROGRESS.md to mark the task as completed
2. Commit all changes with a descriptive message

```bash
git add .
git commit -m "Complete: [feature name]"
```

Example:
```
AI: "Feature is working! Let me update PROGRESS.md and save your progress..."
[updates PROGRESS.md]
[runs git commands]
"Saved! Your progress is tracked in PROGRESS.md."
```

## Documentation

### Help Create Documentation
Encourage documentation when:
- Adding new features
- Making significant changes
- User wants to remember how something works

**Files to create/update:**
- `README.md` - Quick start guide for users/developers (installation, usage, tech stack)
- `PRD.md` - Product requirements document (objectives, features with acceptance criteria, success criteria)
- `PROGRESS.md` - Development progress tracking (completed, in progress, pending tasks) 

### Purpose of Each File
- **README.md** - How to use/install the project (quick reference)
- **PRD.md** - What we're building and why (detailed requirements)
- **PROGRESS.md** - What we've done and what's next (task tracking)

## Testing

### Always Test
- Test every feature after building
- Encourage user to test in browser
- Fix issues immediately
- Verify fixes work

### Guide Testing
```
AI: "Let's test this:
1. Go to http://localhost:5555
2. Click [button]
3. [action]
4. Tell me what happens"
```

## Common Scenarios

### User Doesn't Know What They Want
```
AI: "No problem! Let's start simple.
What's the main thing you want this to do?
We can add more features later."
```

### User Changes Mind
```
AI: "That's fine! Let me update that for you..."
```

### User Wants Complex Feature
```
AI: "That's a great idea! Let's break it down:
1. First, [simple part]
2. Then, [next part]
3. Finally, [last part]

Does that work?"
```

### Something Doesn't Work
```
AI: "I see the issue - [explain simply]
Let me fix it... Done!
Try again now."
```

## When to Ask Questions

### Ask When:
- Request is vague
- Multiple implementation options
- User might not understand implications
- Something affects other features

### Don't Ask When:
- Standard pattern (just do it)
- User has been clear
- Minor detail
- Reasonable assumption can be made

## Remember

- Assess user's technical level first
- Adapt communication style accordingly
- Follow Laju patterns from AGENTS.md files
- Test everything before committing
- Auto-commit after working features
- Encourage documentation
- Be clear, specific, and helpful
- Celebrate progress together

Your job is to help all users - technical and non-technical - build great applications with Laju!