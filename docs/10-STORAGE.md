# S3 Storage Guide

Complete guide for S3 storage and file uploads in Laju framework.

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [S3 Service Methods](#s3-service-methods)
4. [Presigned URL Uploads](#presigned-url-uploads)
5. [Server Implementation](#server-implementation)
6. [Client Implementation](#client-implementation)
7. [Best Practices](#best-practices)

---

## Overview

Laju uses Wasabi/S3 for file storage with presigned URLs for secure uploads.

### Why Presigned URLs?

- **Reduced server load** - Files go directly to S3, not through your server
- **Better performance** - Direct upload to S3 edge locations
- **Secure** - Time-limited, signed URLs
- **Scalable** - Handle unlimited concurrent uploads

---

## Configuration

```env
# .env
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=https://cdn.example.com  # Optional
```

---

## S3 Service Methods

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

Recommended approach for file uploads.

### Flow

1. Client requests presigned URL from server
2. Server generates time-limited signed URL
3. Client uploads file directly to S3 using signed URL
4. Client saves public URL to database

---

## Server Implementation

### Controller

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

---

## Client Implementation

### Svelte Component

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

### Vanilla JavaScript

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

### 4. Set Appropriate Expiry

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

---

## Next Steps

- [Email Guide](06-EMAIL.md)
- [API Reference](07-API-REFERENCE.md)
- [Tutorials](11-TUTORIALS.md)
