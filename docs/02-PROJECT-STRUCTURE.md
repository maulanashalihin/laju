# Project Structure

Complete overview of the Laju framework directory structure and file organization.

## Directory Tree

```
laju/
├── app/                          # Backend application code
│   ├── controllers/              # Request handlers
│   ├── middlewares/              # Custom middleware
│   ├── services/                 # Business logic layer
│   └── validators/               # Input validation schemas
├── resources/                    # Frontend resources
│   ├── js/                       # JavaScript/Svelte code
│   └── views/                    # HTML templates
├── routes/                       # Route definitions
├── migrations/                   # Database migrations
├── commands/                     # CLI commands
├── tests/                        # Test suite
├── public/                       # Static assets
├── storage/                      # Local file storage (when STORAGE_DRIVER=local)
├── dist/                         # Compiled frontend (Vite)
├── build/                        # Production build
├── data/                         # SQLite databases
└── type/                         # TypeScript definitions
```

## Backend Structure (`app/`)

### Validators (`app/validators/`)

Zod validation schemas for input validation.

```
app/validators/
├── AuthValidator.ts        # Authentication validation
│   ├── loginSchema         # Login form validation
│   ├── registerSchema      # Registration validation
│   └── passwordSchema      # Password validation
│
├── ProfileValidator.ts     # Profile validation
│   └── updateProfileSchema # Profile update validation
│
├── CommonValidator.ts      # Common validation rules
│   ├── emailSchema         # Email validation
│   ├── passwordSchema      # Password rules
│   └── phoneSchema         # Phone number validation
│
└── S3Validator.ts          # S3 upload validation
    └── uploadSchema        # File upload validation
```

### Controllers (`app/controllers/`)

Request handlers that coordinate between routes and services. Controllers are split by domain for better maintainability.

```
app/controllers/
├── LoginController.ts      # Login/logout logic
│   ├── loginPage()         # Display login form
│   ├── processLogin()      # Handle login submission
│   └── logout()            # End user session
│
├── RegisterController.ts   # Registration logic
│   ├── registerPage()      # Display registration form
│   └── processRegister()   # Handle registration
│
├── PasswordController.ts   # Password management
│   ├── forgotPasswordPage() # Password reset form
│   ├── sendResetPassword() # Send reset email
│   ├── resetPasswordPage() # Reset password form
│   ├── resetPassword()     # Process password reset
│   └── changePassword()    # Change password
│
├── ProfileController.ts    # User profile logic
│   ├── homePage()          # User dashboard
│   ├── profilePage()       # User profile
│   ├── changeProfile()     # Update profile
│   └── deleteUsers()       # Admin: bulk delete users
│
├── OAuthController.ts      # OAuth providers
│   ├── redirect()          # Google OAuth redirect
│   └── googleCallback()    # Google OAuth callback
│
├── VerificationController.ts # Email verification
│   ├── verify()            # Send verification email
│   └── verifyPage()        # Process verification
│
├── HomeController.ts       # Home page logic
│   └── index()             # Landing page
│
├── AssetController.ts      # Static file serving
│   ├── distFolder()        # Serve compiled assets
│   └── publicFolder()      # Serve public files
│
├── S3Controller.ts         # S3 operations
│   ├── getSignedUrl()      # Generate presigned URL
│   ├── getPublicUrl()      # Get public file URL
│   └── health()            # S3 health check
│
└── StorageController.ts    # Local storage operations
    └── serveFile()         # Serve local storage files
```

### Middleware (`app/middlewares/`)

Request processing pipeline components.

```
app/middlewares/
├── auth.ts                 # Authentication middleware
│   └── Validates session cookie
│   └── Loads user data
│   └── Redirects if not authenticated
│
├── csrf.ts                 # CSRF protection middleware
│   └── Token generation and validation
│   └── Protects POST/PUT/DELETE requests
│
├── inertia.ts              # Inertia.js integration
│   └── response.inertia()  # Render Inertia pages
│   └── Handles X-Inertia header
│   └── Manages error flash messages
│
└── rateLimit.ts            # Rate limiting
    ├── authRateLimit       # Login/auth endpoints (5 req/15min)
    ├── apiRateLimit        # General API (100 req/15min)
    ├── generalRateLimit    # General routes (1000 req/15min)
    ├── passwordResetRateLimit # Password reset (3 req/hour)
    ├── emailRateLimit      # Email sending (10 req/hour)
    ├── uploadRateLimit     # File uploads (50 req/hour)
    ├── createAccountRateLimit # Registration (3 req/hour)
    ├── userRateLimit()     # Rate limit by user ID
    └── customRateLimit()   # Custom rate limiter
```

