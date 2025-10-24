import dayjs from "dayjs";
import { join } from "path";
import { existsSync, mkdirSync, createWriteStream } from "fs";
import { createGunzip } from "zlib";
import { pipeline } from "stream";
import { promisify } from "util";
import { getObject, headObject } from "./app/services/S3";
import SQLiteService from "./app/services/SQLite";
import { createDecipheriv } from "crypto";

require("dotenv").config();

const pipe = promisify(pipeline);

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

async function main() {
  const argv = process.argv.slice(2);
  const argKeyIdx = argv.indexOf('--key');
  const providedKey = argKeyIdx !== -1 ? argv[argKeyIdx + 1] : undefined;

  // Try to fetch metadata from backup_files
  let meta: any = undefined;
  try {
    meta = providedKey
      ? SQLiteService.get("SELECT * FROM backup_files WHERE key = ? LIMIT 1", [providedKey])
      : SQLiteService.get("SELECT * FROM backup_files WHERE deleted_at IS NULL ORDER BY uploaded_at DESC LIMIT 1");
  } catch (_err) {
    // DB might be inaccessible; we'll fallback to S3 metadata below if --key provided
    meta = undefined;
  }

  let keyToRestore = providedKey || (meta ? meta.key : undefined);
  if (!keyToRestore) {
    throw new Error('Tidak bisa menentukan key backup. Jika DB tidak bisa diakses, jalankan: node build/restore.js --key backups/<file>.db.gz.enc');
  }

  let ivBase64: string | undefined = meta?.enc_iv;
  let tagBase64: string | undefined = meta?.enc_tag;
  let uploadedAtMs: number = meta?.uploaded_at || Date.now();

  // Fallback: read IV/tag from S3 object metadata if missing or DB not accessible
  if (!ivBase64 || !tagBase64) {
    const head = await headObject(keyToRestore);
    const md = (head as any).Metadata || {};
    ivBase64 = md.iv || md.IV || ivBase64;
    tagBase64 = md.tag || md.TAG || tagBase64;
    // Optional: algo/md5/comp can be read if needed: md.algo, md.checksum, md.comp
    if (!ivBase64 || !tagBase64) {
      throw new Error('IV/tag tidak ditemukan. Pastikan metadata S3 memiliki iv/tag atau pulihkan akses ke tabel backup_files.');
    }
  }

  const keyBuf = getEncryptionKey();
  const ivBuf = Buffer.from(ivBase64, 'base64');
  const tagBuf = Buffer.from(tagBase64, 'base64');

  const backupsDir = join(__dirname, 'backups');
  if (!existsSync(backupsDir)) mkdirSync(backupsDir, { recursive: true });

  const timestamp = dayjs(uploadedAtMs).format('YYYY-MM-DDTHH:mm');
  const outFile = join(backupsDir, `restored-${timestamp}.db`);

  console.log(`Restoring backup from key: ${keyToRestore}`);

  const s3Obj = await getObject(keyToRestore);
  const bodyStream: any = (s3Obj as any).Body; // Node.js Readable stream
  if (!bodyStream || typeof bodyStream.pipe !== 'function') {
    throw new Error('Invalid S3 object body stream.');
  }

  const decipher = createDecipheriv('aes-256-gcm', keyBuf, ivBuf);
  decipher.setAuthTag(tagBuf);
  const gunzip = createGunzip();

  await pipe(bodyStream, decipher, gunzip, createWriteStream(outFile));
  console.log(`Restored database written to: ${outFile}`);
  console.log('NOTE: To activate restore, stop your app and replace the current SQLite file with the restored .db.');
}

main().catch((err) => {
  console.error('Restore failed:', err);
  process.exit(1);
});