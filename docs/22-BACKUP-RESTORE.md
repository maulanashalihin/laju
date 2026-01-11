# Backup & Restore Database

Guide for automated SQLite database backups with encryption and S3 storage.

## Overview

Laju provides three utility scripts for database management:
- `backup.ts` — Creates SQLite backup, compresses with Gzip, encrypts with AES-256-GCM, uploads to S3
- `restore.ts` — Downloads encrypted backup from S3, decrypts, decompresses, restores database
- `clean-backup.ts` — Removes old backups based on retention policy

## Prerequisites

### Environment Variables

```env
# S3/Wasabi credentials (same as storage)
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=laju-dev
WASABI_REGION=ap-southeast-1
WASABI_ENDPOINT=https://s3.ap-southeast-1.wasabisys.com

# Encryption key (must be 32 bytes)
# Base64 example:
BACKUP_ENCRYPTION_KEY=3q2+7wAAAAAAAAAAAAAAAAAAAA==
# Or Hex example:
BACKUP_ENCRYPTION_KEY=00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff

# Retention policy (optional, default: 30 days)
BACKUP_RETENTION_DAYS=30
```

### Database Table

Create the `backup_files` table for metadata:

```bash
npx knex migrate:make create_backup_files_table
```

Migration content:

```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("backup_files", (table) => {
    table.string("id").primary();
    table.string("key").notNullable().unique();
    table.string("file_name").notNullable();
    table.bigInteger("file_size").notNullable();
    table.string("compression").notNullable();
    table.string("storage").notNullable();
    table.string("checksum").notNullable();
    table.bigInteger("uploaded_at").notNullable();
    table.bigInteger("deleted_at").nullable();
    table.string("encryption").notNullable();
    table.string("enc_iv").notNullable();
    table.string("enc_tag").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("backup_files");
}
```

Run migration:

```bash
npx knex migrate:latest
```

## Usage

### 1. Build First

Scripts must be compiled before running:

```bash
npm run build
```

### 2. Create Backup

```bash
node build/backup.js
```

This will:
- Create SQLite backup
- Compress with Gzip
- Encrypt with AES-256-GCM
- Upload to S3
- Save metadata to `backup_files` table
- Clean up local temporary files

### 3. Restore Backup

Restore latest backup:

```bash
node build/restore.js
```

Restore specific backup by key:

```bash
node build/restore.js --key backups/2025-01-10T23:33-<uuid>.db.gz.enc
```

Restored file location: `build/backups/restored-YYYY-MM-DDTHH:mm.db`

**To activate restored database:**
1. Stop the application
2. Replace active SQLite file with restored file
3. Restart the application

### 4. Clean Old Backups

Remove backups older than retention period:

```bash
node build/clean-backup.js
```

This will:
- Mark `deleted_at` in `backup_files` table
- Delete objects from S3

## Automation with Cron

### Daily Backup at 01:00

```bash
0 1 * * * cd /path/to/app/build && node backup.js >> /var/log/laju-backup.log 2>&1
```

### Weekly Cleanup on Sunday at 02:00

```bash
0 2 * * 0 cd /path/to/app/build && node clean-backup.js >> /var/log/laju-clean-backup.log 2>&1
```

## Metadata Schema

Each backup stores the following metadata:

| Field | Description |
|-------|-------------|
| `id` | UUID |
| `key` | S3 path (e.g., `backups/<file>.db.gz.enc`) |
| `file_name` | Original filename |
| `file_size` | Size in bytes |
| `compression` | `gzip` |
| `storage` | `s3` |
| `checksum` | MD5 hex |
| `uploaded_at` | Unix timestamp |
| `deleted_at` | Unix timestamp (null if active) |
| `encryption` | `aes-256-gcm` |
| `enc_iv` | Base64 encoded IV |
| `enc_tag` | Base64 encoded auth tag |

## Important Notes

1. **Encryption Key**: Must be consistent between backup and restore. Store securely!

2. **S3 Metadata**: IV and auth tag are also stored in S3 object metadata, allowing restore even if database is inaccessible.

3. **Bucket Policy**: Ensure S3 bucket allows upload of custom metadata.

4. **Testing**: Always test restore process before relying on backups in production.

5. **Monitoring**: Check backup logs regularly to ensure backups are completing successfully.
