"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SQLite_1 = __importDefault(require("./app/services/SQLite"));
const dayjs_1 = __importDefault(require("dayjs"));
const path_1 = require("path");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const util_1 = require("util");
const S3_1 = require("./app/services/S3");
const uuid_1 = require("uuid");
const crypto_1 = require("crypto");
require("dotenv").config();
const backupDir = (0, path_1.join)(__dirname, 'backups');
const db = SQLite_1.default.getDatabase();
if (!(0, fs_1.existsSync)(backupDir)) {
    (0, fs_1.mkdirSync)(backupDir, { recursive: true });
    console.log(`Created backup directory: ${backupDir}`);
}
const dbFilename = (0, path_1.basename)(db.name);
const pipe = (0, util_1.promisify)(stream_1.pipeline);
function getEncryptionKey() {
    const raw = process.env.BACKUP_ENCRYPTION_KEY || '';
    if (!raw)
        throw new Error('BACKUP_ENCRYPTION_KEY is not set');
    const tryBase64 = Buffer.from(raw, 'base64');
    if (tryBase64.length === 32)
        return tryBase64;
    const tryHex = Buffer.from(raw, 'hex');
    if (tryHex.length === 32)
        return tryHex;
    const asUtf8 = Buffer.from(raw, 'utf8');
    if (asUtf8.length === 32)
        return asUtf8;
    throw new Error('BACKUP_ENCRYPTION_KEY must be 32 bytes (base64/hex/utf8)');
}
async function md5File(filePath) {
    return await new Promise((resolve, reject) => {
        const hash = (0, crypto_1.createHash)('md5');
        const stream = (0, fs_1.createReadStream)(filePath);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}
(async () => {
    try {
        const timestamp = (0, dayjs_1.default)().format('YYYY-MM-DDTHH:mm');
        const rawBackupFilename = `${dbFilename}-${timestamp}.db`;
        const rawBackupPath = (0, path_1.join)(backupDir, rawBackupFilename);
        await db.backup(rawBackupPath);
        console.log(`Backup completed: ${rawBackupPath}`);
        const compressedFilename = `${dbFilename}-${timestamp}.db.gz`;
        const compressedPath = (0, path_1.join)(backupDir, compressedFilename);
        const gzip = (0, zlib_1.createGzip)();
        await pipe((0, fs_1.createReadStream)(rawBackupPath), gzip, (0, fs_1.createWriteStream)(compressedPath));
        console.log(`Compressed backup: ${compressedPath}`);
        const encryptedFilename = `${dbFilename}-${timestamp}-${(0, uuid_1.v4)()}.db.gz.enc`;
        const encryptedPath = (0, path_1.join)(backupDir, encryptedFilename);
        const encKey = getEncryptionKey();
        const iv = (0, crypto_1.randomBytes)(12);
        const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', encKey, iv);
        await pipe((0, fs_1.createReadStream)(compressedPath), cipher, (0, fs_1.createWriteStream)(encryptedPath));
        const authTag = cipher.getAuthTag();
        console.log(`Encrypted backup: ${encryptedPath}`);
        const checksum = await md5File(encryptedPath);
        const key = `backups/${encryptedFilename}`;
        const stats = (0, fs_1.statSync)(encryptedPath);
        await (0, S3_1.uploadBufferSecure)(key, (0, fs_1.createReadStream)(encryptedPath), 'application/octet-stream', stats.size, {
            algo: 'aes-256-gcm',
            iv: iv.toString('base64'),
            tag: authTag.toString('base64'),
            comp: 'gzip',
            checksum: checksum,
        });
        console.log(`Uploaded encrypted backup to S3 with key: ${key}`);
        try {
            SQLite_1.default.run("INSERT INTO backup_files (id, key, file_name, file_size, compression, storage, checksum, uploaded_at, deleted_at, encryption, enc_iv, enc_tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                (0, uuid_1.v4)(),
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
            ]);
            console.log(`Recorded backup metadata for key: ${key}`);
        }
        catch (e) {
            console.warn('Failed to record backup metadata:', e);
        }
        await (0, promises_1.unlink)(rawBackupPath).catch(() => { });
        await (0, promises_1.unlink)(compressedPath).catch(() => { });
        await (0, promises_1.unlink)(encryptedPath).catch(() => { });
        console.log(`Cleaned up local backups in: ${backupDir}`);
    }
    catch (err) {
        console.error('Backup process failed:', err);
    }
})();
//# sourceMappingURL=backup.js.map