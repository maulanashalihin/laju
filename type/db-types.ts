/**
 * Database Types
 * Table schemas for type-safe database operations.
 * No kysely dependency — plain interfaces.
 */

export interface UserTable {
	id: string;
	name: string | null;
	email: string;
	phone: string | null;
	avatar: string | null;
	is_verified: number;
	membership_date: number | null;
	is_admin: number;
	password: string;
	remember_me_token: string | null;
	created_at: number;
	updated_at: number;
}

export interface SessionTable {
	id: string;
	user_id: string;
	user_agent: string | null;
	expires_at: string | null;
	data: string;
	created_at: number | null;
	updated_at: number | null;
}

export interface PasswordResetTokenTable {
	id: number;
	email: string;
	token: string;
	created_at: string;
	expires_at: string;
}

export interface EmailVerificationTokenTable {
	id: number;
	user_id: string;
	token: string;
	created_at: string;
	expires_at: string;
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
	created_at: string;
	updated_at: string;
}

export interface BackupFileTable {
	id: number;
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

// Aliases for common operations
export type User = UserTable;
export type Session = SessionTable;
export type PasswordResetToken = PasswordResetTokenTable;
export type EmailVerificationToken = EmailVerificationTokenTable;
export type Asset = AssetTable;
export type BackupFile = BackupFileTable;
export type Cache = CacheTable;

// RunResult for better-sqlite3
export interface RunResult {
	changes: number;
	lastInsertRowid: number;
}
