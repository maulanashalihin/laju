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
- NO `this` in controllers
- NO `next()` in middlewares
- Use Knex for database operations
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
 

## Remember

- **Maximize existing functionality first** - Always check if controllers/pages/services exist before creating new ones
- Assess user's technical level first
- Adapt communication style accordingly
- Follow Laju patterns from AGENTS.md files
- Test everything before committing
- Auto-commit after working features
- Encourage documentation
- Be clear, specific, and helpful