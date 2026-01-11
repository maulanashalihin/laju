# Performance Guide

Optimization strategies for Laju applications.

## Table of Contents

1. [Database Performance](#database-performance)
2. [Caching Strategies](#caching-strategies)
3. [File Upload Optimization](#file-upload-optimization)
4. [Frontend Performance](#frontend-performance)
5. [Server Configuration](#server-configuration)
6. [Monitoring](#monitoring)

---

## Database Performance

### Use Native SQLite for Reads

Native SQLite is 2-4x faster than Knex for simple queries.

```typescript
// Slow - Knex (convenience)
const user = await DB.from("users").where("id", id).first();

// Fast - Native SQLite (performance)
const user = SQLite.get("SELECT * FROM users WHERE id = ?", [id]);
```

**Benchmark Results:**
| Operation | Knex | Native SQLite | Improvement |
|-----------|------|---------------|-------------|
| Single read | 0.8ms | 0.2ms | 4x faster |
| Multiple reads | 5ms | 1.3ms | 3.8x faster |

### Add Database Indexes

```typescript
// In migration
export async function up(knex: Knex) {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('slug').notNullable();
    table.integer('user_id').unsigned();
    table.string('status').defaultTo('draft');
    table.bigInteger('created_at');
    
    // Indexes for frequently queried columns
    table.unique('slug');
    table.index('user_id');
    table.index('status');
    table.index('created_at');
    table.index(['user_id', 'status']);  // Composite index
  });
}
```

### Avoid N+1 Queries

```typescript
// SLOW - N+1 problem (1 + N queries)
const posts = await DB.from("posts");
for (const post of posts) {
  post.author = await DB.from("users").where("id", post.user_id).first();
}

// FAST - Single query with JOIN
const posts = await DB.from("posts")
  .join("users", "posts.user_id", "users.id")
  .select("posts.*", "users.name as author_name", "users.email as author_email");
```

### Use Transactions for Bulk Operations

```typescript
// SLOW - Individual inserts
for (const item of items) {
  await DB.table("items").insert(item);
}

// FAST - Transaction (atomic, faster)
await DB.transaction(async (trx) => {
  for (const item of items) {
    await trx.table("items").insert(item);
  }
});

// FASTEST - Batch insert
await DB.table("items").insert(items);
```

### WAL Mode (Enabled by Default)

WAL mode provides 19.9x faster writes and allows concurrent reads.

```typescript
// Already configured in SQLite service
nativeDb.pragma('journal_mode = WAL');
nativeDb.pragma('synchronous = NORMAL');
```

### Select Only Needed Columns

```typescript
// SLOW - Select all columns
const users = await DB.from("users");

// FAST - Select only needed columns
const users = await DB.from("users").select("id", "name", "email");
```

### Use .first() for Single Records

```typescript
// Correct
const user = await DB.from("users").where("id", id).first();

// Avoid
const [user] = await DB.from("users").where("id", id).limit(1);
```

---

## Caching Strategies

### Cache-Aside Pattern

```typescript
import Redis from "app/services/Redis";

async function getUser(id: string) {
  // 1. Check cache
  const cached = await Redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. Cache miss - fetch from DB
  const user = await DB.from("users").where("id", id).first();
  
  // 3. Store in cache (1 hour TTL)
  if (user) {
    await Redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600);
  }
  
  return user;
}
```

### Cache Invalidation

```typescript
// After update, invalidate cache
async function updateUser(id: string, data: object) {
  await DB.table("users").where("id", id).update(data);
  await Redis.del(`user:${id}`);  // Invalidate
}

// Pattern: prefix-based invalidation
async function invalidateUserCaches(userId: string) {
  const keys = await Redis.keys(`user:${userId}:*`);
  if (keys.length > 0) {
    await Redis.del(...keys);
  }
}
```

### Cache Warming

```typescript
// Pre-populate cache on startup
async function warmCache() {
  const popularPosts = await DB.from("posts")
    .where("views", ">", 1000)
    .limit(100);
  
  for (const post of popularPosts) {
    await Redis.set(`post:${post.id}`, JSON.stringify(post), "EX", 3600);
  }
}
```

### In-Memory Caching (No Redis)

```typescript
// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();

function getCached<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key: string, data: any, ttlSeconds: number) {
  cache.set(key, {
    data,
    expires: Date.now() + (ttlSeconds * 1000)
  });
}
```

---

## File Upload Optimization

### Use Presigned URLs

Direct upload to S3 bypasses your server entirely.

```typescript
// Server generates signed URL
const signedUrl = await getSignedUploadUrl(key, contentType, 3600);

// Client uploads directly to S3
await fetch(signedUrl, {
  method: 'PUT',
  body: file
});
```

**Benefits:**
- Server CPU/memory not used for file transfer
- No file size limits on your server
- Faster uploads (direct to CDN edge)
- Unlimited concurrent uploads

### Image Optimization

```typescript
import sharp from 'sharp';

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true })
    .toBuffer();
}

// Generate thumbnails
async function createThumbnail(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .jpeg({ quality: 70 })
    .toBuffer();
}
```

### Lazy Loading Images

```svelte
<img 
  src={thumbnail} 
  data-src={fullImage}
  loading="lazy"
  alt={alt}
/>
```

---

## Frontend Performance

### Code Splitting

Vite automatically code-splits by route:

```javascript
// app.js - Dynamic imports
createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.svelte');
    return pages[`./Pages/${name}.svelte`]();  // Lazy loaded
  }
});
```

### Minimize Bundle Size

```javascript
// vite.config.mjs
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@inertiajs/svelte']
        }
      }
    }
  }
});
```

### Asset Caching

```typescript
// AssetController.ts - Long cache headers
response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
```

### Debounce User Input

```svelte
<script>
  import { debounce } from './utils';
  
  let searchQuery = $state('');
  
  const debouncedSearch = debounce((query) => {
    fetch(`/api/search?q=${query}`);
  }, 300);
  
  $effect(() => {
    if (searchQuery.length > 2) {
      debouncedSearch(searchQuery);
    }
  });
</script>

<input bind:value={searchQuery} placeholder="Search..." />
```

---

## Server Configuration

### PM2 Cluster Mode

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'laju',
    script: 'build/server.js',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### Request Body Limit

```typescript
// server.ts
const option = {
  max_body_length: 10 * 1024 * 1024  // 10MB limit
};
```

### Graceful Shutdown

```typescript
process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  
  // Close database connections
  await DB.destroy();
  
  // Close Redis
  await Redis.quit();
  
  process.exit(0);
});
```

---

## Monitoring

### Health Check Endpoint

```typescript
Route.get("/health", async (request, response) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  
  const healthy = checks.database && checks.redis;
  
  return response
    .status(healthy ? 200 : 503)
    .json({ status: healthy ? 'ok' : 'degraded', ...checks });
});

async function checkDatabase(): Promise<boolean> {
  try {
    await DB.raw('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
```

### Request Timing

```typescript
// Middleware to log slow requests
webserver.use((request, response, next) => {
  const start = Date.now();
  
  response.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {  // Log requests > 1s
      Logger.warn('Slow request', {
        url: request.url,
        method: request.method,
        duration
      });
    }
  });
  
  next();
});
```

### Memory Monitoring

```typescript
setInterval(() => {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  
  if (heapUsedMB > 500) {  // Alert if > 500MB
    Logger.warn('High memory usage', { heapUsedMB });
  }
}, 60000);  // Check every minute
```

---

## Performance Checklist

### Database
- [ ] Use Native SQLite for simple reads
- [ ] Add indexes to frequently queried columns
- [ ] Avoid N+1 queries (use JOINs)
- [ ] Use transactions for bulk operations
- [ ] WAL mode enabled

### Caching
- [ ] Cache frequently accessed data
- [ ] Implement cache invalidation
- [ ] Set appropriate TTLs

### Files
- [ ] Use presigned URLs for uploads
- [ ] Optimize images before storage
- [ ] Implement lazy loading

### Frontend
- [ ] Enable code splitting
- [ ] Set long cache headers for assets
- [ ] Debounce user input

### Server
- [ ] Use PM2 cluster mode
- [ ] Implement health checks
- [ ] Monitor slow requests

---

## Next Steps

- [Security Guide](09a-SECURITY.md)
- [Deployment Guide](08-DEPLOYMENT.md)
- [Best Practices](09-BEST-PRACTICES.md)
