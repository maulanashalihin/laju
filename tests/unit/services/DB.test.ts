/**
 * Unit Tests for DB Service (Kysely)
 * Testing Kysely query builder operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB, { sql } from '../../../app/services/DB';
import { randomUUID } from 'crypto';

describe('DB Service (Kysely)', () => {
  const testUser = {
    id: randomUUID(),
    name: 'Kysely Test User',
    email: 'kysely@example.com',
    password: 'hashed_password',
    created_at: Date.now(),
    updated_at: Date.now()
  };

  let insertedUserId: string;

  beforeEach(async () => {
    // Clean up before each test
    await DB.deleteFrom('users').where('email', '=', testUser.email).execute();
  });

  afterEach(async () => {
    // Clean up after each test
    if (insertedUserId) {
      await DB.deleteFrom('users').where('id', '=', insertedUserId).execute();
    }
  });

  describe('INSERT operations', () => {
    it('should insert a new user', async () => {
      const userId = randomUUID();
      await DB.insertInto('users')
        .values({ ...testUser, id: userId })
        .execute();
      
      insertedUserId = userId;
      
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
      expect(user).toBeDefined();
    });

    it('should insert and return the user', async () => {
      const userId = randomUUID();
      await DB.insertInto('users')
        .values({ ...testUser, id: userId })
        .execute();
      insertedUserId = userId;

      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
      
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
      expect(user?.name).toBe(testUser.name);
    });
  });

  describe('SELECT operations', () => {
    beforeEach(async () => {
      const userId = randomUUID();
      await DB.insertInto('users')
        .values({ ...testUser, id: userId })
        .execute();
      insertedUserId = userId;
    });

    it('should select user by id', async () => {
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', insertedUserId)
        .executeTakeFirst();
      
      expect(user).toBeDefined();
      expect(user?.id).toBe(insertedUserId);
      expect(user?.email).toBe(testUser.email);
    });

    it('should select user by email', async () => {
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('email', '=', testUser.email)
        .executeTakeFirst();
      
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it('should return undefined for non-existent user', async () => {
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', 'non-existent-id')
        .executeTakeFirst();
      
      expect(user).toBeUndefined();
    });

    it('should select all users with filter', async () => {
      const users = await DB.selectFrom('users')
        .selectAll()
        .where('email', '=', testUser.email)
        .execute();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].email).toBe(testUser.email);
    });

    it('should count users', async () => {
      const result = await DB.selectFrom('users')
        .select((eb) => eb.fn.countAll().as('count'))
        .where('email', '=', testUser.email)
        .executeTakeFirst();
      
      expect(Number(result?.count)).toBeGreaterThan(0);
    });
  });

  describe('UPDATE operations', () => {
    beforeEach(async () => {
      const userId = randomUUID();
      await DB.insertInto('users')
        .values({ ...testUser, id: userId })
        .execute();
      insertedUserId = userId;
    });

    it('should update user name', async () => {
      const newName = 'Updated Kysely Name';
      const updated = await DB.updateTable('users')
        .set({ name: newName })
        .where('id', '=', insertedUserId)
        .executeTakeFirst();

      expect(updated.numUpdatedRows).toBe(BigInt(1));

      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', insertedUserId)
        .executeTakeFirst();
      expect(user?.name).toBe(newName);
    });

    it('should update multiple fields', async () => {
      const updates = {
        name: 'New Name',
        phone: '08123456789',
        updated_at: Date.now()
      };

      await DB.updateTable('users')
        .set(updates)
        .where('id', '=', insertedUserId)
        .execute();

      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', insertedUserId)
        .executeTakeFirst();
      expect(user?.name).toBe(updates.name);
      expect(user?.phone).toBe(updates.phone);
    });
  });

  describe('DELETE operations', () => {
    beforeEach(async () => {
      const userId = randomUUID();
      await DB.insertInto('users')
        .values({ ...testUser, id: userId })
        .execute();
      insertedUserId = userId;
    });

    it('should delete a user', async () => {
      const deleted = await DB.deleteFrom('users')
        .where('id', '=', insertedUserId)
        .executeTakeFirst();
      
      expect(deleted.numDeletedRows).toBe(BigInt(1));

      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', insertedUserId)
        .executeTakeFirst();
      expect(user).toBeUndefined();
      
      // Prevent double cleanup
      insertedUserId = '';
    });

    it('should delete multiple users', async () => {
      // Insert another user
      const id2 = randomUUID();
      await DB.insertInto('users').values({
        id: id2,
        name: 'User 2',
        email: 'user2@kysely.com',
        password: 'pass',
        created_at: Date.now(),
        updated_at: Date.now()
      }).execute();

      const deleted = await DB.deleteFrom('users')
        .where('id', 'in', [insertedUserId, id2])
        .executeTakeFirst();
      
      expect(deleted.numDeletedRows).toBe(BigInt(2));
      insertedUserId = '';
    });
  });

  describe('QUERY BUILDER features', () => {
    beforeEach(async () => {
      // Insert multiple test users
      await DB.insertInto('users').values([
        { id: randomUUID(), name: 'Alice', email: 'alice@test.com', password: 'pass', is_verified: 1, created_at: Date.now(), updated_at: Date.now() },
        { id: randomUUID(), name: 'Bob', email: 'bob@test.com', password: 'pass', is_verified: 0, created_at: Date.now(), updated_at: Date.now() },
        { id: randomUUID(), name: 'Charlie', email: 'charlie@test.com', password: 'pass', is_verified: 1, created_at: Date.now(), updated_at: Date.now() }
      ]).execute();
    });

    afterEach(async () => {
      await DB.deleteFrom('users')
        .where('email', 'in', ['alice@test.com', 'bob@test.com', 'charlie@test.com'])
        .execute();
    });

    it('should filter with WHERE clause', async () => {
      const verified = await DB.selectFrom('users')
        .selectAll()
        .where('is_verified', '=', 1)
        .execute();
      
      expect(verified.length).toBeGreaterThanOrEqual(2);
    });

    it('should use LIKE operator', async () => {
      const users = await DB.selectFrom('users')
        .selectAll()
        .where('name', 'like', '%li%')
        .execute();
      
      expect(users.length).toBeGreaterThan(0);
      expect(users.some(u => u.name.toLowerCase().includes('li'))).toBe(true);
    });

    it('should use ORDER BY', async () => {
      const users = await DB.selectFrom('users')
        .selectAll()
        .where('email', 'in', ['alice@test.com', 'bob@test.com', 'charlie@test.com'])
        .orderBy('name', 'asc')
        .execute();
      
      expect(users[0].name).toBe('Alice');
    });

    it('should use LIMIT and OFFSET', async () => {
      const users = await DB.selectFrom('users')
        .selectAll()
        .where('email', 'in', ['alice@test.com', 'bob@test.com', 'charlie@test.com'])
        .limit(2)
        .offset(0)
        .execute();
      
      expect(users.length).toBe(2);
    });

    it('should use complex WHERE conditions', async () => {
      const users = await DB.selectFrom('users')
        .selectAll()
        .where((eb) => eb.or([
          eb('name', 'like', '%li%'),
          eb('name', 'like', '%ob%')
        ]))
        .where('is_verified', '=', 1)
        .execute();
      
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('TRANSACTION operations', () => {
    it('should execute transaction successfully', async () => {
      const result = await DB.transaction().execute(async (trx) => {
        const id1 = randomUUID();
        const id2 = randomUUID();
        
        await trx.insertInto('users').values({
          id: id1,
          name: 'Transaction User 1',
          email: 'trx1@test.com',
          password: 'pass',
          created_at: Date.now(),
          updated_at: Date.now()
        }).execute();

        await trx.insertInto('users').values({
          id: id2,
          name: 'Transaction User 2',
          email: 'trx2@test.com',
          password: 'pass',
          created_at: Date.now(),
          updated_at: Date.now()
        }).execute();

        return { id1, id2 };
      });

      expect(result.id1).toBeDefined();
      expect(result.id2).toBeDefined();

      // Cleanup
      await DB.deleteFrom('users')
        .where('email', 'in', ['trx1@test.com', 'trx2@test.com'])
        .execute();
    });

    it('should rollback on error', async () => {
      try {
        await DB.transaction().execute(async (trx) => {
          await trx.insertInto('users').values({
            id: randomUUID(),
            name: 'Rollback User',
            email: 'rollback@test.com',
            password: 'pass',
            created_at: Date.now(),
            updated_at: Date.now()
          }).execute();

          // Force error
          throw new Error('Intentional error');
        });
      } catch (error) {
        // Expected error
      }

      const user = await DB.selectFrom('users')
        .selectAll()
        .where('email', '=', 'rollback@test.com')
        .executeTakeFirst();
      expect(user).toBeUndefined();
    });
  });
});
