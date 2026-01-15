# Caching Guide

Complete guide for caching strategies in Laju framework.

## Table of Contents

1. [Overview](#overview)
2. [Cache Options](#cache-options)
3. [Database Cache (Default)](#database-cache-default)
4. [Redis Cache (Optional)](#redis-cache-optional)
5. [When to Use Cache](#when-to-use-cache)
6. [Comparison](#comparison)
7. [Best Practices](#best-practices)

---

## Overview

Laju provides two caching options:

| Option | Storage | Setup | Use Case |
|--------|---------|-------|----------|
| **Database Cache** | SQLite | Zero config | Small-medium apps, simple caching |
| **Redis Cache** | Redis | Requires Redis server | High-traffic apps, distributed systems |

**Default:** Database Cache (no additional setup required)

---

## Cache Options

### Database Cache (Recommended for Most Apps)

**Pros:**
- ✅ Zero configuration - works out of the box
- ✅ No additional server/service needed
- ✅ Same database as your app data
- ✅ Expired items removed on access
- ✅ Perfect for small-medium traffic

**Cons:**
- ❌ Slower than Redis (but still fast with SQLite)
- ❌ Not suitable for distributed systems
- ❌ Limited to single server

### Redis Cache (For High-Traffic Apps)

**Pros:**
- ✅ Extremely fast (in-memory)
- ✅ Supports distributed caching
- ✅ Advanced features (pub/sub, atomic operations)
- ✅ Industry standard

**Cons:**
- ❌ Requires Redis server installation
- ❌ Additional infrastructure to manage
- ❌ More complex setup

---

## Database Cache (Default)

### Migration

```typescript
// migrations/20251210000000_create_cache_table.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("cache", (table) => {
        table.string("key").primary();
        table.text("value").notNullable();
        table.bigInteger("expiration").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("cache");
}
```

Run migration:
```bash
npx knex migrate:latest
```

### Usage

```typescript
import Cache from "app/services/CacheService";

// Store in cache (10 minutes)
await Cache.put("user:123", user, 10);

// Get from cache
const user = await Cache.get<User>("user:123");

// Remember pattern (cache-aside)
const user = await Cache.remember("user:123", 10, async () => {
  return await DB.from("users").where("id", 123).first();
});

// Delete from cache
await Cache.forget("user:123");
```

### Methods

```typescript
class CacheService {
  // Get cached value
  async get<T>(key: string): Promise<T | null>
  
  // Store value with expiration (minutes)
  async put(key: string, value: any, minutes: number): Promise<void>
  
  // Get or compute and cache
  async remember<T>(key: string, minutes: number, callback: () => Promise<T>): Promise<T>
  
  // Delete cached value
  async forget(key: string): Promise<void>
}
```

### Example: Cache User Data

```typescript
// app/services/UserService.ts
import Cache from "./CacheService";
import DB from "./DB";

class UserService {
  async getUser(id: string) {
    return await Cache.remember(`user:${id}`, 60, async () => {
      return await DB.from("users").where("id", id).first();
    });
  }
  
  async updateUser(id: string, data: any) {
    await DB.table("users").where("id", id).update(data);
    await Cache.forget(`user:${id}`); // Invalidate cache
  }
}
```

---

## Redis Cache (Optional)

### Installation

```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

### Configuration

```env
# .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional
```

### Usage

```typescript
import Redis from "app/services/Redis";

// Set cache (1 hour = 3600 seconds)
await Redis.set("user:123", JSON.stringify(user), 3600);

// Get cache
const cached = await Redis.get("user:123");
const user = cached ? JSON.parse(cached) : null;

// Delete cache
await Redis.del("user:123");

// Check exists (returns 1 if exists, 0 if not)
const exists = await Redis.exists("user:123");
if (exists === 1) {
  // key exists
}

// Increment counter
await Redis.incr("page:views");
```

### Cache-Aside Pattern with Redis

```typescript
async function getUser(id: string) {
  // 1. Check cache
  const cached = await Redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. Cache miss - fetch from DB
  const user = await DB.from("users").where("id", id).first();
  
  // 3. Store in cache (1 hour)
  if (user) {
    await Redis.set(`user:${id}`, JSON.stringify(user), 3600);
  }
  
  return user;
}
```

---

## When to Use Cache

### ✅ Good Use Cases

**1. Expensive Database Queries**
```typescript
// Cache complex aggregations
const stats = await Cache.remember("dashboard:stats", 5, async () => {
  return await DB.raw(`
    SELECT 
      COUNT(*) as total_users,
      SUM(orders.total) as revenue
    FROM users
    LEFT JOIN orders ON users.id = orders.user_id
  `);
});
```

**2. External API Calls**
```typescript
// Cache API responses
const weather = await Cache.remember("weather:jakarta", 30, async () => {
  const res = await fetch("https://api.weather.com/jakarta");
  return await res.json();
});
```

**3. Computed/Processed Data**
```typescript
// Cache processed results
const report = await Cache.remember("report:monthly", 1440, async () => {
  const data = await DB.from("transactions").where("month", currentMonth);
  return processReport(data); // Expensive computation
});
```

**4. Frequently Accessed Data**
```typescript
// Cache hot data
const popularPosts = await Cache.remember("posts:popular", 60, async () => {
  return await DB.from("posts")
    .where("views", ">", 1000)
    .orderBy("views", "desc")
    .limit(10);
});
```

### ❌ Don't Cache

**1. Real-time Data**
```typescript
// Don't cache - needs to be real-time
const liveScore = await DB.from("games").where("id", id).first();
```

**2. User-specific Sensitive Data**
```typescript
// Don't cache - security risk
const userPassword = await DB.from("users").where("id", id).first();
```

**3. Frequently Changing Data**
```typescript
// Don't cache - changes too often
const cartItems = await DB.from("cart_items").where("user_id", userId);
```

**4. Small/Fast Queries**
```typescript
// Don't cache - query is already fast
const user = await DB.from("users").where("id", id).first();
// Only cache if this query is called very frequently
```

---

## Comparison

### Database Cache vs Redis

| Feature | Database Cache | Redis Cache |
|---------|----------------|-------------|
| **Setup** | Zero config ✅ | Requires Redis server |
| **Speed** | Fast (~1-5ms) | Very fast (~0.1-1ms) |
| **Memory** | Uses disk | Uses RAM |
| **Persistence** | Persistent | Optional |
| **Distributed** | No | Yes ✅ |
| **Max Size** | Limited by disk | Limited by RAM |
| **Best For** | Single server apps | Multi-server apps |
| **Cost** | Free | Redis hosting cost |

### Performance Comparison

```typescript
// Benchmark results (1000 operations)
Database Cache: ~1.2ms per operation
Redis Cache:    ~0.3ms per operation

// For most apps, Database Cache is fast enough!
```

### When to Use Which?

**Use Database Cache if:**
- Single server deployment
- Small-medium traffic (< 10k requests/day)
- Simple caching needs
- Want zero configuration

**Use Redis Cache if:**
- Multiple servers (load balanced)
- High traffic (> 100k requests/day)
- Need advanced features (pub/sub, atomic ops)
- Already using Redis for other purposes

---

## Best Practices

### 1. Use Descriptive Keys

```typescript
// Good - clear namespace
await Cache.put("user:123:profile", user, 60);
await Cache.put("posts:popular:homepage", posts, 30);

// Bad - unclear
await Cache.put("u123", user, 60);
await Cache.put("data", posts, 30);
```

### 2. Set Appropriate TTL

```typescript
// Short TTL for frequently changing data
await Cache.put("cart:items", items, 5); // 5 minutes

// Medium TTL for semi-static data
await Cache.put("user:profile", user, 60); // 1 hour

// Long TTL for static data
await Cache.put("settings:app", settings, 1440); // 24 hours
```

### 3. Invalidate on Update

```typescript
async function updateUser(id: string, data: any) {
  await DB.table("users").where("id", id).update(data);
  await Cache.forget(`user:${id}`); // Clear cache
}
```

### 4. Use Remember Pattern

```typescript
// Good - automatic caching
const data = await Cache.remember("key", 60, async () => {
  return await expensiveOperation();
});

// Avoid - manual caching
let data = await Cache.get("key");
if (!data) {
  data = await expensiveOperation();
  await Cache.put("key", data, 60);
}
```

### 5. Handle Cache Failures Gracefully

```typescript
async function getUser(id: string) {
  try {
    return await Cache.remember(`user:${id}`, 60, async () => {
      return await DB.from("users").where("id", id).first();
    });
  } catch (error) {
    console.error("Cache error:", error);
    // Fallback to direct DB query
    return await DB.from("users").where("id", id).first();
  }
}
```

### 6. Monitor Cache Hit Rate

```typescript
let cacheHits = 0;
let cacheMisses = 0;

async function getCached(key: string) {
  const value = await Cache.get(key);
  if (value) {
    cacheHits++;
  } else {
    cacheMisses++;
  }
  return value;
}

// Log hit rate periodically
setInterval(() => {
  const total = cacheHits + cacheMisses;
  const hitRate = (cacheHits / total * 100).toFixed(2);
  console.log(`Cache hit rate: ${hitRate}%`);
}, 60000);
```


## Migration Guide

### From No Cache to Database Cache

1. Run migration:
```bash
npx knex migrate:latest
```

2. Start using cache:
```typescript
import Cache from "app/services/CacheService";

const data = await Cache.remember("key", 60, async () => {
  return await expensiveQuery();
});
```

### From Database Cache to Redis

1. Install Redis
2. Update imports:
```typescript
// Before
import Cache from "app/services/CacheService";

// After
import Redis from "app/services/Redis";
```

3. Update code:
```typescript
// Before
await Cache.put("key", value, 60);
const value = await Cache.get("key");

// After
await Redis.set("key", JSON.stringify(value), "EX", 3600);
const cached = await Redis.get("key");
const value = cached ? JSON.parse(cached) : null;
```

---

## Next Steps

- [Performance Guide](09b-PERFORMANCE.md)
- [Database Guide](03-DATABASE.md)
- [Best Practices](09-BEST-PRACTICES.md)
