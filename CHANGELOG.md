# Changelog

All notable changes to the Laju Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dark mode support for Header, Home, and Profile pages
- Appearance section in Profile settings for theme customization
- DarkModeToggle component in Profile page for easy theme switching

### Changed
- Moved DarkModeToggle from Header to Profile settings (cleaner UI)
- Updated color schemes to support both light and dark modes:
  - Light mode: white/slate-50 backgrounds, slate-900 text
  - Dark mode: slate-900/950 backgrounds, white/slate-400 text
- Improved mobile menu drawer with lighter overlay in light mode
- Updated Header.svelte to use Svelte 5 runes syntax for component rendering

### Technical Details
- Full light/dark mode theme support with Tailwind `dark:` variants
- Svelte 5 runes syntax (`{@const}`) for dynamic component rendering
- Consistent color palette across all pages using Tailwind's dark mode

---

## [1.0.0] - 2026-03-27

### Added
- Initial release of Laju Framework
- HyperExpress server (258,611 req/sec, 11x faster than Express.js)
- SQLite with BetterSQLite3 + Kysely query builder
- Svelte 5 with Inertia.js for frontend
- TailwindCSS 3 & 4 for styling
- Vite build tool
- Session-based authentication with cookies
- OAuth Google login support
- Password reset via email
- CSRF protection
- Rate limiting on auth endpoints
- Input validation via Zod schemas
- Local and S3-compatible storage (AWS S3, Wasabi)
- Email service (Nodemailer, Resend API)
- Database and Redis caching
- Image processing with Sharp
- Winston logging
- CLI commands for migrations and code generation
- Multi-agent workflow support
- Docker support
- GitHub Actions CI/CD pipeline

### Fixed
- Inertia.js Svelte v3 compatibility (using `page` instead of `$page`)
- DarkModeToggle Svelte 5 runes compatibility
