# Storage Guide

Complete guide for file storage in Laju framework with support for Local filesystem and S3.

## Table of Contents

1. [Overview](#overview)
2. [Choosing the Right Storage](#choosing-the-right-storage)
3. [Local Storage](#local-storage)
4. [S3 Storage](#s3-storage)
5. [Best Practices](#best-practices)

---

## Overview

Laju provides two separate storage services that can be used independently:
- **Local Storage** - Filesystem storage (free, no external dependencies)
- **S3 Storage** - Wasabi/S3 for production with presigned URLs

Both services are available and can be used simultaneously in your application.

---

## Choosing the Right Storage

### Comparison: LocalStorage vs S3 Storage

| Aspect | LocalStorage | S3 Storage |
|--------|-------------|------------|
| **Cost** | Free | Paid (Wasabi: ~$6/TB/month) |
| **Setup** | No configuration needed | Requires AWS/Wasabi credentials |
| **Performance** | Fast (local filesystem) | Fast (CDN integration) |
| **Scalability** | Limited by server disk | Unlimited |
| **Migration** | Difficult (files on server) | Easy (external storage) |
| **Security** | Server-level only | Encryption + IAM policies |
| **Backup** | Manual backup required | Built-in backup & versioning |
| **Multi-server** | Not supported | Supported (shared storage) |
| **Access Control** | Filesystem permissions | IAM policies |
| **Disaster Recovery** | Manual | Automatic |

### When to Use LocalStorage

**Pros:**
- **Free** - No monthly storage costs
- **Simple** - No external dependencies or credentials
- **Fast** - Direct filesystem access
- **Development-friendly** - Easy to test and debug
- **Complete control** - Files stay on your server
- **No network latency** - Files served locally

**Cons:**
- **Migration difficulty** - Files tied to server, hard to migrate
- **Scalability limits** - Limited by server disk space
- **Single point of failure** - Server failure = data loss
- **Manual backup** - Need to implement backup strategy
- **No built-in security** - Rely on server-level permissions
- **Not multi-server** - Can't share files across instances

**Best for:**
- Development and testing environments
- Small projects with limited budget
- Internal tools with sensitive data
- Applications with strict data residency requirements

### When to Use S3 Storage

**Pros:**
- **Easy migration** - Files external to server, easy server replacement
- **Highly scalable** - Unlimited storage capacity
- **Built-in security** - Encryption at rest, IAM policies
- **Automatic backup** - Versioning and disaster recovery
- **Multi-server support** - Shared storage across instances
- **CDN integration** - Fast global delivery
- **Presigned URLs** - Secure direct uploads from clients

**Cons:**
- **Cost** - Monthly storage fees (but affordable)
- **Setup required** - Need AWS/Wasabi credentials
- **Network dependency** - Requires internet access
- **Learning curve** - Need to understand S3 concepts

**Best for:**
- Production applications
- High-traffic sites
- Multi-server deployments
- Applications requiring easy migration
- Projects with global users (CDN)
- Applications needing built-in backup

### Recommendation Summary

**Use LocalStorage when:**
- You're in development or testing phase
- Budget is limited and project is small
- Data must stay on your server (compliance)
- You need complete control over files
- Single-server deployment

**Use S3 Storage when:**
- You're deploying to production
- You need easy server migration
- You have multiple servers
- You need built-in backup and security
- You want to scale horizontally
- You have global users (CDN benefits)

### Switching Between Storage

Both services have the same API, making it easy to switch:

```typescript
// For Local Storage (Development)
import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";

// For S3 Storage (Production)
import { getPublicUrl, uploadBuffer } from "app/services/S3";
```

Simply change the import in your controller to switch storage providers.

---

## Local Storage

Local storage uses the filesystem for file storage.

### Configuration

```env
LOCAL_STORAGE_PATH=./storage
LOCAL_STORAGE_PUBLIC_URL=/storage
```

### Local Storage Service Methods

```typescript
import {
  uploadBuffer,
  getPublicUrl,
  getObject,
  deleteObject,
  exists
} from "app/services/LocalStorage";

// Upload buffer directly
await uploadBuffer(
  'assets/photo.jpg',           // key
  buffer,                       // file buffer
  'image/jpeg',                 // content type
  'public, max-age=31536000'    // cache control (optional)
);

// Get public URL
const publicUrl = getPublicUrl('assets/photo.jpg');
// Returns: /storage/assets/photo.jpg

// Download file
const response = await getObject('assets/photo.jpg');
const stream = response.Body;

// Delete file
await deleteObject('assets/photo.jpg');

// Check if file exists
const fileExists = await exists('assets/photo.jpg');
```

---

## S3 Storage

S3 storage uses Wasabi/S3 with presigned URLs for secure uploads.

### Configuration

```env
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=https://cdn.example.com  # Optional
```

### S3 Service Methods

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

## Server Implementation

### UploadController

UploadController handles file uploads with two separate methods:

```typescript
// app/controllers/UploadController.ts
import { uuidv7 } from "uuidv7";
import { Response, Request } from "../../type";
import sharp from "sharp";
import DB from "../services/DB";
import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";

// Storage Service Selection:
// To switch between S3 and Local Storage, change the import above:
//
// Local Storage:
// import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";
//
// S3 Storage:
// import { getPublicUrl, uploadBuffer } from "app/services/S3";

class UploadController {
    /**
     * Upload Image with Processing
     * - Validates image type (JPEG, PNG, GIF, WebP)
     * - Processes with Sharp (resize, convert to WebP)
     * - Uploads to storage
     * - Saves metadata to database
     */
    public async uploadImage(request: Request, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const userId = request.user.id;
            let uploadedAsset: any = null;
            let isValidFile = true;
            let errorMessage = '';

            await request.multipart(async (field: unknown) => {
                if (field && typeof field === 'object' && 'file' in field && field.file) {
                    const multipartField = field as { 
                        name: string; 
                        mime_type: string;
                        file: { stream: NodeJS.ReadableStream; name: string } 
                    };

                    // Validate file type
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                    if (!allowedTypes.includes(multipartField.mime_type)) {
                        isValidFile = false;
                        errorMessage = `Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed. Got: ${multipartField.mime_type}`;
                        return;
                    }

                    // Generate unique filename
                    const id = uuidv7();
                    const fileName = `${id}.webp`;

                    // Convert stream to buffer
                    const chunks: Buffer[] = [];
                    const readable = multipartField.file.stream;

                    readable.on('data', (chunk: Buffer) => {
                        chunks.push(chunk);
                    });

                    readable.on('end', async () => {
                        const buffer = Buffer.concat(chunks);

                        try {
                            // Process image with Sharp
                            const processedBuffer = await sharp(buffer)
                                .webp({ quality: 80 })
                                .resize(1200, 1200, {
                                    fit: 'inside',
                                    withoutEnlargement: true
                                })
                                .toBuffer();

                            // Upload to storage
                            const storageKey = `assets/${fileName}`;
                            await uploadBuffer(storageKey, processedBuffer, 'image/webp');
                            const publicUrl = getPublicUrl(storageKey);

                            // Save to database
                            uploadedAsset = {
                                id,
                                type: 'image',
                                url: publicUrl,
                                mime_type: 'image/webp',
                                name: fileName,
                                size: processedBuffer.length,
                                user_id: userId,
                                storage_key: storageKey,
                                created_at: Date.now(),
                                updated_at: Date.now()
                            };

                            await DB.from("assets").insert(uploadedAsset);
                            response.json({ success: true, data: uploadedAsset });
                        } catch (err) {
                            response.status(500).json({ 
                                success: false, 
                                error: 'Error processing and uploading image' 
                            });
                        }
                    });
                }
            });

            if (!isValidFile) {
                return response.status(400).json({ 
                    success: false, 
                    error: errorMessage 
                });
            }

        } catch (error) {
            return response.status(500).json({ 
                success: false, 
                error: 'Internal server error' 
            });
        }
    }

    /**
     * Upload File (Non-Image)
     * - Validates file type (PDF, Word, Excel, Text, CSV)
     * - Uploads directly without processing
     * - Saves metadata to database
     */
    public async uploadFile(request: Request, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const userId = request.user.id;
            let uploadedAsset: any = null;
            let isValidFile = true;
            let errorMessage = '';

            await request.multipart(async (field: unknown) => {
                if (field && typeof field === 'object' && 'file' in field && field.file) {
                    const file = field.file as { stream: NodeJS.ReadableStream; mime_type: string; name: string };
                    
                    // Validate file type
                    const allowedTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'text/plain',
                        'text/csv'
                    ];
                    
                    if (!allowedTypes.includes(file.mime_type)) {
                        isValidFile = false;
                        errorMessage = 'Invalid file type. Allowed types: PDF, Word, Excel, Text, CSV';
                        return;
                    }

                    // Generate unique filename
                    const id = uuidv7();
                    const ext = file.name.split('.').pop();
                    const fileName = `${id}.${ext}`;

                    // Convert stream to buffer
                    const chunks: Buffer[] = [];
                    const readable = file.stream;

                    readable.on('data', (chunk: Buffer) => {
                        chunks.push(chunk);
                    });

                    readable.on('end', async () => {
                        const buffer = Buffer.concat(chunks);

                        try {
                            // Upload directly without processing
                            const storageKey = `files/${userId}/${fileName}`;
                            await uploadBuffer(storageKey, buffer, file.mime_type);
                            const publicUrl = getPublicUrl(storageKey);

                            // Save to database
                            uploadedAsset = {
                                id,
                                type: 'file',
                                url: publicUrl,
                                mime_type: file.mime_type,
                                name: file.name,
                                size: buffer.length,
                                user_id: userId,
                                storage_key: storageKey,
                                created_at: Date.now(),
                                updated_at: Date.now()
                            };

                            await DB.from("assets").insert(uploadedAsset);
                            response.json({ success: true, data: uploadedAsset });
                        } catch (err) {
                            response.status(500).json({ 
                                success: false, 
                                error: 'Error uploading file' 
                            });
                        }
                    });
                }
            });

            if (!isValidFile) {
                return response.status(400).json({ 
                    success: false, 
                    error: errorMessage 
                });
            }

        } catch (error) {
            return response.status(500).json({ 
                success: false, 
                error: 'Internal server error' 
            });
        }
    }
}

export default new UploadController();
```

### Routes

```typescript
// routes/web.ts
import UploadController from "../app/controllers/UploadController";
import StorageController from "../app/controllers/StorageController";
import Auth from "../app/middlewares/auth";
import { uploadRateLimit } from "../app/middlewares/rateLimit";

// Upload routes
Route.post("/api/upload/image", [Auth, uploadRateLimit], UploadController.uploadImage);
Route.post("/api/upload/file", [Auth, uploadRateLimit], UploadController.uploadFile);

// Local storage route
Route.get("/storage/*", StorageController.serveFile);
```

### Choosing Storage Service

To switch between S3 and Local Storage, change the import in UploadController:

```typescript
// For Local Storage (Development)
import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";

// For S3 Storage (Production)
import { getPublicUrl, uploadBuffer } from "app/services/S3";
```

Both services have the same API, making it easy to switch between them without changing any other code.

### StorageController

StorageController serves static files from local storage with security features:

```typescript
// app/controllers/StorageController.ts
import { Response, Request } from "../../type";
import fs from "fs";
import path from "path";
import "dotenv/config";

const storagePath = process.env.LOCAL_STORAGE_PATH || "./storage";

class Controller {
    public async serveFile(request: Request, response: Response) {
        // Extract path after /storage/ from request.path
        const requestPath = request.path || "";
        const filePath = requestPath.startsWith("/storage/") 
            ? requestPath.substring("/storage/".length).replaceAll("%20", " ")
            : "";

        try {
            const fullPath = path.join(storagePath, filePath);

            // Security: Allowed file extensions
            const allowedExtensions = [
                '.ico', '.png', '.jpeg', '.jpg', '.gif', '.svg', '.webp',
                '.txt', '.pdf', '.css', '.js',
                '.woff', '.woff2', '.ttf', '.eot',
                '.mp4', '.webm', '.mp3', '.wav'
            ];

            if (!filePath.includes('.')) {
                return response.status(404).send('File not found');
            }

            if (!allowedExtensions.some(ext => filePath.toLowerCase().endsWith(ext))) {
                return response.status(403).send('File type not allowed');
            }

            if (!fs.existsSync(fullPath)) {
                return response.status(404).send('File not found');
            }

            // Set cache control for 1 year
            response.setHeader("Cache-Control", "public, max-age=31536000");

            // Set appropriate content type
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf',
                '.eot': 'application/vnd.ms-fontobject',
                '.pdf': 'application/pdf',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.txt': 'text/plain',
                '.ico': 'image/x-icon'
            };

            if (mimeTypes[ext]) {
                response.setHeader("Content-Type", mimeTypes[ext]);
            }

            return response.download(fullPath);
        } catch (error) {
            return response.status(500).send("Internal server error");
        }
    }
}

export default new Controller();
```

### Routes

```typescript
// routes/web.ts
import UploadController from "../app/controllers/UploadController";
import StorageController from "../app/controllers/StorageController";
import Auth from "../app/middlewares/auth";
import { uploadRateLimit } from "../app/middlewares/rateLimit";

// Upload routes
Route.post("/api/upload/image", [Auth, uploadRateLimit], UploadController.uploadImage);
Route.post("/api/upload/file", [Auth, uploadRateLimit], UploadController.uploadFile);

// Local storage route
Route.get("/storage/*", StorageController.serveFile);
```

### Choosing Storage Service

To switch between S3 and Local Storage, change the import in UploadController:

```typescript
// For Local Storage (Development)
import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";

// For S3 Storage (Production)
import { getPublicUrl, uploadBuffer } from "app/services/S3";
```

Both services have the same API, making it easy to switch between them without changing any other code.

---

## Client Implementation

### Upload Methods Comparison

There are two main approaches for uploading files:

#### 1. Server-Side Upload (LocalStorage)

**How it works:**
- Client sends file directly to server via FormData
- Server processes the file (resize, convert, etc.)
- Server uploads to storage
- Server returns the file URL

**Pros:**
- Simple to implement
- Server can process files (resize, convert formats)
- Better security (server validates everything)
- Consistent behavior across all clients

**Cons:**
- Higher server load (files pass through server)
- Slower for large files (upload to server, then to storage)
- Server needs more bandwidth

**Best for:**
- Image uploads that need processing
- Small to medium files
- Applications with strict security requirements
- Development and testing

#### 2. Presigned URL Upload (S3)

**How it works:**
- Client requests a presigned URL from server
- Server generates a temporary, signed URL for S3
- Client uploads file directly to S3 using the presigned URL
- Client notifies server when upload is complete

**Pros:**
- Reduced server load (files go directly to S3)
- Faster for large files (direct upload to S3 edge locations)
- Better performance (no server bottleneck)
- Scalable (handle unlimited concurrent uploads)

**Cons:**
- More complex implementation
- Client must handle upload errors
- No server-side file processing
- Requires S3/Wasabi setup

**Best for:**
- Large files (>10MB)
- High-volume uploads
- Production applications
- Applications with global users (CDN benefits)

### Svelte Component (LocalStorage Upload)

```svelte
<script>
  let uploading = $state(false);
  let imageUrl = $state('');

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    uploading = true;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data) {
        imageUrl = data.data.url;
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      uploading = false;
    }
  }
</script>

<input type="file" onchange={handleImageUpload} accept="image/*" disabled={uploading} />

{#if uploading}
  <p>Uploading...</p>
{/if}

{#if imageUrl}
  <img src={imageUrl} alt="Uploaded" class="w-32 h-32 object-cover" />
{/if}
```

### Svelte Component (File Upload)

```svelte
<script>
  let uploading = $state(false);
  let fileUrl = $state('');

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    uploading = true;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data) {
        fileUrl = data.data.url;
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      uploading = false;
    }
  }
</script>

<input type="file" onchange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" disabled={uploading} />

{#if uploading}
  <p>Uploading...</p>
{/if}

{#if fileUrl}
  <a href={fileUrl} download>Download File</a>
{/if}
```

### Vanilla JavaScript (LocalStorage Upload)

```javascript
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.success && data.data) {
    return data.data.url;
  } else {
    throw new Error(data.error || 'Upload failed');
  }
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload/file", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.success && data.data) {
    return data.data.url;
  } else {
    throw new Error(data.error || 'Upload failed');
  }
}
```

### Svelte Component (S3 Presigned URLs)

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

      // 4. Optional: Save to database
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'My Post',
          image: data.publicUrl
        })
      });

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

### Vanilla JavaScript (S3 Presigned URLs)

```javascript
async function uploadFile(file) {
  // 1. Get presigned URL
  const res = await fetch('/api/s3/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type
    })
  });

  const { data } = await res.json();

  // 2. Upload to S3
  await fetch(data.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });

  return data.publicUrl;
}
```

### Important Built-in Routes

#### Upload Routes

```typescript
// Upload Image
POST /api/upload/image
Body: multipart/form-data with "file" field
Response: { success: true, data: { id, url, ... } }
Allowed types: JPEG, PNG, GIF, WebP
Processing: Resize to 1200x1200, convert to WebP

// Upload File
POST /api/upload/file
Body: multipart/form-data with "file" field
Response: { success: true, data: { id, url, ... } }
Allowed types: PDF, Word, Excel, Text, CSV
Processing: None (direct upload)
```

#### S3 Presigned URL Routes

```typescript
// Get Presigned Upload URL
POST /api/s3/signed-url
Body: { filename, contentType }
Response: { signedUrl, publicUrl }
Purpose: Generate temporary signed URL for direct S3 upload
Expiration: 1 hour (3600 seconds)

// Get Public URL
GET /api/s3/public-url/:fileKey
Response: { publicUrl }
Purpose: Get public URL for a file already in S3

// Health Check
GET /api/s3/health
Response: { status: 'ok' }
Purpose: Check if S3 connection is working
```

#### Storage Routes

```typescript
// Serve Local Storage Files
GET /storage/*
Example: /storage/assets/019bbf56-89ba-70ae-ad90-6705056eb04c.webp
Response: File with proper Content-Type and Cache-Control
Security: Only allowed file extensions
```
```

---

## Best Practices

### 1. Validate File Types

```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedTypes.includes(contentType)) {
  return response.status(400).json({ error: 'Invalid file type' });
}
```

### 2. Validate File Size

```typescript
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) {
  alert('File too large. Max 5MB');
  return;
}
```

### 3. Generate Unique Keys

```typescript
import { randomUUID } from "crypto";

