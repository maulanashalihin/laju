# Rate Limiting Guide

## 📚 Overview

Laju.dev sekarang memiliki **production-ready rate limiting** system dengan sliding window algorithm untuk mencegah abuse dan protect API endpoints.

---

## 🎯 Features

### 1. **Sliding Window Algorithm**
- ✅ Lebih akurat dari fixed window
- ✅ Smooth rate limiting
- ✅ No burst traffic at window boundaries

### 2. **In-Memory Storage**
- ✅ Fast performance
- ✅ Auto cleanup expired entries
- ✅ No external dependencies
- ⚠️ Single server only (use Redis untuk multi-server)

### 3. **Flexible Configuration**
- ✅ Custom time windows
- ✅ Custom max requests
- ✅ Custom key generators
- ✅ Skip conditions
- ✅ Custom error handlers

### 4. **Preset Rate Limiters**
- ✅ Auth rate limit (5 req/15min)
- ✅ API rate limit (100 req/15min)
- ✅ Password reset (3 req/hour)
- ✅ Create account (3 req/hour)
- ✅ File upload (50 req/hour)
- ✅ Email sending (10 req/hour)

---

## 📁 File Structure

```
app/
├── services/
│   └── RateLimiter.ts         # Core rate limiter service
└── middlewares/
    └── rateLimit.ts           # Rate limit middleware & presets

routes/
└── web.ts                     # Routes with rate limiting applied

tests/
└── unit/services/
    └── RateLimiter.test.ts    # 14 tests ✅
```

---

## 🚀 Usage

### 1. Basic Usage

```typescript
import { rateLimit } from 'app/middlewares/rateLimit';

// Create custom rate limiter
const myRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 100,           // 100 requests
  message: 'Too many requests'
});

// Apply to route
Route.get('/api/data', [myRateLimit], Controller.getData);
```

### 2. Using Presets

```typescript
import { 
  authRateLimit,           // 5 req/15min
  apiRateLimit,            // 100 req/15min
  passwordResetRateLimit,  // 3 req/hour
  createAccountRateLimit,  // 3 req/hour
  uploadRateLimit,         // 50 req/hour
  emailRateLimit          // 10 req/hour
} from 'app/middlewares/rateLimit';

// Auth endpoints
Route.post('/login', [authRateLimit], AuthController.login);
Route.post('/register', [createAccountRateLimit], AuthController.register);

// API endpoints
Route.get('/api/users', [apiRateLimit], UserController.index);

// Password reset
Route.post('/forgot-password', [passwordResetRateLimit], AuthController.forgotPassword);

// File upload
Route.post('/upload', [uploadRateLimit], UploadController.upload);
```

### 3. Rate Limit by User ID

```typescript
import { userRateLimit } from 'app/middlewares/rateLimit';

// 50 requests per 15 minutes per user
Route.post('/api/create', [
  Auth,  // Must be authenticated
  userRateLimit(50, 15 * 60 * 1000)
], Controller.create);
```

### 4. Custom Key Generator

```typescript
const emailRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 10,
  keyGenerator: (req) => {
    // Rate limit by email instead of IP
    const email = req.body?.email || req.ip;
    return `email:${email}`;
  }
});

Route.post('/send-email', [emailRateLimit], EmailController.send);
```

### 5. Skip Conditions

```typescript
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user?.is_admin === true;
  }
});

Route.get('/api/data', [Auth, apiRateLimit], Controller.getData);
```

### 6. Custom Error Handler

```typescript
const customRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  handler: (req, res) => {
    // Custom response
    return res.status(429).json({
      success: false,
      error: 'Slow down! You are making too many requests.',
      retryAfter: 60
    });
  }
});
```

---

## 📊 Response Headers

Rate limit middleware automatically sets these headers:

```http
X-RateLimit-Limit: 100          # Max requests allowed
X-RateLimit-Remaining: 95       # Requests remaining
X-RateLimit-Reset: 2025-01-20T10:45:00.000Z  # When limit resets
Retry-After: 60                 # Seconds to wait (when blocked)
```

