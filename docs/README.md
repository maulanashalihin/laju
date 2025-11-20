# Laju Framework Documentation

Complete documentation for the Laju high-performance TypeScript web framework.

## 📚 Documentation Index

### Getting Started

1. **[Introduction](01-INTRODUCTION.md)**
   - What is Laju?
   - Core technologies
   - Key features
   - Performance benchmarks
   - Quick start guide

2. **[Project Structure](02-PROJECT-STRUCTURE.md)**
   - Directory tree overview
   - Backend structure (controllers, middleware, services)
   - Frontend structure (Svelte pages, components)
   - Routes and migrations
   - File naming conventions
   - Import paths

3. **[Backend Services](03-BACKEND-SERVICES.md)**
   - Database services (Knex.js & Native SQLite)
   - Authentication service (PBKDF2)
   - Storage service (S3/Wasabi)
   - Email services (Nodemailer & Resend)
   - View service (Squirrelly templates)
   - Logging service (Winston)
   - Rate limiter
   - Redis cache

### Core Concepts

4. **[Frontend Development](04-FRONTEND-DEVELOPMENT.md)** *(Coming Soon)*
   - Svelte 5 basics
   - Inertia.js integration
   - Component development
   - State management
   - TailwindCSS styling
   - Dark mode implementation

5. **[Database Management](05-DATABASE.md)** *(Coming Soon)*
   - Schema design
   - Migrations
   - Query optimization
   - WAL mode benefits
   - Backup & restore
   - Performance tuning

6. **[Authentication System](06-AUTHENTICATION.md)** *(Coming Soon)*
   - User registration
   - Login/logout flow
   - Password hashing (PBKDF2)
   - Session management
   - Google OAuth integration
   - Password reset
   - Email verification

### Advanced Topics

7. **[API Reference](07-API-REFERENCE.md)** *(Coming Soon)*
   - Request/Response types
   - Controller methods
   - Service APIs
   - Middleware functions
   - Helper utilities

8. **[Deployment Guide](08-DEPLOYMENT.md)** *(Coming Soon)*
   - Production build
   - Server setup
   - Environment configuration
   - PM2 process management
   - HTTPS/SSL setup
   - Performance optimization

9. **[Testing](09-TESTING.md)** *(Coming Soon)*
   - Unit testing
   - Integration testing
   - Test fixtures
   - Coverage reports
   - CI/CD integration

10. **[Best Practices](10-BEST-PRACTICES.md)** *(Coming Soon)*
    - Code organization
    - Security guidelines
    - Performance tips
    - Error handling
    - Logging strategies

## 🚀 Quick Links

### Essential Resources

- **GitHub Repository:** [github.com/maulanashalihin/laju](https://github.com/maulanashalihin/laju)
- **Official Website:** [laju.dev](https://laju.dev)
- **NPM Package:** [npmjs.com/package/create-laju-app](https://www.npmjs.com/package/create-laju-app)
- **Sponsor:** [github.com/sponsors/maulanashalihin](https://github.com/sponsors/maulanashalihin)

### Quick Start

```bash
# Create new project
npx create-laju-app my-project
cd my-project

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npx knex migrate:latest

# Start development
npm run dev
```

Visit `http://localhost:5555`

## 📖 Documentation Structure

```
docs/
├── README.md                      # This file
├── 01-INTRODUCTION.md             # Framework overview
├── 02-PROJECT-STRUCTURE.md        # Directory structure
├── 03-BACKEND-SERVICES.md         # Backend services guide
├── 04-FRONTEND-DEVELOPMENT.md     # Frontend guide (coming soon)
├── 05-DATABASE.md                 # Database guide (coming soon)
├── 06-AUTHENTICATION.md           # Auth system (coming soon)
├── 07-API-REFERENCE.md            # API docs (coming soon)
├── 08-DEPLOYMENT.md               # Deployment guide (coming soon)
├── 09-TESTING.md                  # Testing guide (coming soon)
└── 10-BEST-PRACTICES.md           # Best practices (coming soon)
```

## 🎯 Learning Path

### For Beginners

1. Start with [Introduction](01-INTRODUCTION.md) to understand Laju's philosophy
2. Review [Project Structure](02-PROJECT-STRUCTURE.md) to navigate the codebase
3. Follow the Quick Start guide to create your first app
4. Build the tutorial blog app from the README

### For Experienced Developers

1. Review [Backend Services](03-BACKEND-SERVICES.md) for API reference
2. Check [Project Structure](02-PROJECT-STRUCTURE.md) for conventions
3. Dive into specific topics as needed
4. Explore the source code for advanced patterns

## 🔧 Common Tasks

### Creating a New Feature

```bash
# 1. Create migration
npx knex migrate:make create_posts_table

# 2. Generate controller
node laju make:controller PostController

# 3. Create Svelte page
# Create: resources/js/Pages/posts/index.svelte

# 4. Add routes
# Edit: routes/web.ts
```

### Database Operations

```typescript
// Query with Knex.js
const posts = await DB.from("posts").select("*");

// High-performance with Native SQLite
const post = SQLite.get("SELECT * FROM posts WHERE id = ?", [id]);
```

### Authentication

```typescript
// Hash password
const hashed = await Authenticate.hash(password);

// Verify password
const valid = await Authenticate.compare(password, hashed);

// Create session
await Authenticate.process(user, request, response);
```

### File Upload

```typescript
// Server: Generate presigned URL
const signedUrl = await getSignedUploadUrl(key, contentType, 3600);

// Client: Upload directly to S3
await fetch(signedUrl, {
  method: 'PUT',
  headers: { 'Content-Type': contentType },
  body: file
});
```

### Send Email

```typescript
import { MailTo } from "app/services/Mailer";

await MailTo({
  to: "user@example.com",
  subject: "Welcome!",
  text: "Thank you for signing up..."
});
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5555
lsof -ti:5555 | xargs kill -9

# Or change port in .env
PORT=3000
```

### Database Locked

```bash
# Check if WAL mode is enabled
sqlite3 data/dev.sqlite3 "PRAGMA journal_mode;"
# Should return: wal

# Enable WAL mode
sqlite3 data/dev.sqlite3 "PRAGMA journal_mode=WAL;"
```

### Vite Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist build
npm install
npm run build
```

## 📊 Performance Tips

1. **Use Native SQLite for reads** - 2-4x faster than Knex.js
2. **Enable WAL mode** - 19.9x faster writes (enabled by default)
3. **Batch operations** - Use transactions for multiple inserts
4. **Cache frequently accessed data** - Use Redis for hot data
5. **Presigned URLs** - Upload files directly to S3
6. **Rate limiting** - Protect endpoints from abuse

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - free for personal and commercial use.

## 💬 Community & Support

- **Issues:** [GitHub Issues](https://github.com/maulanashalihin/laju/issues)
- **Discussions:** [GitHub Discussions](https://github.com/maulanashalihin/laju/discussions)
- **Email:** hello@laju.dev

## 🌟 Show Your Support

If you find Laju useful, please:

- ⭐ Star the repository on GitHub
- 💖 Sponsor the project
- 📢 Share with your network
- 🐛 Report bugs and suggest features

---

**Built with ❤️ by [Maulana Shalihin](https://github.com/maulanashalihin)**
