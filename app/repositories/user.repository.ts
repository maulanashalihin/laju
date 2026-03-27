/**
 * User Repository
 * Handles all database operations for users table
 */

import DB from "../services/DB";
import type { User } from "../../type/db-types";

export interface CreateUserData {
  id: string;
  email: string;
  password: string;
  name: string | null;
  phone?: string | null;
  avatar?: string | null;
  is_verified?: number;
  is_admin?: number;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
}

export const UserRepository = {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | undefined> {
    return DB.selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  },

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return DB.selectFrom("users")
      .selectAll()
      .where("email", "=", email.toLowerCase())
      .executeTakeFirst();
  },

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | undefined> {
    return DB.selectFrom("users")
      .selectAll()
      .where("phone", "=", phone)
      .executeTakeFirst();
  },

  /**
   * Create new user
   */
  async create(data: CreateUserData): Promise<User> {
    const now = Date.now();

    await DB.insertInto("users")
      .values({
        ...data,
        phone: data.phone || null,
        avatar: data.avatar || null,
        is_verified: data.is_verified ?? 0,
        is_admin: data.is_admin ?? 0,
        membership_date: null,
        remember_me_token: null,
        created_at: now,
        updated_at: now,
      })
      .execute();

    const user = await this.findById(data.id);
    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  },

  /**
   * Update user profile
   */
  async updateProfile(id: string, data: UpdateProfileData): Promise<void> {
    await DB.updateTable("users")
      .set({
        ...data,
        updated_at: Date.now(),
      })
      .where("id", "=", id)
      .execute();
  },

  /**
   * Update password
   */
  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await DB.updateTable("users")
      .set({
        password: hashedPassword,
        updated_at: Date.now(),
      })
      .where("id", "=", id)
      .execute();
  },

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<void> {
    await DB.deleteFrom("users").where("id", "=", id).execute();
  },

  /**
   * Delete multiple users
   */
  async deleteMany(ids: string[]): Promise<void> {
    await DB.deleteFrom("users").where("id", "in", ids).execute();
  },

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  },

  /**
   * Get all users (for admin)
   */
  async getAll(limit: number = 100, offset: number = 0): Promise<User[]> {
    return DB.selectFrom("users")
      .selectAll()
      .limit(limit)
      .offset(offset)
      .execute();
  },
};

export default UserRepository;