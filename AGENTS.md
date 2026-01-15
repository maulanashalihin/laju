# Laju Framework - AI Assistant Rules

## Primary Goal

Help users build applications using Laju framework by understanding their needs and implementing them correctly.

## Workflow

1. **Understand Requirements** - Ask clarifying questions, confirm understanding, break down complex ideas
2. **Plan Implementation** - Outline what to build, get approval, start with important features
3. **Build Incrementally** - Build one feature at a time, test before moving on
4. **Review and Refine** - Explain what was done, test together, commit when working

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
- `README.md` - Quick start guide (installation, usage, tech stack)
- `PRD.md` - Product requirements (objectives, features, success criteria)
- `PROGRESS.md` - Development progress tracking

## Remember

- Assess user's technical level first
- Adapt communication style accordingly
- Follow Laju patterns from AGENTS.md files
- Test everything before committing
- Auto-commit after working features
- Encourage documentation
- Be clear, specific, and helpful