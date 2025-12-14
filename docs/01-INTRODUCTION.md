# Laju Framework - Introduction

> **Version:** 1.0.9  
> **Author:** Maulana Shalihin  
> **License:** MIT  
> **Website:** [https://laju.dev](https://laju.dev)

## What is Laju?

**Laju** (Indonesian for "fast/swift") is a high-performance TypeScript web framework that combines the best of modern web technologies to deliver exceptional speed and developer experience.

### Core Technologies

- **HyperExpress** - Ultra-fast HTTP server (258,611 req/sec)
- **Svelte 5** - Modern reactive UI framework
- **Inertia.js** - Seamless client-server communication
- **BetterSQLite3** - High-performance embedded database with WAL mode
- **TypeScript** - Type-safe development experience
- **TailwindCSS 4** - Utility-first CSS framework (with Vite plugin)
- **Vite** - Lightning-fast build tool

### Key Features

✅ **Exceptional Performance**
- 2.08x faster than pure Node.js
- 11.45x faster than Express.js
- 258,611 requests/second throughput

✅ **Modern Development Stack**
- Svelte 5 with runes API
- TypeScript for type safety
- Vite for instant HMR
- TailwindCSS 4 for rapid styling

✅ **Built-in Authentication**
- PBKDF2 password hashing (100,000 iterations)
- Session-based authentication
- Google OAuth integration
- Password reset functionality
- Email verification

✅ **High-Performance Database**
- BetterSQLite3 with WAL mode (19.9x faster writes)
- Knex.js query builder
- Native SQLite for maximum performance
- Database migrations

✅ **Complete Feature Set**
- Email support (Nodemailer & Resend)
- S3/Wasabi file storage with presigned URLs
- Rate limiting protection
- Redis caching (optional)
- Winston logging
- Hot reload in development

### Performance Benchmarks

#### HTTP Server Performance

| Framework | Requests/sec | Avg Latency | Performance vs Laju |
|-----------|--------------|-------------|---------------------|
| **Laju (HyperExpress)** | **258,611** | **1.52ms** | **Baseline** |
| Pure Node.js | 124,024 | 3.62ms | 2.08x slower |
| Express.js | 22,590 | 26.36ms | 11.45x slower |
| Laravel | 80 | 128.72ms | 3,232x slower |

#### Database Performance (WAL Mode)

| Operation | Default Mode | WAL Mode | Improvement |
|-----------|--------------|----------|-------------|
| Single Insert | 4,678 ops/sec | 93,287 ops/sec | **19.9x faster** |
| Batch Insert | 2,895 ops/sec | 8,542 ops/sec | **2.95x faster** |
| Concurrent Writes | 89 ops/sec | 1,302 ops/sec | **14.6x faster** |

#### Native SQLite vs Knex.js

| Operation | Native | Knex.js | Native Advantage |
|-----------|--------|---------|------------------|
| Select All | 70,501 ops/sec | 35,960 ops/sec | **96% faster** |
| Select By ID | 290,020 ops/sec | 59,816 ops/sec | **385% faster** |
| Delete | 227,006 ops/sec | 80,821 ops/sec | **181% faster** |

### Use Cases

Laju is perfect for:

- **High-traffic web applications** - Handle 250K+ requests/second
- **Real-time dashboards** - Fast database queries and updates
- **SaaS applications** - Built-in auth, file storage, email
- **API backends** - RESTful APIs with rate limiting
- **Content management** - Fast reads with SQLite
- **Prototypes & MVPs** - Rapid development with modern stack

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

# Start development server
npm run dev
```

Visit `http://localhost:5555` to see your app running!

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         CLIENT (Browser)                 │
│  Svelte 5 + Inertia.js + TailwindCSS 4  │
└─────────────────────────────────────────┘
                  ↕ HTTP/JSON
┌─────────────────────────────────────────┐
│         SERVER (Node.js)                 │
│  HyperExpress + TypeScript              │
├─────────────────────────────────────────┤
│  Controllers → Services → Database      │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         DATA LAYER                       │
│  BetterSQLite3 (WAL) + Redis (Optional) │
└─────────────────────────────────────────┘
```

### Philosophy

Laju follows these principles:

1. **Performance First** - Every decision optimized for speed
2. **Developer Experience** - Modern tools, hot reload, TypeScript
3. **Batteries Included** - Auth, email, storage out of the box
4. **Simple & Elegant** - Clean architecture, easy to understand
5. **Production Ready** - Battle-tested components, proper error handling

### Community & Support

- **GitHub:** [github.com/maulanashalihin/laju](https://github.com/maulanashalihin/laju)
- **Website:** [laju.dev](https://laju.dev)
- **Documentation:** [laju.dev/docs](https://laju.dev/docs)
- **Sponsor:** [github.com/sponsors/maulanashalihin](https://github.com/sponsors/maulanashalihin)

### License

MIT License - free for personal and commercial use.
