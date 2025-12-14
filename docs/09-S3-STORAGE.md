# S3 Storage & File Upload

Guide for implementing file uploads using presigned URLs with S3-compatible storage (AWS S3, Wasabi, R2).

## Overview

Laju uses presigned URLs for file uploads. This approach:
- Reduces server load (files go directly to S3)
- Maintains security (URLs expire after a set time)
- Supports large file uploads without server memory issues

## Prerequisites

Set up S3/Wasabi credentials in `.env`:

```env
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com
CDN_URL=https://your-cdn.com  # Optional: for CDN in front of bucket
```

Ensure bucket policy allows public read access if you want files accessible via `publicUrl`.

## Server Endpoint

### Generate Signed URL

**Path:** `POST /api/s3/signed-url` (protected by Auth middleware)

**Request Body:**
```json
{
  "filename": "1699999999999-photo.jpg",
  "contentType": "image/jpeg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signedUrl": "https://...presigned-url...",
    "publicUrl": "https://cdn-or-endpoint/bucket/assets/1699999999999-photo.jpg",
    "fileKey": "assets/1699999999999-photo.jpg",
    "bucket": "laju-dev",
    "expiresIn": 3600
  }
}
```

## Client-Side Upload

### Vanilla JavaScript

```js
async function uploadToS3(file) {
  const filename = `${Date.now()}-${file.name}`;
  const payload = { filename, contentType: file.type };

  // 1) Request signed URL from server
  const res = await fetch('/api/s3/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to get signed URL');
  const { data } = await res.json();

  // 2) Upload directly to S3/Wasabi via PUT
  const put = await fetch(data.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });
  if (!put.ok) throw new Error('Upload failed');

  // 3) Return public URL for saving to DB
  return { 
    publicUrl: data.publicUrl, 
    fileKey: data.fileKey, 
    bucket: data.bucket 
  };
}
```

### Svelte Component

```svelte
<script>
  let isUploading = $state(false);
  let uploadedUrl = $state('');

  async function handleFile(file) {
    if (!file) return;
    
    isUploading = true;
    try {
      const { publicUrl } = await uploadToS3(file);
      uploadedUrl = publicUrl;
      // Save publicUrl to your database as needed
    } catch (e) {
      alert(e.message);
    } finally {
      isUploading = false;
    }
  }
</script>

<input 
  type="file" 
  onchange={(e) => handleFile(e.target.files?.[0])} 
  disabled={isUploading}
/>

{#if isUploading}
  <p>Uploading...</p>
{/if}

{#if uploadedUrl}
  <img src={uploadedUrl} alt="Uploaded file" class="mt-4 max-w-md" />
{/if}
```

## Additional Endpoints

### Get Public URL from FileKey

If you store the `fileKey` in your database, you can retrieve the public URL:

**Path:** `GET /api/s3/public-url/:fileKey`

**Example:** `GET /api/s3/public-url/assets/1699999999999-photo.jpg`

### Health Check

**Path:** `GET /api/s3/health`

Returns bucket, endpoint, and region info for configuration verification.

## Important Notes

1. **Expiration**: Signed URLs expire after `expiresIn` seconds (default: 3600 = 1 hour)

2. **ACL**: Upload via signed URL does not set ACL. Configure bucket/CDN for public read access.

3. **Public URL**: Built from `CDN_URL` (if set) or `WASABI_ENDPOINT` + `bucket` + `key`

4. **File Size**: For large files, consider multipart uploads (not covered here)

5. **Security**: Always validate file types and sizes on the server before generating signed URLs

## Storage Service API

```typescript
import { getSignedUploadUrl, getPublicUrl } from "app/services/Storage";

// Generate presigned upload URL
const signedUrl = await getSignedUploadUrl(
  "assets/photo.jpg",  // key
  "image/jpeg",        // contentType
  3600                 // expiresIn (seconds)
);

// Get public URL for a key
const publicUrl = getPublicUrl("assets/photo.jpg");
```
