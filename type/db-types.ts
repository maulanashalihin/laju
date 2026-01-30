/**
 * Database Types for Kysely
 * Define table schemas here for type-safe queries
 */

import type { Generated, Selectable, Insertable, Updateable, ColumnType } from 'kysely';

export interface UserTable {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  is_verified: number; // SQLite boolean as 0/1
  membership_date: number | null; // Unix timestamp
  is_admin: number; // SQLite boolean as 0/1
  password: string;
  remember_me_token: string | null;
  created_at: number;
  updated_at: number;
}

export interface SessionTable {
  id: string;
  user_id: string;
  user_agent: string | null;
  expires_at: string | null; // ISO string
}

export interface PasswordResetTokenTable {
  id: Generated<number>;
  email: string;
  token: string;
  created_at: ColumnType<string | null, string | undefined, never>; // ISO string
  expires_at: string; // ISO string
}

export interface EmailVerificationTokenTable {
  id: Generated<number>;
  user_id: string;
  token: string;
  created_at: ColumnType<string | null, string | undefined, never>; // ISO string
  expires_at: string; // ISO string
}

export interface AssetTable {
  id: string;
  name: string | null;
  type: string;
  url: string;
  mime_type: string | null;
  size: number | null;
  storage_key: string | null;
  user_id: string | null;
  created_at: ColumnType<string | null, string | undefined, never>; // ISO string
  updated_at: ColumnType<string | null, string | undefined, never>; // ISO string
}

export interface BackupFileTable {
  id: Generated<number>;
  filename: string;
  path: string;
  size: number;
  created_at: number;
}

export interface CacheTable {
  key: string;
  value: string;
  expiration: number;
}

export interface DB {
  users: UserTable;
  sessions: SessionTable;
  password_reset_tokens: PasswordResetTokenTable;
  email_verification_tokens: EmailVerificationTokenTable;
  assets: AssetTable;
  backup_files: BackupFileTable;
  cache: CacheTable;
}

// Helper type exports for common operations
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;

export type PasswordResetToken = Selectable<PasswordResetTokenTable>;
export type NewPasswordResetToken = Insertable<PasswordResetTokenTable>;
export type PasswordResetTokenUpdate = Updateable<PasswordResetTokenTable>;

export type EmailVerificationToken = Selectable<EmailVerificationTokenTable>;
export type NewEmailVerificationToken = Insertable<EmailVerificationTokenTable>;
export type EmailVerificationTokenUpdate = Updateable<EmailVerificationTokenTable>;

export type Asset = Selectable<AssetTable>;
export type NewAsset = Insertable<AssetTable>;
export type AssetUpdate = Updateable<AssetTable>;

export type BackupFile = Selectable<BackupFileTable>;
export type NewBackupFile = Insertable<BackupFileTable>;
export type BackupFileUpdate = Updateable<BackupFileTable>;

export type Cache = Selectable<CacheTable>;
export type NewCache = Insertable<CacheTable>;
export type CacheUpdate = Updateable<CacheTable>;