---

## 🎨 Response Format

### When Allowed
```json
{
  "success": true,
  "data": { ... }
}
```

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-01-20T10:45:00.000Z
```

### When Rate Limited (429)
```json
{
  "success": false,
  "error": {
    "message": "Too many requests, please try again later",
    "code": "RATE_LIMIT_EXCEEDED",
    "statusCode": 429,
    "retryAfter": 60
  }
}
```

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-01-20T10:45:00.000Z
Retry-After: 60
```

---

## 🔧 Configuration Options

```typescript
interface RateLimitOptions {
  windowMs?: number;           // Time window in ms (default: 15 min)
  maxRequests?: number;        // Max requests (default: 100)
  message?: string;            // Error message
  statusCode?: number;         // HTTP status (default: 429)
  keyGenerator?: (req) => string;  // Custom key
  skip?: (req) => boolean;     // Skip condition
  handler?: (req, res) => void;    // Custom handler
}
```

---

## 📈 Preset Configurations

| Preset | Window | Max Requests | Use Case |
|--------|--------|--------------|----------|
| `authRateLimit` | 15 min | 5 | Login, logout |
| `apiRateLimit` | 15 min | 100 | General API |
| `generalRateLimit` | 15 min | 1000 | Public routes |
| `passwordResetRateLimit` | 1 hour | 3 | Password reset |
| `createAccountRateLimit` | 1 hour | 3 | Registration |
| `uploadRateLimit` | 1 hour | 50 | File uploads |
| `emailRateLimit` | 1 hour | 10 | Email sending |

---

## 💡 Best Practices

### 1. Apply to Sensitive Endpoints
```typescript
// ✅ Good - Protect auth endpoints
Route.post('/login', [authRateLimit], AuthController.login);
Route.post('/register', [createAccountRateLimit], AuthController.register);

// ❌ Bad - No rate limiting on sensitive endpoints
Route.post('/login', AuthController.login);
```

### 2. Use Appropriate Limits
```typescript
// ✅ Good - Strict for auth
Route.post('/login', [authRateLimit], ...);  // 5 req/15min

// ✅ Good - Lenient for public API
Route.get('/api/posts', [apiRateLimit], ...);  // 100 req/15min

// ❌ Bad - Too lenient for auth
Route.post('/login', [apiRateLimit], ...);  // 100 req/15min
```

### 3. Combine with Authentication
```typescript
// ✅ Good - Rate limit by user ID for authenticated routes
Route.post('/api/create', [
  Auth,
  userRateLimit(50)
], Controller.create);

// ✅ Good - Rate limit by IP for public routes
Route.post('/contact', [
  rateLimit({ maxRequests: 10 })
], ContactController.send);
```

### 4. Provide Clear Error Messages
```typescript
// ✅ Good - Clear message
const loginRateLimit = rateLimit({
  maxRequests: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.'
});

// ❌ Bad - Generic message
const loginRateLimit = rateLimit({
  maxRequests: 5,
  message: 'Error'
});
```

### 5. Log Rate Limit Events
```typescript
// Already implemented in RateLimiter service
// Logs warning when rate limit exceeded
logWarn('Rate limit exceeded', {
  key,
  requests,
  maxRequests,
  retryAfter
});
```

---

## 🛠️ Advanced Usage

### 1. Multiple Rate Limits on Same Route
```typescript
// Apply both IP-based and user-based rate limiting
Route.post('/api/create', [
  Auth,
  rateLimit({ maxRequests: 100 }),  // IP-based
  userRateLimit(50)                   // User-based
], Controller.create);
```

### 2. Different Limits for Different Users
```typescript
const dynamicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req) => {
    // Premium users get higher limits
    const limit = req.user?.is_premium ? 1000 : 100;
    return `${req.user?.id}:${limit}`;
  }
});
```

