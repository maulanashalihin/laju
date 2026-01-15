# Redis Guide

Complete guide for using Redis in Laju framework.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Basic Operations](#basic-operations)
5. [Hash Operations](#hash-operations)
6. [List Operations](#list-operations)
7. [Set Operations](#set-operations)
8. [Utility Methods](#utility-methods)
9. [Use Cases](#use-cases)
10. [Best Practices](#best-practices)

---

## Overview

Redis is an in-memory data store used for:
- Caching (high-performance)
- Session storage
- Rate limiting
- Real-time analytics
- Pub/Sub messaging

**Service Location:** `app/services/Redis.ts`

---

## Installation

### macOS
```bash
brew install redis
brew services start redis
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
```

### Using Docker
```bash
docker run -d -p 6379:6379 redis:latest
```

### Verify Installation
```bash
redis-cli ping
# Should return: PONG
```

---

## Configuration

Add to `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional, leave empty if no password
```

---

## Basic Operations

### Set & Get

```typescript
import Redis from "app/services/Redis";

// Set value with TTL (seconds)
await Redis.set("user:123", JSON.stringify(user), 3600); // 1 hour

// Set value without TTL
await Redis.set("config:theme", "dark");

// Get value
const cached = await Redis.get("user:123");
const user = cached ? JSON.parse(cached) : null;
```

### Delete

```typescript
// Delete single key
await Redis.del("user:123");

// Delete multiple keys
await Redis.del(["user:123", "user:456", "user:789"]);
```

### Check Existence

```typescript
// Returns 1 if exists, 0 if not
const exists = await Redis.exists("user:123");
if (exists === 1) {
  console.log("Key exists");
}
```

### Increment Counter

```typescript
// Increment by 1
const views = await Redis.incr("page:views");

// Useful for rate limiting, analytics, etc.
```

---

## Hash Operations

Hashes are useful for storing objects with multiple fields.

### Set & Get Hash Fields

```typescript
// Set single field
await Redis.hset("user:123", "name", "John Doe");
await Redis.hset("user:123", "email", "john@example.com");

// Get single field
const name = await Redis.hget("user:123", "name");

// Get all fields
const user = await Redis.hgetall("user:123");
// Returns: { name: "John Doe", email: "john@example.com" }
```

### Use Case: User Session

```typescript
// Store session data
await Redis.hset("session:abc123", "userId", "123");
await Redis.hset("session:abc123", "role", "admin");
await Redis.hset("session:abc123", "lastSeen", Date.now().toString());

// Retrieve session
const session = await Redis.hgetall("session:abc123");
```

---

## List Operations

Lists are ordered collections of strings.

### Add to List

```typescript
// Add to left (beginning)
await Redis.lpush("notifications:user:123", "New message", "New like");

// Add to right (end)
await Redis.rpush("notifications:user:123", "New comment");
```

### Get from List

```typescript
// Get all items
const notifications = await Redis.lrange("notifications:user:123", 0, -1);

// Get first 10 items
const recent = await Redis.lrange("notifications:user:123", 0, 9);
```

### Use Case: Activity Feed

```typescript
// Add activity
await Redis.lpush("feed:global", JSON.stringify({
  type: "post",
  userId: 123,
  timestamp: Date.now()
}));

// Get recent activities (limit 20)
const activities = await Redis.lrange("feed:global", 0, 19);
```

---

## Set Operations

Sets are unordered collections of unique strings.

### Add & Get Members

```typescript
// Add members
await Redis.sadd("tags:post:123", "javascript", "typescript", "nodejs");

// Get all members
const tags = await Redis.smembers("tags:post:123");
// Returns: ["javascript", "typescript", "nodejs"]
```

### Use Case: Unique Tracking

```typescript
// Track unique visitors
await Redis.sadd("visitors:page:home", "user:123");
await Redis.sadd("visitors:page:home", "user:456");

// Get count
const visitors = await Redis.smembers("visitors:page:home");
console.log(`Unique visitors: ${visitors.length}`);
```

---

## Utility Methods

### TTL & Expiration

```typescript
// Get remaining TTL (returns -1 if no expiry, -2 if key doesn't exist)
const ttl = await Redis.ttl("user:123");
console.log(`Expires in ${ttl} seconds`);

// Set expiration on existing key
await Redis.expire("user:123", 1800); // 30 minutes
```

### Connection Management

```typescript
// Close Redis connection (useful for graceful shutdown)
await Redis.disconnect();
```

---

## Use Cases

### 1. Cache-Aside Pattern

```typescript
async function getUser(id: string) {
  // 1. Check cache
  const cached = await Redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. Cache miss - fetch from DB
  const user = await DB.from("users").where("id", id).first();
  
  // 3. Store in cache
  if (user) {
    await Redis.set(`user:${id}`, JSON.stringify(user), 3600);
  }
  
  return user;
}
```

### 2. Rate Limiting

```typescript
async function checkRateLimit(userId: string, limit: number = 100) {
  const key = `ratelimit:${userId}`;
  
  // Increment counter
  const count = await Redis.incr(key);
  
  // Set expiry on first request
  if (count === 1) {
    await Redis.expire(key, 60); // 1 minute window
  }
  
  return count <= limit;
}

// Usage
if (await checkRateLimit("user:123", 100)) {
  // Process request
} else {
  // Rate limit exceeded
}
```

### 3. Session Storage

```typescript
async function createSession(userId: string) {
  const sessionId = generateSessionId();
  
  // Store session data
  await Redis.hset(`session:${sessionId}`, "userId", userId);
  await Redis.hset(`session:${sessionId}`, "createdAt", Date.now().toString());
  await Redis.expire(`session:${sessionId}`, 86400); // 24 hours
  
  return sessionId;
}

async function getSession(sessionId: string) {
  const session = await Redis.hgetall(`session:${sessionId}`);
  return Object.keys(session).length > 0 ? session : null;
}
```

### 4. Real-time Notifications

```typescript
async function addNotification(userId: string, message: string) {
  const key = `notifications:${userId}`;
  
  // Add to list
  await Redis.lpush(key, JSON.stringify({
    message,
    timestamp: Date.now()
  }));
  
  // Keep only last 50 notifications
  await Redis.ltrim(key, 0, 49);
  
  // Set expiry
  await Redis.expire(key, 604800); // 7 days
}

async function getNotifications(userId: string) {
  const notifications = await Redis.lrange(`notifications:${userId}`, 0, -1);
  return notifications.map(n => JSON.parse(n));
}
```

---

## Best Practices

### 1. Use Descriptive Keys

```typescript
// Good - clear namespace
await Redis.set("user:123:profile", JSON.stringify(user), 3600);
await Redis.set("cache:api:weather:jakarta", JSON.stringify(weather), 1800);

// Bad - unclear
await Redis.set("u123", JSON.stringify(user), 3600);
await Redis.set("data", JSON.stringify(weather), 1800);
```

### 2. Set Appropriate TTL

```typescript
// Short TTL for frequently changing data
await Redis.set("cart:items", JSON.stringify(items), 300); // 5 minutes

// Medium TTL for semi-static data
await Redis.set("user:profile", JSON.stringify(user), 3600); // 1 hour

// Long TTL for static data
await Redis.set("config:app", JSON.stringify(config), 86400); // 24 hours
```

### 3. Handle Connection Errors

```typescript
try {
  const cached = await Redis.get("key");
  // Process cached data
} catch (error) {
  console.error("Redis error:", error);
  // Fallback to database or alternative cache
}
```

### 4. Use JSON for Complex Data

```typescript
// Complex objects
const user = {
  id: 123,
  name: "John",
  preferences: { theme: "dark", language: "en" }
};

await Redis.set("user:123", JSON.stringify(user), 3600);

// Retrieve and parse
const cached = await Redis.get("user:123");
const user = cached ? JSON.parse(cached) : null;
```

### 5. Batch Operations for Performance

```typescript
// Instead of multiple calls
await Redis.set("key1", "value1");
await Redis.set("key2", "value2");
await Redis.set("key3", "value3");

// Use pipeline (if needed for high volume)
// Note: Current implementation doesn't support pipelines,
// but you can add it if needed
```

### 6. Monitor Redis Memory

```bash
# Check memory usage
redis-cli INFO memory

# Check key count
redis-cli DBSIZE

# Find large keys
redis-cli --bigkeys
```

---

## Performance Tips

1. **Use Redis for hot data** - Cache frequently accessed data
2. **Avoid storing large objects** - Keep values under 1MB
3. **Use appropriate data structures** - Hash for objects, List for queues, Set for unique items
4. **Set TTL on all keys** - Prevent memory bloat
5. **Monitor hit rate** - Track cache effectiveness

---

## Troubleshooting

### Connection Refused

```bash
# Check if Redis is running
redis-cli ping

# Start Redis
redis-server
```

### Memory Issues

```bash
# Check memory usage
redis-cli INFO memory

# Configure maxmemory in redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### Slow Operations

```bash
# Monitor slow queries
redis-cli SLOWLOG GET 10

# Check latency
redis-cli --latency
```

---

## Next Steps

- [Caching Guide](11-CACHING.md) - Compare Redis with Database Cache
- [Performance Guide](09b-PERFORMANCE.md) - Performance optimization
- [Best Practices](09-BEST-PRACTICES.md) - General best practices
