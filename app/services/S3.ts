import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommandInput, GetObjectCommandInput, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Readable } from 'stream';

require("dotenv").config();

const endpoint = process.env.WASABI_ENDPOINT;
const region = process.env.WASABI_REGION;
const bucket = process.env.WASABI_BUCKET as string;
const accessKeyId = process.env.WASABI_ACCESS_KEY as string;
const secretAccessKey = process.env.WASABI_SECRET_KEY as string;
const cdnUrl = process.env.CDN_URL;

if (!bucket || !accessKeyId || !secretAccessKey) {
  console.warn("S3 (Wasabi) env not fully set: WASABI_BUCKET, WASABI_ACCESS_KEY, WASABI_SECRET_KEY are required.");
}

export const s3Client = new S3Client({
  region: region,
  endpoint: endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadBuffer(key: string, body: Buffer, contentType?: string, cacheControl?: string): Promise<void> {
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType || "application/octet-stream",
    ACL: "public-read",
    CacheControl: cacheControl || "public, max-age=31536000",
  };

  await s3Client.send(new PutObjectCommand(params));
}

// Secure upload: private ACL, optional SSE for backups; supports Buffer or Node Readable stream, optional contentLength, and user metadata
export async function uploadBufferSecure(key: string, body: Buffer | Readable, contentType?: string, contentLength?: number, metadata?: Record<string, string>): Promise<void> {
  const useSSE = (process.env.BACKUP_SSE || "").toLowerCase() === "true" || (process.env.BACKUP_SSE || "") === "1";

  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType || "application/octet-stream",
    ACL: "private",
    ...(useSSE ? { ServerSideEncryption: "AES256" } : {}),
    ...(typeof contentLength === 'number' ? { ContentLength: contentLength } : {}),
    ...(metadata ? { Metadata: metadata } : {}),
  };

  await s3Client.send(new PutObjectCommand(params));
}

export async function getObject(key: string) {
  const params: GetObjectCommandInput = {
    Bucket: bucket,
    Key: key,
  };
  return s3Client.send(new GetObjectCommand(params));
}

export async function headObject(key: string) {
  return s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
}

export async function exists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (_err) {
    return false;
  }
}

export async function deleteObject(key: string): Promise<void> {
  await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

// Generate a presigned URL for uploading via PUT
export async function getSignedUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

export function getPublicUrl(key: string): string {
  if (cdnUrl) {
    return `${cdnUrl.replace(/\/$/, "")}/${bucket}/${key}`;
  }
  if (endpoint) {
    const base = endpoint.replace(/\/$/, "");
    return `${base}/${bucket}/${key}`;
  }
  return `https://s3.${region}.wasabisys.com/${bucket}/${key}`;
}