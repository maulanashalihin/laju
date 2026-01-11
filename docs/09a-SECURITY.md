# Security Guide

Comprehensive security guidelines for Laju applications.

## Table of Contents

1. [Password Security](#password-security)
2. [Input Validation](#input-validation)
3. [SQL Injection Prevention](#sql-injection-prevention)
4. [XSS Prevention](#xss-prevention)
5. [CSRF Protection](#csrf-protection)
6. [Rate Limiting](#rate-limiting)
7. [Environment Variables](#environment-variables)
8. [CORS Configuration](#cors-configuration)
9. [Security Checklist](#security-checklist)

---

## Password Security

### Use Strong Hashing

Laju uses PBKDF2 with 100,000 iterations (OWASP recommended).

```typescript
import Authenticate from "app/services/Authenticate";

// Hash password
const hashedPassword = await Authenticate.hash(password);
// Format: "salt:hash"

// Verify password
const isValid = await Authenticate.compare(password, hashedPassword);
```

### Password Requirements

```typescript
function validatePassword(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a number");
  }
  
  return errors;
}
```

### Never Store Plaintext

```typescript
// WRONG
await DB.table("users").insert({
  email,
  password: password  // Plaintext!
});

// CORRECT
await DB.table("users").insert({
  email,
  password: await Authenticate.hash(password)
});
```

---

## Input Validation

### Validate All User Input

```typescript
public async store(request: Request, response: Response) {
  const { email, name, age } = await request.json();
  
  const errors: Record<string, string> = {};
  
  // Email validation
  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }
  
  // Name validation
  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 2 || name.length > 100) {
    errors.name = "Name must be 2-100 characters";
  }
  
  // Age validation
  if (age !== undefined && (age < 0 || age > 150)) {
    errors.age = "Invalid age";
  }
  
  if (Object.keys(errors).length > 0) {
    return response.status(400).json({ error: "Validation failed", details: errors });
  }
  
  // Process valid data...
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Sanitize Input

```typescript
// Trim whitespace
const email = data.email?.trim().toLowerCase();
const name = data.name?.trim();

// Remove HTML tags if needed
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}
```

### Type Coercion

```typescript
// Ensure correct types
const page = parseInt(request.query.page, 10) || 1;
const limit = Math.min(parseInt(request.query.limit, 10) || 10, 100);
const isActive = request.query.active === 'true';
```

---

## SQL Injection Prevention

### Use Parameterized Queries

```typescript
// CORRECT - Knex (auto-parameterized)
const user = await DB.from("users")
  .where("email", email)
  .first();

// CORRECT - Native SQLite (parameterized)
const user = SQLite.get(
  "SELECT * FROM users WHERE email = ?",
  [email]
);

// CORRECT - Multiple parameters
const posts = SQLite.all(
  "SELECT * FROM posts WHERE user_id = ? AND status = ?",
  [userId, status]
);
```

### Never Concatenate SQL

```typescript
// WRONG - SQL Injection vulnerability!
const user = SQLite.get(
  `SELECT * FROM users WHERE email = '${email}'`
);

// WRONG - Even worse
const query = "SELECT * FROM users WHERE " + userInput;
```

### Dynamic Queries Safely

```typescript
// Safe way to build dynamic queries
let query = DB.from("posts");

if (status) {
  query = query.where("status", status);
}

if (userId) {
  query = query.where("user_id", userId);
}

const posts = await query.orderBy("created_at", "desc");
```

---

## XSS Prevention

### Template Auto-Escaping

Both Squirrelly and Svelte auto-escape by default:

```html
<!-- Squirrelly - Auto-escaped -->
<p>{{it.userInput}}</p>

<!-- Svelte - Auto-escaped -->
<p>{userInput}</p>
```

### Avoid Raw HTML

```html
<!-- DANGEROUS - Only use with trusted content -->
<p>{@html userInput}</p>

<!-- If you must use raw HTML, sanitize first -->
<script>
  import DOMPurify from 'dompurify';
  const sanitized = DOMPurify.sanitize(userInput);
</script>
<p>{@html sanitized}</p>
```

### Content Security Policy

```typescript
// Add CSP headers
webserver.use((request, response, next) => {
  response.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});
```

---

## CSRF Protection

### Use SameSite Cookies

```typescript
response.cookie("auth_id", token, {
  maxAge: 1000 * 60 * 60 * 24 * 60,  // 60 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'  // CSRF protection
});
```

### Verify Origin for Mutations

```typescript
public async store(request: Request, response: Response) {
  const origin = request.header('origin');
  const allowedOrigins = [process.env.APP_URL];
  
  if (!allowedOrigins.includes(origin)) {
    return response.status(403).json({ error: "Invalid origin" });
  }
  
  // Process request...
}
```

---

## Rate Limiting

### Protect Sensitive Endpoints

```typescript
import {
  authRateLimit,         // 5 req/min
  createAccountRateLimit, // 3 req/hour
  passwordResetRateLimit, // 3 req/hour
  uploadRateLimit         // 50 req/hour
} from "../app/middlewares/rateLimit";

// Authentication
Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);

// Password reset
Route.post("/forgot-password", [passwordResetRateLimit], PasswordController.sendResetPassword);

// File uploads
Route.post("/api/upload", [Auth, uploadRateLimit], UploadController.store);
```

### Custom Rate Limits

```typescript
import { rateLimit } from "../app/middlewares/rateLimit";

const searchRateLimit = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  maxRequests: 30,
  message: "Too many search requests"
});

Route.get("/api/search", [searchRateLimit], SearchController.search);
```

---

## Environment Variables

### Never Commit Secrets

```gitignore
# .gitignore
.env
.env.local
.env.production
```

### Use .env.example

```env
# .env.example (committed)
DB_CONNECTION=development
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
WASABI_ACCESS_KEY=
WASABI_SECRET_KEY=
```

### Validate Required Variables

```typescript
// config/validate.ts
const required = [
  'DB_CONNECTION',
  'APP_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

---

## CORS Configuration

### Production Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Inertia']
};

webserver.use(cors(corsOptions));
```

---

## Security Checklist

### Authentication
- [ ] Use PBKDF2 with 100,000+ iterations
- [ ] Enforce password complexity
- [ ] Implement account lockout after failed attempts
- [ ] Use secure session tokens (UUID v4)
- [ ] Set HttpOnly and Secure cookie flags

### Input/Output
- [ ] Validate all user input
- [ ] Use parameterized queries
- [ ] Auto-escape template output
- [ ] Sanitize any raw HTML

### Network
- [ ] Use HTTPS in production
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Add security headers

### Data
- [ ] Never commit secrets
- [ ] Encrypt sensitive data
- [ ] Implement proper access control
- [ ] Log security events

---

## Next Steps

- [Performance Guide](09b-PERFORMANCE.md)
- [Best Practices](09-BEST-PRACTICES.md)
- [Deployment Guide](08-DEPLOYMENT.md)
