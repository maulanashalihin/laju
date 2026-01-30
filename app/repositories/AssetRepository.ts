/**
 * Asset Repository
 * Handles all database operations for assets table
 */

import DB from "../services/DB";
import type { Asset } from "../../type/db-types";

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

export class AssetRepository {
  /**
   * Find asset by ID
   */
  static async findById(id: string): Promise<Asset | undefined> {
    return DB.selectFrom("assets")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }

  /**
   * Find assets by user ID
   */
  static async findByUserId(userId: string): Promise<Asset[]> {
    return DB.selectFrom("assets")
      .selectAll()
      .where("user_id", "=", userId)
      .orderBy("created_at", "desc")
      .execute();
  }

  /**
   * Create new asset
   */
  static async create(data: CreateAssetData): Promise<Asset> {
    const now = new Date().toISOString();

    await DB.insertInto("assets")
      .values({
        id: data.id,
        name: data.name,
        type: data.type,
        url: data.url,
        mime_type: data.mime_type,
        size: data.size,
        storage_key: data.storage_key,
        user_id: data.user_id,
        created_at: now,
        updated_at: now,
      })
      .execute();

    const asset = await this.findById(data.id);
    if (!asset) {
      throw new Error("Failed to create asset");
    }

    return asset;
  }

  /**
   * Update asset
   */
  static async update(id: string, data: Partial<CreateAssetData>): Promise<void> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.mime_type !== undefined) updateData.mime_type = data.mime_type;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.storage_key !== undefined) updateData.storage_key = data.storage_key;
    if (data.user_id !== undefined) updateData.user_id = data.user_id;

    await DB.updateTable("assets")
      .set(updateData as any)
      .where("id", "=", id)
      .execute();
  }

  /**
   * Delete asset by ID
   */
  static async delete(id: string): Promise<void> {
    await DB.deleteFrom("assets").where("id", "=", id).execute();
  }

  /**
   * Delete multiple assets
   */
  static async deleteMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await DB.deleteFrom("assets").where("id", "in", ids as string[]).execute();
  }

  /**
   * Get total size of assets for a user
   */
  static async getTotalSizeByUser(userId: string): Promise<number> {
    const result = await DB.selectFrom("assets")
      .select((eb) => eb.fn.sum("size").as("total"))
      .where("user_id", "=", userId)
      .executeTakeFirst();

    return Number(result?.total || 0);
  }

  /**
   * Find assets by type
   */
  static async findByType(type: string, limit: number = 100): Promise<Asset[]> {
    return DB.selectFrom("assets")
      .selectAll()
      .where("type", "=", type)
      .limit(limit)
      .execute();
  }
}