### Services (`app/services/`)

Business logic and external integrations.

```
app/services/
├── DB.ts                   # Knex.js database service
│   └── Query builder with WAL optimizations
│
├── SQLite.ts               # Native better-sqlite3 service
│   └── Direct SQL for maximum performance
│
├── Authenticate.ts         # Authentication service
│   ├── hash()              # Hash password with PBKDF2
│   ├── compare()           # Verify password
│   ├── process()           # Create session
│   └── logout()            # Destroy session
│
├── GoogleAuth.ts           # Google OAuth service
│   ├── getAuthUrl()        # Generate OAuth URL
│   └── getTokens()         # Exchange code for tokens
│
├── S3.ts                   # S3/Wasabi storage
│   ├── uploadBuffer()      # Upload file
│   ├── getSignedUploadUrl() # Generate presigned URL
│   ├── getPublicUrl()      # Get public URL
│   ├── getObject()         # Download file
│   └── deleteObject()      # Delete file
│
├── LocalStorage.ts         # Local filesystem storage
│   ├── uploadBuffer()      # Upload file to disk
│   ├── getPublicUrl()      # Get public URL
│   ├── getObject()         # Download file
│   ├── deleteObject()      # Delete file
│   └── exists()            # Check if file exists
│
├── Mailer.ts               # SMTP email (Nodemailer)
│   └── send()              # Send email via SMTP
│
├── Resend.ts               # Resend email API
│   └── send()              # Send email via Resend
│
├── View.ts                 # Template rendering
│   └── view()              # Render Eta template
│
├── Logger.ts               # Logging service
│   ├── logInfo()           # Info logs
│   ├── logError()          # Error logs
│   ├── logWarn()           # Warning logs
│   └── logDebug()          # Debug logs
│
├── RateLimiter.ts          # Rate limiting logic
│   ├── check()             # Check rate limit
│   └── Memory-based rate limiter
│
├── Redis.ts                # Redis caching (optional)
│   ├── get()               # Get cached value
│   ├── set()               # Set cache value
│   └── del()               # Delete cache key
│
├── CacheService.ts         # Database caching layer
│   ├── get()               # Get from cache
│   ├── set()               # Set cache value
│   └── invalidate()        # Clear cache
│
├── CSRF.ts                 # CSRF token management
│   ├── generateToken()     # Generate CSRF token
│   └── validateToken()     # Validate CSRF token
│
├── Translation.ts          # i18n translation service
│   ├── t()                 # Translate key
│   ├── setLocale()         # Set language
│   └── getLocale()         # Get current language
│
├── Validator.ts            # Validation service
│   └── Zod schema validation helpers
│
└── languages/              # Translation files
    ├── en.json             # English
    ├── id.json             # Indonesian
    ├── ar.json             # Arabic
    ├── de.json             # German
    ├── fr.json             # French
    ├── fa.json             # Persian
    ├── ps.json             # Pashto
    ├── sw.json             # Swahili
    ├── tr.json             # Turkish
    └── ur.json             # Urdu
```

## Frontend Structure (`resources/`)

### JavaScript/Svelte (`resources/js/`)

```
resources/js/
├── Pages/                  # Inertia pages
│   ├── auth/               # Authentication pages
│   │   ├── login.svelte    # Login page
│   │   ├── register.svelte # Registration page
│   │   ├── forgot-password.svelte
│   │   └── reset-password.svelte
│   ├── home.svelte         # User dashboard
│   └── profile.svelte      # User profile
│
├── Components/             # Reusable components
│   ├── Header.svelte       # Navigation header
│   ├── DarkModeToggle.svelte # Dark mode switch
│   ├── LajuIcon.svelte     # Logo component
│   └── helper.js           # Utility functions
│
├── app.js                  # Inertia entry point
└── index.css               # Global styles (TailwindCSS 4)
```

### Views (`resources/views/`)

Eta HTML templates for server-side rendering.

```
resources/views/
├── index.html              # Landing page template
├── inertia.html            # Inertia layout template
└── partials/               # Reusable template parts
    └── header.html         # Header partial
```

## Routes (`routes/`)

