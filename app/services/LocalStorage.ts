import fs from "fs/promises";
import path from "path";
import "dotenv/config";

const storagePath = process.env.LOCAL_STORAGE_PATH || "./storage";
const publicUrl = process.env.LOCAL_STORAGE_PUBLIC_URL || "/storage";

async function ensureDir(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function uploadBuffer(key: string, body: Buffer, contentType?: string, _cacheControl?: string): Promise<void> {
  const filePath = path.join(storagePath, key);
  const dir = path.dirname(filePath);
  await ensureDir(dir);
  await fs.writeFile(filePath, body);
}

export async function getObject(key: string) {
  const filePath = path.join(storagePath, key);
  const buffer = await fs.readFile(filePath);
  return { Body: buffer };
}

export async function exists(key: string): Promise<boolean> {
  const filePath = path.join(storagePath, key);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function deleteObject(key: string): Promise<void> {
  const filePath = path.join(storagePath, key);
  await fs.unlink(filePath);
}

export function getPublicUrl(key: string): string {
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}
