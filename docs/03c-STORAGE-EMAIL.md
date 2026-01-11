# Storage & Email Guide

Complete guide for S3 storage and email services in Laju framework.

## Table of Contents

1. [S3 Storage Service](#s3-storage-service)
2. [Presigned URL Uploads](#presigned-url-uploads)
3. [Email Services](#email-services)
4. [View Service (Templates)](#view-service)
5. [Logging Service](#logging-service)
6. [Redis Cache](#redis-cache)

---

## S3 Storage Service

Laju uses Wasabi/S3 for file storage with presigned URLs for secure uploads.

### Configuration

```env
# .env
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=https://cdn.example.com  # Optional
```

### Methods

```typescript
import { 
  uploadBuffer, 
  getSignedUploadUrl, 
  getPublicUrl,
  getObject,
  deleteObject,
  exists
} from "app/services/S3";

// Upload buffer directly
await uploadBuffer(
  'assets/photo.jpg',           // key
  buffer,                       // file buffer
  'image/jpeg',                 // content type
  'public, max-age=31536000'    // cache control (optional)
);

// Generate presigned upload URL
const signedUrl = await getSignedUploadUrl(
  'assets/photo.jpg',           // key
  'image/jpeg',                 // content type
  3600                          // expiration in seconds
);

// Get public URL
const publicUrl = getPublicUrl('assets/photo.jpg');
// Returns: https://cdn.example.com/laju-dev/assets/photo.jpg

// Download file
const response = await getObject('assets/photo.jpg');
const stream = response.Body;

// Delete file
await deleteObject('assets/photo.jpg');

// Check if file exists
const fileExists = await exists('assets/photo.jpg');
```

---

## Presigned URL Uploads

Recommended approach for file uploads - files go directly to S3.

### Benefits

- **Reduced server load** - No file proxy through your server
- **Better performance** - Direct upload to S3
- **Secure** - Time-limited, signed URLs
- **Scalable** - Handle unlimited concurrent uploads

### Server Controller

```typescript
// app/controllers/S3Controller.ts
import { Request, Response } from "../../type";
import { getSignedUploadUrl, getPublicUrl } from "../services/S3";
import { randomUUID } from "crypto";

class S3Controller {
  public async getSignedUrl(request: Request, response: Response) {
    const { filename, contentType } = await request.json();
    
    // Validate content type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(contentType)) {
      return response.status(400).json({ error: 'Invalid file type' });
    }
    
    // Generate unique key
    const ext = filename.split('.').pop();
    const key = `uploads/${request.user.id}/${randomUUID()}.${ext}`;
    
    // Generate presigned URL (1 hour expiry)
    const signedUrl = await getSignedUploadUrl(key, contentType, 3600);
    const publicUrl = getPublicUrl(key);
    
    return response.json({
      success: true,
      data: {
        signedUrl,
        publicUrl,
        fileKey: key,
        expiresIn: 3600
      }
    });
  }

  public async getPublicUrl(request: Request, response: Response) {
    const { fileKey } = request.params;
    const publicUrl = getPublicUrl(fileKey);
    return response.json({ success: true, data: { publicUrl } });
  }
}

export default new S3Controller();
```

### Routes

```typescript
import S3Controller from "../app/controllers/S3Controller";
import Auth from "../app/middlewares/auth";
import { uploadRateLimit } from "../app/middlewares/rateLimit";

Route.post("/api/s3/signed-url", [Auth, uploadRateLimit], S3Controller.getSignedUrl);
Route.get("/api/s3/public-url/:fileKey", S3Controller.getPublicUrl);
```

### Client Upload (Svelte)

```svelte
<script>
  let uploading = $state(false);
  let imageUrl = $state('');
  
  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    uploading = true;
    
    try {
      // 1. Get presigned URL from server
      const res = await fetch('/api/s3/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });
      
      const { data } = await res.json();
      
      // 2. Upload directly to S3
      await fetch(data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
      
      // 3. Save public URL
      imageUrl = data.publicUrl;
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      uploading = false;
    }
  }
</script>

<input type="file" onchange={handleFileSelect} accept="image/*" disabled={uploading} />

{#if uploading}
  <p>Uploading...</p>
{/if}

{#if imageUrl}
  <img src={imageUrl} alt="Uploaded" class="w-32 h-32 object-cover" />
{/if}
```

---

## Email Services

Laju provides two email services with the same interface.

### Nodemailer (SMTP)

```env
# .env
USER_MAILER=your.email@gmail.com
PASS_MAILER=your-app-password
```

**Gmail Setup:**
1. Enable 2-Step Verification
2. Go to Security → App passwords
3. Generate password for "Mail"
4. Use 16-character password in `.env`

```typescript
import { MailTo } from "app/services/Mailer";

await MailTo({
  to: "user@example.com",
  subject: "Welcome!",
  text: "Thank you for signing up..."
});
```

### Resend (API)

```env
# .env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

```typescript
import { MailTo } from "app/services/Resend";

await MailTo({
  to: "user@example.com",
  subject: "Welcome!",
  text: "Thank you for signing up..."
});
```

### Switching Providers

Both use the same interface:

```typescript
// Just change the import
import { MailTo } from "app/services/Mailer";  // SMTP
import { MailTo } from "app/services/Resend";  // API

// Same usage
await MailTo({ to, subject, text });
```

### Email Templates

```typescript
const resetLink = `${process.env.APP_URL}/reset-password/${token}`;

await MailTo({
  to: user.email,
  subject: "Reset Your Password",
  text: `
You requested a password reset.

Click here to reset: ${resetLink}

This link expires in 24 hours.

If you didn't request this, ignore this email.
  `.trim()
});
```

---

## View Service

Squirrelly template engine for server-side HTML rendering.

### Template Syntax

```html
<!-- resources/views/email.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{it.title}}</title>
</head>
<body>
  <h1>Hello, {{it.name}}!</h1>
  
  <!-- Conditional -->
  {{@if(it.isAdmin)}}
    <p>You have admin access.</p>
  {{#else}}
    <p>Standard user.</p>
  {{/if}}
  
  <!-- Loop -->
  {{@each(it.items) => item}}
    <div>{{item.name}} - ${{item.price}}</div>
  {{/each}}
  
  <!-- Include partial -->
  {{@include("partials/footer.html") /}}
</body>
</html>
```

### Usage

```typescript
import { view } from "app/services/View";

const html = view("email.html", {
  title: "Order Confirmation",
  name: "John",
  isAdmin: false,
  items: [
    { name: "Product 1", price: 29.99 },
    { name: "Product 2", price: 49.99 }
  ]
});

response.type("html").send(html);
```

### Hot Reload

In development, templates auto-reload when changed. No server restart needed.

---

## Logging Service

Winston-based logging with file output.

### Usage

```typescript
import { logInfo, logError, logWarn } from "app/services/Logger";

// Info logs
logInfo("User logged in", { userId: 123, ip: "192.168.1.1" });

// Error logs
logError("Database connection failed", { error: err.message });

// Warning logs
logWarn("Rate limit exceeded", { ip: request.ip });
```

### Log Levels

```env
# .env
LOG_LEVEL=info   # production
LOG_LEVEL=debug  # development
```

| Level | Priority | Use Case |
|-------|----------|----------|
| error | 0 | Errors, exceptions |
| warn | 1 | Warnings, deprecations |
| info | 2 | General info, events |
| debug | 5 | Debug information |

### Log Files

Logs are stored in `logs/` directory with daily rotation.

---

## Redis Cache

Optional Redis caching for improved performance.

### Configuration

```env
# .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional
```

### Basic Usage

```typescript
import Redis from "app/services/Redis";

// Set cache (with 1 hour expiry)
await Redis.set("user:123", JSON.stringify(user), "EX", 3600);

// Get cache
const cached = await Redis.get("user:123");
const user = cached ? JSON.parse(cached) : null;

// Delete cache
await Redis.del("user:123");

// Check exists
const exists = await Redis.exists("user:123");

// Increment counter
await Redis.incr("page:views");
```

### Cache-Aside Pattern

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
    await Redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600);
  }
  
  return user;
}
```

### Cache Invalidation

```typescript
// After user update
await DB.table("users").where("id", id).update({ name: "New Name" });
await Redis.del(`user:${id}`);  // Invalidate cache
```

---

## Rate Limiting

Built-in rate limiting for API protection.

### Predefined Limits

```typescript
import {
  authRateLimit,        // 5 req/min - login, register
  apiRateLimit,         // 100 req/15min - general API
  passwordResetRateLimit, // 3 req/hour - password reset
  createAccountRateLimit, // 3 req/hour - registration
  uploadRateLimit       // 50 req/hour - file uploads
} from "../app/middlewares/rateLimit";
```

### Usage

```typescript
Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.post("/api/s3/signed-url", [Auth, uploadRateLimit], S3Controller.getSignedUrl);
```

### Custom Rate Limit

```typescript
import { rateLimit } from "../app/middlewares/rateLimit";

const customLimit = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 10,
  message: "Too many requests"
});

Route.get("/api/search", [customLimit], SearchController.search);
```

---

## Next Steps

- [API Reference](04-API-REFERENCE.md)
- [Best Practices](06-BEST-PRACTICES.md)
- [Tutorials](08-TUTORIALS.md)
