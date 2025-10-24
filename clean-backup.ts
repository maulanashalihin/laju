import dayjs from "dayjs";
import SQLiteService from "./app/services/SQLite";
import { exists, deleteObject } from "./app/services/S3";

require("dotenv").config();

// Konfigurasi retensi di file (default 30 hari). Bisa dioverride via env BACKUP_RETENTION_DAYS.
const RETENTION_DAYS = Number(process.env.BACKUP_RETENTION_DAYS || 30);

async function main() {
  const now = Date.now();
  const thresholdMs = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const thresholdStr = dayjs(thresholdMs).format("YYYY-MM-DDTHH:mm");

  console.log(`Menjalankan clean-backup: hapus backup sebelum ${thresholdStr} (>${RETENTION_DAYS} hari)`);

  // Ambil daftar backup yang belum dihapus dan lebih tua dari threshold
  const rows = SQLiteService.all(
    "SELECT id, key, uploaded_at FROM backup_files WHERE deleted_at IS NULL AND uploaded_at < ? ORDER BY uploaded_at ASC",
    [thresholdMs]
  ) as Array<{ id: string; key: string; uploaded_at: number }>;

  if (!rows || rows.length === 0) {
    console.log("Tidak ada backup yang perlu dihapus.");
    return;
  }

  let success = 0;
  let failed = 0;

  for (const row of rows) {
    const ts = dayjs(row.uploaded_at).format("YYYY-MM-DDTHH:mm");
    try {
      // Cek apakah objek masih ada; jika tidak ada, tetap tandai metadata sebagai deleted
      const present = await exists(row.key);
      if (present) {
        await deleteObject(row.key);
        console.log(`S3: Berhasil menghapus objek: ${row.key}`);
      } else {
        console.warn(`S3: Objek tidak ditemukan, menandai metadata sebagai deleted: ${row.key}`);
      }

      // Update metadata: set deleted_at
      SQLiteService.run(
        "UPDATE backup_files SET deleted_at = ? WHERE id = ?",
        [Date.now(), row.id]
      );
      console.log(`DB: Menandai backup (uploaded ${ts}) sebagai deleted`);
      success++;
    } catch (err) {
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