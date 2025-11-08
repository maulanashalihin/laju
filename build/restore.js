"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const path_1 = require("path");
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const util_1 = require("util");
const S3_1 = require("./app/services/S3");
const SQLite_1 = __importDefault(require("./app/services/SQLite"));
const crypto_1 = require("crypto");
require("dotenv").config();
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
async function main() {
    const argv = process.argv.slice(2);
    const argKeyIdx = argv.indexOf('--key');
    const providedKey = argKeyIdx !== -1 ? argv[argKeyIdx + 1] : undefined;
    let meta = undefined;
    try {
        meta = providedKey
            ? SQLite_1.default.get("SELECT * FROM backup_files WHERE key = ? LIMIT 1", [providedKey])
            : SQLite_1.default.get("SELECT * FROM backup_files WHERE deleted_at IS NULL ORDER BY uploaded_at DESC LIMIT 1");
    }
    catch (_err) {
        meta = undefined;
    }
    let keyToRestore = providedKey || (meta ? meta.key : undefined);
    if (!keyToRestore) {
        throw new Error('Tidak bisa menentukan key backup. Jika DB tidak bisa diakses, jalankan: node build/restore.js --key backups/<file>.db.gz.enc');
    }
    let ivBase64 = meta?.enc_iv;
    let tagBase64 = meta?.enc_tag;
    let uploadedAtMs = meta?.uploaded_at || Date.now();
    if (!ivBase64 || !tagBase64) {
        const head = await (0, S3_1.headObject)(keyToRestore);
        const md = head.Metadata || {};
        ivBase64 = md.iv || md.IV || ivBase64;
        tagBase64 = md.tag || md.TAG || tagBase64;
        if (!ivBase64 || !tagBase64) {
            throw new Error('IV/tag tidak ditemukan. Pastikan metadata S3 memiliki iv/tag atau pulihkan akses ke tabel backup_files.');
        }
    }
    const keyBuf = getEncryptionKey();
    const ivBuf = Buffer.from(ivBase64, 'base64');
    const tagBuf = Buffer.from(tagBase64, 'base64');
    const backupsDir = (0, path_1.join)(__dirname, 'backups');
    if (!(0, fs_1.existsSync)(backupsDir))
        (0, fs_1.mkdirSync)(backupsDir, { recursive: true });
    const timestamp = (0, dayjs_1.default)(uploadedAtMs).format('YYYY-MM-DDTHH:mm');
    const outFile = (0, path_1.join)(backupsDir, `restored-${timestamp}.db`);
    console.log(`Restoring backup from key: ${keyToRestore}`);
    const s3Obj = await (0, S3_1.getObject)(keyToRestore);
    const bodyStream = s3Obj.Body;
    if (!bodyStream || typeof bodyStream.pipe !== 'function') {
        throw new Error('Invalid S3 object body stream.');
    }
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', keyBuf, ivBuf);
    decipher.setAuthTag(tagBuf);
    const gunzip = (0, zlib_1.createGunzip)();
    await pipe(bodyStream, decipher, gunzip, (0, fs_1.createWriteStream)(outFile));
    console.log(`Restored database written to: ${outFile}`);
    console.log('NOTE: To activate restore, stop your app and replace the current SQLite file with the restored .db.');
}
main().catch((err) => {
    console.error('Restore failed:', err);
    process.exit(1);
});
//# sourceMappingURL=restore.js.map