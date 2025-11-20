/**
 * Unit Tests for SQLite Service
 * Testing native better-sqlite3 operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import SQLite from '../../../app/services/SQLite';
import { randomUUID } from 'crypto';

describe('SQLite Service', () => {
  // Test data
  const testUser = {
    id: randomUUID(),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password',
    created_at: Date.now(),
    updated_at: Date.now()
  };

  let insertedUserId: string;

  beforeEach(() => {
    // Clean up users table before each test
    SQLite.run('DELETE FROM users WHERE email = ?', [testUser.email]);
  });

  afterEach(() => {
    // Clean up after each test
    if (insertedUserId) {
      SQLite.run('DELETE FROM users WHERE id = ?', [insertedUserId]);
    }
  });

  describe('INSERT operations', () => {
    it('should insert a new user', () => {
      const userId = randomUUID();
      const result = SQLite.run(
        'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, testUser.name, testUser.email, testUser.password, testUser.created_at, testUser.updated_at]
      );

      expect(result.changes).toBe(1);
      
      insertedUserId = userId;
    });

    it('should fail on duplicate email', () => {
      // Insert first user
      const userId = randomUUID();
      SQLite.run(
        'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, testUser.name, testUser.email, testUser.password, testUser.created_at, testUser.updated_at]
      );
      insertedUserId = userId;

      // Try to insert duplicate
      expect(() => {
        SQLite.run(
          'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [randomUUID(), testUser.name, testUser.email, testUser.password, testUser.created_at, testUser.updated_at]
        );
      }).toThrow();
    });
  });

  describe('SELECT operations', () => {
    beforeEach(() => {
      // Insert test user for SELECT tests
      const userId = randomUUID();
      SQLite.run(
        'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, testUser.name, testUser.email, testUser.password, testUser.created_at, testUser.updated_at]
      );
      insertedUserId = userId;
    });

    it('should get a user by id', () => {
      const user = SQLite.get('SELECT * FROM users WHERE id = ?', [insertedUserId]);
      
      expect(user).toBeDefined();
      expect(user.id).toBe(insertedUserId);
      expect(user.email).toBe(testUser.email);
      expect(user.name).toBe(testUser.name);
    });

    it('should get a user by email', () => {
      const user = SQLite.get('SELECT * FROM users WHERE email = ?', [testUser.email]);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
    });

    it('should return undefined for non-existent user', () => {
      const user = SQLite.get('SELECT * FROM users WHERE id = ?', [999999]);
      
      expect(user).toBeUndefined();
    });

    it('should get all users', () => {
      const users = SQLite.all('SELECT * FROM users WHERE email = ?', [testUser.email]);
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].email).toBe(testUser.email);
    });
  });

  describe('UPDATE operations', () => {
    beforeEach(() => {
      const userId = randomUUID();
      SQLite.run(
        'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, testUser.name, testUser.email, testUser.password, testUser.created_at, testUser.updated_at]
      );
      insertedUserId = userId;
    });

    it('should update user name', () => {
      const newName = 'Updated Name';
      const result = SQLite.run(
        'UPDATE users SET name = ? WHERE id = ?',
        [newName, insertedUserId]
      );

      expect(result.changes).toBe(1);

      const user = SQLite.get('SELECT * FROM users WHERE id = ?', [insertedUserId]);
      expect(user.name).toBe(newName);
    });

    it('should return 0 changes for non-existent user', () => {
      const result = SQLite.run(
        'UPDATE users SET name = ? WHERE id = ?',
        ['New Name', 999999]
      );

      expect(result.changes).toBe(0);
    });
  });

  describe('DELETE operations', () => {
    beforeEach(() => {
      const userId = randomUUID();
      SQLite.run(
        'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, testUser.name, testUser.email, testUser.password, testUser.created_at, testUser.updated_at]
      );
      insertedUserId = userId;
    });

    it('should delete a user', () => {
      const result = SQLite.run('DELETE FROM users WHERE id = ?', [insertedUserId]);
      
      expect(result.changes).toBe(1);

      const user = SQLite.get('SELECT * FROM users WHERE id = ?', [insertedUserId]);
      expect(user).toBeUndefined();
      
      // Prevent double cleanup
      insertedUserId = '';
    });
  });

  describe('TRANSACTION operations', () => {
    it('should execute transaction successfully', () => {
      const result = SQLite.transaction((db) => {
        const id1 = randomUUID();
        const id2 = randomUUID();
        
        db.run(
          'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [id1, 'User 1', 'user1@test.com', 'pass', Date.now(), Date.now()]
        );
        
        db.run(
          'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [id2, 'User 2', 'user2@test.com', 'pass', Date.now(), Date.now()]
        );

        return { id1, id2 };
      });

      expect(result.id1).toBeDefined();
      expect(result.id2).toBeDefined();

      // Cleanup
      SQLite.run('DELETE FROM users WHERE email IN (?, ?)', ['user1@test.com', 'user2@test.com']);
    });
  });
});
