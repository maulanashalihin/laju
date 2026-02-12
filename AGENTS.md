# Laju Framework - AI Assistant Rules

## Tech Stack & Versions

- **Svelte**: v5.41.3 (with runes `$state`, `$props`)
- **Tailwind CSS**: v3.4.17
- **Inertia.js**: v2.2.10
- **Vite**: v5.4.10
- **TypeScript**: v5.6.3 (backend only)
- **HyperExpress**: v6.17.3 (backend server)
- **Kysely**: v0.28.10 (type-safe SQL query builder)
- **Zod**: v4.3.5 (validation)
- **Lucide Icons**: Default icon library for laju.dev

## Primary Goal

Help users build applications using Laju framework by understanding their needs and implementing them correctly.

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
- `DB` - Database operations (Kysely) - **Use directly for any table operations**
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
- Need database operations? → Use `DB.selectFrom("table")` directly, don't create service
- Need create/edit form? → Use single `form.svelte` page for both (pass `post` prop for edit)

**Controller Pattern:**
```typescript
// ✅ Correct - Plain object pattern
export const PostController = {
  async index(request: Request, response: Response) {
    const posts = await DB.selectFrom("posts").selectAll().execute();
    return response.inertia("posts/index", { posts });
  }
};

export default PostController;
```

## Project Structure

```
laju/
├── app/
│   ├── controllers/           # HTTP request handlers 
│   │   ├── HomeController.ts
│   │   ├── LoginController.ts
│   │   └── ...
│   ├── middlewares/          # Request/response middleware 
│   │   ├── auth.ts
│   │   ├── csrf.ts
│   │   └── ...
│   ├── services/             # Business logic & utilities 
│   │   ├── DB.ts             # Database operations
│   │   ├── Validator.ts      # Input validation
│   │   └── ...
│   └── validators/           # Validation schemas 
│       ├── AuthValidator.ts
│       ├── ProfileValidator.ts
│       └── ...
├── routes/                   # Route definitions 
│   └── web.ts                # Main routes file
├── migrations/               # Database migrations 
│   └── *.ts                  # Migration files
├── resources/
│   ├── js/
│   │   ├── Pages/            # Svelte 5 Inertia pages 
│   │   │   ├── home.svelte
│   │   │   ├── profile.svelte
│   │   │   └── ...
│   │   └── Components/       # Reusable Svelte components 
│   │       ├── Header.svelte
│   │       ├── DarkModeToggle.svelte
│   │       └── ...
│   └── views/                 # SSR templates (Eta) 
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
- Controllers are **plain objects**, not classes
- NO `next()` in middlewares
- Use Kysely for database operations
- Use Inertia for interactive pages
- Use Eta for SSR pages

### Follow Laju Conventions
Always reference the appropriate workflow files for detailed patterns:
- `workflow/INIT_AGENT.md` - Project initialization workflow
- `workflow/TASK_AGENT.md` - Feature implementation workflow
  
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

Update workflow/PROGRESS.md and commit after each feature completion.

## Documentation

Encourage documentation when adding new features or making significant changes.

**Files to create/update:**
- `README.md` - Quick start guide (installation, usage, tech stack, features list)
- `workflow/PRD.md` - Product requirements (objectives, features, success criteria, **design specifications including branding colors/typography**)
- `workflow/PROGRESS.md` - Development progress tracking
 

## Agent Ecosystem

Laju framework uses a multi-agent workflow for different responsibilities:

### Agent Roles

| Agent | Responsibility | When to Use |
|-------|---------------|-------------|
| **INIT_AGENT** | Project initialization | Starting a new project |
| **TASK_AGENT** | Feature implementation (concurrent) | Building pages, controllers, routes per-fitur |
| **ONE_SHOT_AGENT** | Feature implementation (sequential) | Building all features in 1 session |
| **TEST_AGENT** | Testing & coverage | After feature implementation |
| **MANAGER_AGENT** | Documentation & coordination | Change requests, deployment approval |

**Choose TASK_AGENT vs ONE_SHOT_AGENT:**
- **TASK_AGENT** - For larger projects (20+ features), need review per feature, can work concurrent in multiple tabs
- **ONE_SHOT_AGENT** - For smaller projects (< 20 features), auto-execute all features in 1 session without stopping

### Agent Workflow

```
Project Start
    ↓
INIT_AGENT → Setup project structure
    ↓
MANAGER_AGENT → Create PRD, TDD
    ↓
TASK_AGENT / ONE_SHOT_AGENT ← → TEST_AGENT
    ↓
MANAGER_AGENT → Approve deployment
```

### Handoff Protocol

1. **INIT_AGENT → MANAGER_AGENT**
   - After project setup complete
   - Handoff: PRD.md, TDD.md, PROGRESS.md ready

2. **MANAGER_AGENT → TASK_AGENT / ONE_SHOT_AGENT**
   - After requirements documented
   - Handoff: PROGRESS.md with features to implement
   - User chooses: TASK_AGENT (per-fitur) or ONE_SHOT_AGENT (all at once)

3. **TASK_AGENT → TEST_AGENT**
   - After feature implementation complete
   - Handoff: PROGRESS.md updated with [x] implementation

4. **TEST_AGENT → MANAGER_AGENT**
   - After tests complete and passing
   - Handoff: PROGRESS.md with coverage report

### Workflow Files Reference

- `workflow/INIT_AGENT.md` - Project initialization workflow
- `workflow/TASK_AGENT.md` - Feature implementation workflow (concurrent)
- `workflow/ONE_SHOT_AGENT.md` - Feature implementation workflow (sequential)
- `workflow/TEST_AGENT.md` - Testing workflow
- `workflow/MANAGER_AGENT.md` - Change management & deployment

## Remember

- **Maximize existing functionality first** - Always check if controllers/pages/services exist before creating new ones
- Assess user's technical level first
- Adapt communication style accordingly
- Follow Laju patterns from AGENTS.md files
- Test everything before committing
- Auto-commit after working features
- Encourage documentation
- Be clear, specific, and helpful