const ext = filename.split('.').pop();
const key = `uploads/${userId}/${randomUUID()}.${ext}`;
```

### 4. Set Appropriate Expiry (S3 Only)

```typescript
// Short expiry for sensitive files
const signedUrl = await getSignedUploadUrl(key, contentType, 300); // 5 minutes

// Longer expiry for large files
const signedUrl = await getSignedUploadUrl(key, contentType, 3600); // 1 hour
```

### 5. Handle Upload Progress

```svelte
<script>
  let progress = $state(0);

  async function uploadWithProgress(file, signedUrl) {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        progress = (e.loaded / e.total) * 100;
      }
    });

    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => resolve());
      xhr.addEventListener('error', reject);
      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }
</script>

{#if progress > 0 && progress < 100}
  <div class="progress-bar">
    <div style="width: {progress}%"></div>
  </div>
{/if}
```

### 6. Image Optimization

```typescript
import sharp from 'sharp';

// Optimize before upload
const optimized = await sharp(buffer)
  .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 80 })
  .toBuffer();

await uploadBuffer(key, optimized, 'image/jpeg');
```

### 7. Security Considerations

```typescript
// Always validate file types on server
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(contentType)) {
  return response.status(400).json({ error: 'Invalid file type' });
}

// Use unique filenames to prevent overwrites
import { randomUUID } from "crypto";
const key = `uploads/${userId}/${randomUUID()}.${ext}`;

// For local storage, serve files with proper headers
// app/controllers/StorageController.ts handles this automatically
```

---

## Next Steps

- [Email Guide](06-EMAIL.md)
- [API Reference](07-API-REFERENCE.md)
- [Tutorials](11-TUTORIALS.md)