```
routes/
└── web.ts                  # All HTTP routes
    ├── Public routes       # No authentication
    ├── Auth routes         # Login, register, OAuth
    ├── Protected routes    # Require authentication
    ├── API routes          # RESTful endpoints
    └── Asset routes        # Static file serving
```

## Database (`migrations/`)

```
migrations/
├── 20230513055909_users.ts                    # Users table
├── 20230514062913_sessions.ts                 # Sessions table
├── 20240101000001_create_password_reset_tokens.ts
└── 20240101000002_create_email_verification_tokens.ts
```

## CLI Commands (`commands/`)

```
commands/
├── native/                 # Built-in commands
│   ├── MakeController.ts   # Generate controller
│   └── MakeCommand.ts      # Generate command
└── index.ts                # Command registry
```

## Tests (`tests/`)

```
tests/
├── unit/                   # Unit tests
│   ├── controllers/        # Controller tests
│   └── services/           # Service tests
├── integration/            # Integration tests
│   └── auth.test.ts        # Auth flow tests
└── fixtures/               # Test data
```

## Static Assets (`public/`)

```
public/
├── favicon.ico             # Site favicon
├── favicon-laju.png        # Laju favicon
├── laju-icon.png           # Laju logo
└── laju-emerald.png        # Laju emerald logo
```

## Build Output

### Development (`dist/`)

Vite build output during development:

```
dist/
├── assets/                 # Bundled JS/CSS
│   ├── app-[hash].js       # Main app bundle
│   ├── index-[hash].css    # Compiled styles
│   └── ...                 # Other chunks
└── views/                  # Compiled templates
    ├── index.html
    └── inertia.html
```

### Production (`build/`)

Complete production build:

```
build/
├── app/                    # Compiled backend
│   ├── controllers/        # Compiled controllers
│   ├── middlewares/        # Compiled middleware
│   └── services/           # Compiled services
├── dist/                   # Frontend assets
│   ├── assets/             # Bundled JS/CSS
│   └── views/              # Templates
├── migrations/             # Compiled migrations
├── commands/               # Compiled commands
├── public/                 # Static files
├── server.js               # Entry point
├── package.json            # Production deps
└── node_modules/           # Dependencies
```

## Database Files (`data/`)

```
data/
├── dev.sqlite3             # Development database
├── production.sqlite3      # Production database
└── test.sqlite3            # Test database
```

## Configuration Files

```
laju/
├── server.ts               # Server entry point
├── knexfile.ts             # Database configuration
├── vite.config.mjs         # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── svelte.config.mjs       # Svelte configuration
├── vitest.config.ts        # Vitest test configuration
├── package.json            # Dependencies & scripts
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## File Naming Conventions

### Backend (TypeScript)

- **Controllers:** `PascalCase` + `Controller.ts` (e.g., `AuthController.ts`)
- **Services:** `PascalCase.ts` (e.g., `Authenticate.ts`, `DB.ts`)
- **Middleware:** `camelCase.ts` (e.g., `auth.ts`, `inertia.ts`)
- **Migrations:** `timestamp_description.ts` (e.g., `20230513055909_users.ts`)

### Frontend (Svelte)

- **Pages:** `kebab-case.svelte` (e.g., `forgot-password.svelte`)
- **Components:** `PascalCase.svelte` (e.g., `Header.svelte`)
- **Utilities:** `camelCase.js` (e.g., `helper.js`)

### Templates (Eta)

- **Views:** `kebab-case.html` (e.g., `forgot-password.html`)
- **Partials:** `kebab-case.html` in `partials/` folder

## Import Paths

Laju supports absolute imports from project root:

```typescript
// ✅ Absolute imports (recommended)
import DB from "app/services/DB";
import AuthController from "app/controllers/AuthController";
import { Request, Response } from "type";

// ❌ Relative imports (avoid)
import DB from "../../app/services/DB";
```

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "app/*": ["app/*"],
      "routes/*": ["routes/*"],
      "resources/*": ["resources/*"],
      "type/*": ["type/*"]
    }
  }
}
```

## Next Steps

- [Database Guide](03-DATABASE.md) - Learn database operations
- [Routing & Controllers](04-ROUTING-CONTROLLERS.md) - Handle HTTP requests
- [Frontend (Svelte 5)](05-FRONTEND-SVELTE.md) - Build reactive UI
- [Authentication](06-AUTHENTICATION.md) - User authentication
- [Middleware Guide](07-MIDDLEWARE.md) - Custom middleware patterns