### 3. Rate Limit by Route
```typescript
const routeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req) => {
    // Different limits per route
    return `${req.ip}:${req.url}`;
  }
});
```

---

## 🔍 Monitoring

### Check Rate Limit Status
```typescript
import rateLimiter from 'app/services/RateLimiter';

// Get status for specific key
const status = rateLimiter.getStatus('user:123');
console.log(status);
// { count: 45, resetAt: 1234567890, requests: [...] }

// Get total tracked keys
const total = rateLimiter.size();
console.log(`Tracking ${total} keys`);
```

### Reset Rate Limits
```typescript
// Reset specific key
rateLimiter.reset('user:123');

// Reset all keys
rateLimiter.resetAll();
```

---

## 🧪 Testing

### Run Rate Limiter Tests
```bash
npm run test:run tests/unit/services/RateLimiter.test.ts
```

### Test Results
```
✓ RateLimiter Service (14 tests)
  ✓ Basic Rate Limiting (3)
  ✓ Window Reset (1)
  ✓ Multiple Keys (1)
  ✓ Reset Functions (2)
  ✓ Status Tracking (3)
  ✓ Sliding Window (1)
  ✓ Edge Cases (3)
```

---

## ⚠️ Limitations & Considerations

### 1. **In-Memory Storage**
- ✅ **Pros:** Fast, no dependencies
- ❌ **Cons:** Lost on restart, single server only

**Solution for Production:**
```typescript
// Use Redis for multi-server setup
import Redis from 'ioredis';
const redis = new Redis();

// Store rate limit data in Redis
// (Implementation example available on request)
```

### 2. **Memory Usage**
- Each tracked key uses ~200 bytes
- 10,000 keys = ~2MB memory
- Auto cleanup every 5 minutes

### 3. **Distributed Systems**
- Current implementation is single-server only
- For load-balanced apps, use Redis-based rate limiting

---

## 🚀 Production Checklist

- [x] Rate limiting implemented
- [x] Tests passing (14/14)
- [x] Applied to sensitive routes
- [x] Error messages clear
- [x] Headers set correctly
- [ ] Monitor rate limit logs
- [ ] Adjust limits based on usage
- [ ] Consider Redis for multi-server (optional)

---

## 📊 Example Routes Configuration

```typescript
// routes/web.ts

// Authentication (strict)
Route.post('/login', [authRateLimit], ...);              // 5/15min
Route.post('/register', [createAccountRateLimit], ...);  // 3/hour
Route.post('/forgot-password', [passwordResetRateLimit], ...);  // 3/hour

// API (moderate)
Route.get('/api/users', [apiRateLimit], ...);           // 100/15min
Route.post('/api/posts', [Auth, userRateLimit(50)], ...);  // 50/15min

// File Upload (controlled)
Route.post('/upload', [Auth, uploadRateLimit], ...);    // 50/hour

// Email (very controlled)
Route.post('/send-email', [Auth, emailRateLimit], ...); // 10/hour

// Public (lenient)
Route.get('/posts', [generalRateLimit], ...);           // 1000/15min
```

---

## 🎉 Summary

**Task 4 Complete!** ✅

Laju.dev sekarang memiliki:
- ✅ **Sliding window rate limiting**
- ✅ **Flexible configuration**
- ✅ **Preset rate limiters**
- ✅ **14 passing tests**
- ✅ **Production-ready**
- ✅ **Applied to sensitive routes**

**Benefits:**
- 🛡️ **Protection** dari brute force attacks
- 🚫 **Prevention** dari API abuse
- ⚡ **Performance** dengan in-memory storage
- 📊 **Monitoring** dengan headers & logs
- 🎯 **Flexibility** dengan custom configurations

**Next Steps:**
1. Monitor rate limit logs
2. Adjust limits based on real usage
3. Consider Redis untuk multi-server deployment
4. Add rate limit dashboard (optional)

---

**Happy Rate Limiting! 🚀**
