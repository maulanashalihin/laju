/**
 * Unit Tests for DB Service (Knex)
 * Testing Knex query builder operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../../app/services/DB';
import { randomUUID } from 'crypto';

describe('DB Service (Knex)', () => {
  const testUser = {
    id: randomUUID(),
    name: 'Knex Test User',
    email: 'knex@example.com',
    password: 'hashed_password',
    created_at: Date.now(),
    updated_at: Date.now()
  };

  let insertedUserId: string;

  beforeEach(async () => {
    // Clean up before each test
    await DB('users').where('email', testUser.email).delete();
  });

  afterEach(async () => {
    // Clean up after each test
    if (insertedUserId) {
      await DB('users').where('id', insertedUserId).delete();
    }
  });

  describe('INSERT operations', () => {
    it('should insert a new user', async () => {
      const userId = randomUUID();
      await DB('users').insert({ ...testUser, id: userId });
      
      insertedUserId = userId;
      
      const user = await DB('users').where('id', userId).first();
      expect(user).toBeDefined();
    });

    it('should insert and return the user', async () => {
      const userId = randomUUID();
      await DB('users').insert({ ...testUser, id: userId });
      insertedUserId = userId;

      const user = await DB('users').where('id', userId).first();
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
      expect(user.name).toBe(testUser.name);
    });
  });

  describe('SELECT operations', () => {
    beforeEach(async () => {
      const userId = randomUUID();
      await DB('users').insert({ ...testUser, id: userId });
      insertedUserId = userId;
    });

    it('should select user by id', async () => {
      const user = await DB('users').where('id', insertedUserId).first();
      
      expect(user).toBeDefined();
      expect(user.id).toBe(insertedUserId);
      expect(user.email).toBe(testUser.email);
    });

    it('should select user by email', async () => {
      const user = await DB('users').where('email', testUser.email).first();
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
    });

    it('should return undefined for non-existent user', async () => {
      const user = await DB('users').where('id', 999999).first();
      
      expect(user).toBeUndefined();
    });

    it('should select all users with filter', async () => {
      const users = await DB('users').where('email', testUser.email);
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].email).toBe(testUser.email);
    });

    it('should count users', async () => {
      const result = await DB('users').where('email', testUser.email).count('* as count');
      
      expect(result[0].count).toBeGreaterThan(0);
    });
  });

  describe('UPDATE operations', () => {
    beforeEach(async () => {
      const userId = randomUUID();
      await DB('users').insert({ ...testUser, id: userId });
      insertedUserId = userId;
    });

    it('should update user name', async () => {
      const newName = 'Updated Knex Name';
      const updated = await DB('users')
        .where('id', insertedUserId)
        .update({ name: newName });

      expect(updated).toBe(1);

      const user = await DB('users').where('id', insertedUserId).first();
      expect(user.name).toBe(newName);
    });

    it('should update multiple fields', async () => {
      const updates = {
        name: 'New Name',
        phone: '08123456789',
        updated_at: Date.now()
      };

      await DB('users').where('id', insertedUserId).update(updates);

      const user = await DB('users').where('id', insertedUserId).first();
      expect(user.name).toBe(updates.name);
      expect(user.phone).toBe(updates.phone);
    });
  });

  describe('DELETE operations', () => {
    beforeEach(async () => {
      const userId = randomUUID();
      await DB('users').insert({ ...testUser, id: userId });
      insertedUserId = userId;
    });

    it('should delete a user', async () => {
      const deleted = await DB('users').where('id', insertedUserId).delete();
      
      expect(deleted).toBe(1);

      const user = await DB('users').where('id', insertedUserId).first();
      expect(user).toBeUndefined();
      
      // Prevent double cleanup
      insertedUserId = '';
    });

    it('should delete multiple users', async () => {
      // Insert another user
      const id2 = randomUUID();
      await DB('users').insert({
        id: id2,
        name: 'User 2',
        email: 'user2@knex.com',
        password: 'pass',
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const deleted = await DB('users')
        .whereIn('id', [insertedUserId, id2])
        .delete();
      
      expect(deleted).toBe(2);
      insertedUserId = '';
    });
  });

  describe('QUERY BUILDER features', () => {
    beforeEach(async () => {
      // Insert multiple test users
      await DB('users').insert([
        { id: randomUUID(), name: 'Alice', email: 'alice@test.com', password: 'pass', is_verified: true, created_at: Date.now(), updated_at: Date.now() },
        { id: randomUUID(), name: 'Bob', email: 'bob@test.com', password: 'pass', is_verified: false, created_at: Date.now(), updated_at: Date.now() },
        { id: randomUUID(), name: 'Charlie', email: 'charlie@test.com', password: 'pass', is_verified: true, created_at: Date.now(), updated_at: Date.now() }
      ]);
    });

    afterEach(async () => {
      await DB('users').whereIn('email', ['alice@test.com', 'bob@test.com', 'charlie@test.com']).delete();
    });

    it('should filter with WHERE clause', async () => {
      const verified = await DB('users').where('is_verified', true);
      
      expect(verified.length).toBeGreaterThanOrEqual(2);
    });

    it('should use LIKE operator', async () => {
      const users = await DB('users').where('name', 'like', '%li%');
      
      expect(users.length).toBeGreaterThan(0);
      expect(users.some(u => u.name.toLowerCase().includes('li'))).toBe(true);
    });

    it('should use ORDER BY', async () => {
      const users = await DB('users')
        .whereIn('email', ['alice@test.com', 'bob@test.com', 'charlie@test.com'])
        .orderBy('name', 'asc');
      
      expect(users[0].name).toBe('Alice');
    });

    it('should use LIMIT and OFFSET', async () => {
      const users = await DB('users')
        .whereIn('email', ['alice@test.com', 'bob@test.com', 'charlie@test.com'])
        .limit(2)
        .offset(0);
      
      expect(users.length).toBe(2);
    });

    it('should use complex WHERE conditions', async () => {
      const users = await DB('users')
        .where(function() {
          this.where('name', 'like', '%li%')
            .orWhere('name', 'like', '%ob%');
        })
        .andWhere('is_verified', true);
      
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('TRANSACTION operations', () => {
    it('should execute transaction successfully', async () => {
      const result = await DB.transaction(async (trx) => {
        const id1 = randomUUID();
        const id2 = randomUUID();
        
        await trx('users').insert({
          id: id1,
          name: 'Transaction User 1',
          email: 'trx1@test.com',
          password: 'pass',
          created_at: Date.now(),
          updated_at: Date.now()
        });

        await trx('users').insert({
          id: id2,
          name: 'Transaction User 2',
          email: 'trx2@test.com',
          password: 'pass',
          created_at: Date.now(),
          updated_at: Date.now()
        });

        return { id1, id2 };
      });

      expect(result.id1).toBeDefined();
      expect(result.id2).toBeDefined();

      // Cleanup
      await DB('users').whereIn('email', ['trx1@test.com', 'trx2@test.com']).delete();
    });

    it('should rollback on error', async () => {
      try {
        await DB.transaction(async (trx) => {
          await trx('users').insert({
            id: randomUUID(),
            name: 'Rollback User',
            email: 'rollback@test.com',
            password: 'pass',
            created_at: Date.now(),
            updated_at: Date.now()
          });

          // Force error
          throw new Error('Intentional error');
        });
      } catch (error) {
        // Expected error
      }

      const user = await DB('users').where('email', 'rollback@test.com').first();
      expect(user).toBeUndefined();
    });
  });
});
