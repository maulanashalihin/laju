"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const SQLite_1 = __importDefault(require("./app/services/SQLite"));
const S3_1 = require("./app/services/S3");
require("dotenv").config();
const RETENTION_DAYS = Number(process.env.BACKUP_RETENTION_DAYS || 30);
async function main() {
    const now = Date.now();
    const thresholdMs = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const thresholdStr = (0, dayjs_1.default)(thresholdMs).format("YYYY-MM-DDTHH:mm");
    console.log(`Menjalankan clean-backup: hapus backup sebelum ${thresholdStr} (>${RETENTION_DAYS} hari)`);
    const rows = SQLite_1.default.all("SELECT id, key, uploaded_at FROM backup_files WHERE deleted_at IS NULL AND uploaded_at < ? ORDER BY uploaded_at ASC", [thresholdMs]);
    if (!rows || rows.length === 0) {
        console.log("Tidak ada backup yang perlu dihapus.");
        return;
    }
    let success = 0;
    let failed = 0;
    for (const row of rows) {
        const ts = (0, dayjs_1.default)(row.uploaded_at).format("YYYY-MM-DDTHH:mm");
        try {
            const present = await (0, S3_1.exists)(row.key);
            if (present) {
                await (0, S3_1.deleteObject)(row.key);
                console.log(`S3: Berhasil menghapus objek: ${row.key}`);
            }
            else {
                console.warn(`S3: Objek tidak ditemukan, menandai metadata sebagai deleted: ${row.key}`);
            }
            SQLite_1.default.run("UPDATE backup_files SET deleted_at = ? WHERE id = ?", [Date.now(), row.id]);
            console.log(`DB: Menandai backup (uploaded ${ts}) sebagai deleted`);
            success++;
        }
        catch (err) {
            console.error(`Gagal menghapus backup ${row.key}:`, err);
            failed++;
        }
    }
    console.log(`Clean-backup selesai. Berhasil: ${success}, Gagal: ${failed}`);
}
main().catch((err) => {
    console.error("Clean-backup gagal:", err);
    process.exit(1);
});
//# sourceMappingURL=clean-backup.js.map