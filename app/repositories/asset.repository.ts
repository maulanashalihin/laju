/**
 * Asset Repository
 * Handles all database operations for assets table using raw SQL.
 */

import DB from "../services/DB";

export interface AssetRow {
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

export interface CreateAssetData {
	id: string;
	name: string | null;
	type: string;
	url: string;
	mime_type: string | null;
	size: number | null;
	storage_key: string | null;
	user_id: string | null;
}

export const AssetRepository = {
	/**
	 * Find asset by ID
	 */
	async findById(id: string): Promise<AssetRow | undefined> {
		return DB.get<AssetRow>("SELECT * FROM assets WHERE id = ?", [id]);
	},

	/**
	 * Find assets by user ID
	 */
	async findByUserId(userId: string): Promise<AssetRow[]> {
		return DB.all<AssetRow>(
			"SELECT * FROM assets WHERE user_id = ? ORDER BY created_at DESC",
			[userId],
		);
	},

	/**
	 * Create new asset
	 */
	async create(data: CreateAssetData): Promise<AssetRow> {
		const now = new Date().toISOString();

		DB.run(
			`INSERT INTO assets (id, name, type, url, mime_type, size, storage_key, user_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.id,
				data.name,
				data.type,
				data.url,
				data.mime_type,
				data.size,
				data.storage_key,
				data.user_id,
				now,
				now,
			],
		);

		const asset = await this.findById(data.id);
		if (!asset) throw new Error("Failed to create asset");
		return asset;
	},

	/**
	 * Update asset
	 */
	async update(id: string, data: Partial<CreateAssetData>): Promise<void> {
		const sets: string[] = [];
		const params: unknown[] = [];

		if (data.name !== undefined) {
			sets.push("name = ?");
			params.push(data.name);
		}
		if (data.type !== undefined) {
			sets.push("type = ?");
			params.push(data.type);
		}
		if (data.url !== undefined) {
			sets.push("url = ?");
			params.push(data.url);
		}
		if (data.mime_type !== undefined) {
			sets.push("mime_type = ?");
			params.push(data.mime_type);
		}
		if (data.size !== undefined) {
			sets.push("size = ?");
			params.push(data.size);
		}
		if (data.storage_key !== undefined) {
			sets.push("storage_key = ?");
			params.push(data.storage_key);
		}
		if (data.user_id !== undefined) {
			sets.push("user_id = ?");
			params.push(data.user_id);
		}

		sets.push("updated_at = ?");
		params.push(new Date().toISOString());
		params.push(id);

		DB.run(`UPDATE assets SET ${sets.join(", ")} WHERE id = ?`, params);
	},

	/**
	 * Delete asset by ID
	 */
	async delete(id: string): Promise<void> {
		DB.run("DELETE FROM assets WHERE id = ?", [id]);
	},

	/**
	 * Delete multiple assets
	 */
	async deleteMany(ids: string[]): Promise<void> {
		if (ids.length === 0) return;
		// Build parameterized IN clause
		const ph = ids.map(() => "?").join(",");
		DB.run("DELETE FROM assets WHERE id IN (" + ph + ")", ids);
	},

	/**
	 * Get total size of assets for a user
	 */
	async getTotalSizeByUser(userId: string): Promise<number> {
		const result = DB.get<{ total: number }>(
			"SELECT COALESCE(SUM(size), 0) as total FROM assets WHERE user_id = ?",
			[userId],
		);
		return Number(result?.total || 0);
	},

	/**
	 * Find assets by type
	 */
	async findByType(type: string, limit: number = 100): Promise<AssetRow[]> {
		return DB.all<AssetRow>("SELECT * FROM assets WHERE type = ? LIMIT ?", [
			type,
			limit,
		]);
	},
};

export default AssetRepository;
