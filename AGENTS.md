# Laju Framework - AI Assistant Rules

## Tech Stack & Versions

- **Svelte**: v5.41.3 (with runes `$state`, `$props`)
- **Tailwind CSS**: v3.4.17
- **Inertia.js**: v2.2.10
- **Vite**: v5.4.10
- **TypeScript**: v5.6.3 (backend only)
- **HyperExpress**: v6.17.3 (backend server)
- **Knex**: v3.1.0 (database query builder)
- **Zod**: v4.3.5 (validation)

## Primary Goal

Help users build applications using Laju framework by understanding their needs and implementing them correctly.

## Workflow

1. **Understand Requirements** - Ask clarifying questions, confirm understanding, break down complex ideas
2. **Check Existing Functionality** - **ALWAYS check if controllers/pages/services already exist before creating new ones**
3. **Plan Implementation** - Outline what to build, prioritize modifying existing code, get approval
4. **Build Incrementally** - Build one feature at a time, test before moving on
5. **Review and Refine** - Explain what was done, test together, commit when working

**After Completing a Feature:**
When a feature is complete (routes, controllers, pages all implemented):
- Ask user to test the feature
- Provide clickable link for testing (e.g., `http://localhost:5555/posts`)
- Wait for user confirmation before proceeding
- Update PROGRESS.md and commit after user confirms it works

## Project Initialization

When user starts a new project, **ALWAYS** follow this sequence:

1. **Initialize project** - Create new Laju project

2. **Create/replace README.md** with project-specific content:
   - Ask user for project name, description, features
   - Create custom README.md with:
     - Project name and description
     - Quick start guide (installation, usage)
     - Tech stack
     - Features list

3. **Create PRD.md** for product requirements:
   - Objectives and goals
   - Features list
   - Success criteria
   - **Design specifications** (branding colors, typography, design system, visual identity)

4. **Create PROGRESS.md** for tracking development:
   ```markdown
   # Development Progress

   ## Completed
   - [x] Initial setup
   - [x] README.md created
   - [x] PRD.md created

   ## In Progress
   - [ ] Feature 1

   ## Pending
   - [ ] Feature 2
   ```

5. **Review documentation** - Ask user to review and approve:
   - README.md - Project overview, features, tech stack
   - PRD.md - Requirements, design specifications
   - PROGRESS.md - Development tracking template
   - Wait for user confirmation before proceeding

6. **Setup design system**:
   - Configure theme in `tailwind.config.js` (branding colors, typography, design tokens from PRD.md)
   - Import Tailwind directives in `resources/js/index.css`

7. **Create migrations** for database schema

8. **Run migrations**:
   ```bash
   knex migrate:latest
   ```

9. **Git init and first commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project setup"
   ```

## Core Principle: Maximize Existing Functionality

**ALWAYS check and use existing controllers, pages, and services before creating new ones.** This is the most important rule in Laju framework development.

**Why?**
- Avoids redundant code
- Maintains consistency
- Reduces maintenance burden
- Leverages tested, built-in functionality

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
- `DB` - Database operations (Knex) - **Use directly for any table operations**
- `CacheService` - Caching layer
- `Mailer` / `Resend` - Email sending
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
- `inertia` - Inertia.js headers
- `rateLimit` - Rate limiting
- `securityHeaders` - Security headers

**Built-in Auth Pages:**
- `resources/js/Pages/auth/login.svelte` - Login page
- `resources/js/Pages/auth/register.svelte` - Registration page
- `resources/js/Pages/auth/forgot-password.svelte` - Forgot password
- `resources/js/Pages/auth/reset-password.svelte` - Reset password

**Rule:** If functionality exists, **use or modify** existing code instead of creating redundant controllers/services/middlewares/pages.

**Examples:**
- Need registration? → Modify `RegisterController.ts`, don't create new
- Need login? → Modify `LoginController.ts`, don't create new
- Need profile? → Modify `ProfileController.ts`, don't create new
- Need password reset? → Modify `PasswordController.ts`, don't create new
- Need database operations? → Use `DB.from("table")` directly, don't create service
- Need create/edit form? → Use single `form.svelte` page for both (pass `post` prop for edit)

## Project Structure

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

## Technical Implementation

### Use Standard Patterns
- Controllers → Services → Database
- NO `this` in controllers
- NO `next()` in middlewares
- Use Knex for database operations
- Use Inertia for interactive pages
- Use Eta for SSR pages

### Follow Laju Conventions
Always reference the appropriate AGENTS.md files for detailed patterns:

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

### Security Best Practices
- Always validate input
- Use parameterized queries only
- Apply rate limiting to auth/API routes
- Check `request.user` in protected routes 

## Commit Guidance

Auto-commit after completing working features. Always commit when:
- Feature is complete and working
- Bug fix is verified
- User is happy with changes

Don't commit when:
- Code is broken
- User hasn't tested
- User wants more changes

Update PROGRESS.md and commit after each feature completion.

## Documentation

Encourage documentation when adding new features or making significant changes.

**Files to create/update:**
- `README.md` - Quick start guide (installation, usage, tech stack, features list)
- `PRD.md` - Product requirements (objectives, features, success criteria, **design specifications including branding colors/typography**)
- `PROGRESS.md` - Development progress tracking
 

## Remember

- **Maximize existing functionality first** - Always check if controllers/pages/services exist before creating new ones
- Assess user's technical level first
- Adapt communication style accordingly
- Follow Laju patterns from AGENTS.md files
- Test everything before committing
- Auto-commit after working features
- Encourage documentation
- Be clear, specific, and helpful