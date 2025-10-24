
import SQLiteService from './app/services/SQLite';
import dayjs from "dayjs";
import { basename, join } from "path";
import { existsSync, mkdirSync, createReadStream, createWriteStream, statSync } from "fs";
import { unlink } from "fs/promises";
import { createGzip } from "zlib";
import { pipeline } from "stream";
import { promisify } from "util";
import { uploadBufferSecure } from "./app/services/S3";
import { v4 as uuidv4 } from "uuid";
import { randomBytes, createCipheriv, createHash } from "crypto";

require("dotenv").config();

const backupDir = join(__dirname, 'backups'); 
const db = SQLiteService.getDatabase();

// Ensure backup directory exists
if (!existsSync(backupDir)) {
  mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

const dbFilename = basename(db.name);
const pipe = promisify(pipeline);

// Derive 32-byte encryption key from env
function getEncryptionKey(): Buffer {
  const raw = process.env.BACKUP_ENCRYPTION_KEY || '';
  if (!raw) throw new Error('BACKUP_ENCRYPTION_KEY is not set');
  const tryBase64 = Buffer.from(raw, 'base64');
  if (tryBase64.length === 32) return tryBase64;
  const tryHex = Buffer.from(raw, 'hex');
  if (tryHex.length === 32) return tryHex;
  const asUtf8 = Buffer.from(raw, 'utf8');
  if (asUtf8.length === 32) return asUtf8;
  throw new Error('BACKUP_ENCRYPTION_KEY must be 32 bytes (base64/hex/utf8)');
}

async function md5File(filePath: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const hash = createHash('md5');
    const stream = createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

(async()=>{
  try {
    const timestamp = dayjs().format('YYYY-MM-DDTHH:mm');

    // Create raw backup file first
    const rawBackupFilename = `${dbFilename}-${timestamp}.db`;
    const rawBackupPath = join(backupDir, rawBackupFilename);
    await db.backup(rawBackupPath);
    console.log(`Backup completed: ${rawBackupPath}`);

    // Compress the backup to reduce transfer size
    const compressedFilename = `${dbFilename}-${timestamp}.db.gz`;
    const compressedPath = join(backupDir, compressedFilename);
    const gzip = createGzip();
    await pipe(createReadStream(rawBackupPath), gzip, createWriteStream(compressedPath));
    console.log(`Compressed backup: ${compressedPath}`);

    // Encrypt compressed backup with AES-256-GCM
    const encryptedFilename = `${dbFilename}-${timestamp}-${uuidv4()}.db.gz.enc`;
    const encryptedPath = join(backupDir, encryptedFilename);
    const encKey = getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', encKey, iv);
    await pipe(createReadStream(compressedPath), cipher, createWriteStream(encryptedPath));
    const authTag = cipher.getAuthTag();
    console.log(`Encrypted backup: ${encryptedPath}`);

    // Compute checksum via streaming BEFORE upload for S3 metadata
    const checksum = await md5File(encryptedPath);

    // Upload encrypted backup to S3 (Wasabi) with private ACL and optional SSE using stream, including encryption metadata
    const key = `backups/${encryptedFilename}`;
    const stats = statSync(encryptedPath);
    await uploadBufferSecure(
      key,
      createReadStream(encryptedPath),
      'application/octet-stream',
      stats.size,
      {
        algo: 'aes-256-gcm',
        iv: iv.toString('base64'),
        tag: authTag.toString('base64'),
        comp: 'gzip',
        checksum: checksum,
      }
    );
    console.log(`Uploaded encrypted backup to S3 with key: ${key}`);

    // Record backup metadata using native SQLiteService
    try {
      SQLiteService.run(
        "INSERT INTO backup_files (id, key, file_name, file_size, compression, storage, checksum, uploaded_at, deleted_at, encryption, enc_iv, enc_tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          uuidv4(),
          key,
          encryptedFilename,
          stats.size,
          'gzip',
          's3',
          checksum,
          Date.now(),
          null,
          'aes-256-gcm',
          iv.toString('base64'),
          authTag.toString('base64'),
        ]
      );
      console.log(`Recorded backup metadata for key: ${key}`);
    } catch (e) {
      console.warn('Failed to record backup metadata:', e);
    }

    // Clean up local backup files after successful upload
    await unlink(rawBackupPath).catch(() => {});
    await unlink(compressedPath).catch(() => {});
    await unlink(encryptedPath).catch(() => {});
    console.log(`Cleaned up local backups in: ${backupDir}`);
  } catch (err) {
    console.error('Backup process failed:', err);
  }
})()