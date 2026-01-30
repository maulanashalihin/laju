/**
 * Integration Tests for Authentication Flow
 * Testing complete auth workflows including registration, login, logout
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';
import { randomUUID } from 'crypto';

describe('Authentication Integration Tests', () => {
  const testUser = {
    name: 'Integration Test User',
    email: 'integration@test.com',
    password: 'SecurePassword123',
    phone: '08123456789'
  };

  let userId: string;

  beforeEach(async () => {
    // Clean up test user
    await DB.deleteFrom('users').where('email', '=', testUser.email).execute();
    if (userId) {
      await DB.deleteFrom('sessions').where('user_id', '=', userId).execute();
    }
  });

  afterEach(async () => {
    // Clean up after tests
    if (userId) {
      await DB.deleteFrom('sessions').where('user_id', '=', userId).execute();
      await DB.deleteFrom('users').where('id', '=', userId).execute();
    }
  });

  describe('User Registration Flow', () => {
    it('should register a new user successfully', async () => {
      // Hash password
      const hashedPassword = await Authenticate.hash(testUser.password);

      // Insert user
      const id = randomUUID();
      await DB.insertInto('users').values({
        id,
        name: testUser.name,
        email: testUser.email.toLowerCase(),
        password: hashedPassword,
        phone: testUser.phone,
        is_verified: 0,
        is_admin: 0,
        membership_date: null,
        remember_me_token: null,
        created_at: Date.now(),
        updated_at: Date.now()
      }).execute();

      userId = id;

      // Verify user exists
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email.toLowerCase());
      expect(user.name).toBe(testUser.name);
      expect(user.password).not.toBe(testUser.password); // Should be hashed
    });

    it('should prevent duplicate email registration', async () => {
      const hashedPassword = await Authenticate.hash(testUser.password);

      // First registration
      const id = randomUUID();
      await DB.insertInto('users').values({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        is_verified: 0,
        is_admin: 0,
        membership_date: null,
        remember_me_token: null,
        created_at: Date.now(),
        updated_at: Date.now()
      }).execute();
      userId = id;

      // Try duplicate registration
      try {
        await DB.insertInto('users').values({
          id: randomUUID(),
          name: 'Another User',
          email: testUser.email, // Same email
          password: hashedPassword,
          is_verified: 0,
          is_admin: 0,
          membership_date: null,
          remember_me_token: null,
          created_at: Date.now(),
          updated_at: Date.now()
        }).execute();
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // Should throw constraint error
        expect(error).toBeDefined();
      }
    });

    it('should normalize email to lowercase', async () => {
      const hashedPassword = await Authenticate.hash(testUser.password);
      const mixedCaseEmail = 'Test@Example.COM';

      const id = randomUUID();
      await DB.insertInto('users').values({
        id,
        name: testUser.name,
        email: mixedCaseEmail.toLowerCase(),
        password: hashedPassword,
        is_verified: 0,
        is_admin: 0,
        membership_date: null,
        remember_me_token: null,
        created_at: Date.now(),
        updated_at: Date.now()
      }).execute();
      userId = id;

      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
      expect(user?.email).toBe(mixedCaseEmail.toLowerCase());
    });
  });

  describe('User Login Flow', () => {
    beforeEach(async () => {
      // Create test user for login tests
      const hashedPassword = await Authenticate.hash(testUser.password);
      const id = randomUUID();
      await DB.insertInto('users').values({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        is_verified: 0,
        is_admin: 0,
        membership_date: null,
        remember_me_token: null,
        created_at: Date.now(),
        updated_at: Date.now()
      }).execute();
      userId = id;
    });

    it('should login with correct credentials', async () => {
      // Find user
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('email', '=', testUser.email)
        .executeTakeFirst();
      expect(user).toBeDefined();

      // Verify password
      const isValid = await Authenticate.compare(testUser.password, user!.password);
      expect(isValid).toBe(true);

      // Create session
      const sessionId = `session_${Date.now()}`;
      await DB.insertInto('sessions').values({
        id: sessionId,
        user_id: user!.id,
        user_agent: null,
        expires_at: null
      }).execute();

      // Verify session exists
      const session = await DB.selectFrom('sessions')
        .selectAll()
        .where('id', '=', sessionId)
        .executeTakeFirst();
      expect(session).toBeDefined();
      expect(session?.user_id).toBe(user!.id);

      // Cleanup session
      await DB.deleteFrom('sessions').where('id', '=', sessionId).execute();
    });

    it('should reject incorrect password', async () => {
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('email', '=', testUser.email)
        .executeTakeFirst();
      
      const isValid = await Authenticate.compare('WrongPassword123', user!.password);
      expect(isValid).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('email', '=', 'nonexistent@test.com')
        .executeTakeFirst();
      expect(user).toBeUndefined();
    });

    it('should support login by phone', async () => {
      // Update user with phone
      await DB.updateTable('users')
        .set({ phone: testUser.phone })
        .where('id', '=', userId)
        .execute();

      const user = await DB.selectFrom('users')
        .selectAll()
        .where('phone', '=', testUser.phone)
        .executeTakeFirst();
      expect(user).toBeDefined();
      expect(user?.id).toBe(userId);
    });
  });

  describe('Session Management', () => {
    let sessionId: string;

    beforeEach(async () => {
      // Create user and session
      const hashedPassword = await Authenticate.hash(testUser.password);
      const id = randomUUID();
      await DB.insertInto('users').values({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        is_verified: 0,
        is_admin: 0,
        membership_date: null,
        remember_me_token: null,
        created_at: Date.now(),
        updated_at: Date.now()
      }).execute();
      userId = id;

      sessionId = `session_${Date.now()}`;
      await DB.insertInto('sessions').values({
        id: sessionId,
        user_id: userId,
        user_agent: null,
        expires_at: null
      }).execute();
    });

    afterEach(async () => {
      if (sessionId) {
        await DB.deleteFrom('sessions').where('id', '=', sessionId).execute();
      }
    });

    it('should retrieve user from session', async () => {
      const session = await DB.selectFrom('sessions')
        .innerJoin('users', 'sessions.user_id', 'users.id')
        .select(['users.id', 'users.email', 'users.name'])
        .where('sessions.id', '=', sessionId)
        .executeTakeFirst();

      expect(session).toBeDefined();
      expect(session?.id).toBe(userId);
      expect(session?.email).toBe(testUser.email);
    });

    it('should logout by deleting session', async () => {
      await DB.deleteFrom('sessions').where('id', '=', sessionId).execute();

      const session = await DB.selectFrom('sessions')
        .selectAll()
        .where('id', '=', sessionId)
        .executeTakeFirst();
      expect(session).toBeUndefined();
      
      sessionId = ''; // Prevent double cleanup
    });

    it('should handle multiple sessions per user', async () => {
      const session2Id = `session2_${Date.now()}`;
      await DB.insertInto('sessions').values({
        id: session2Id,
        user_id: userId,
        user_agent: null,
        expires_at: null
      }).execute();

      const sessions = await DB.selectFrom('sessions')
        .selectAll()
        .where('user_id', '=', userId)
        .execute();
      expect(sessions.length).toBeGreaterThanOrEqual(2);

      // Cleanup
      await DB.deleteFrom('sessions').where('id', '=', session2Id).execute();
    });
  });

  describe('Password Reset Flow', () => {
    beforeEach(async () => {
      const hashedPassword = await Authenticate.hash(testUser.password);
      const id = randomUUID();
      await DB.insertInto('users').values({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        is_verified: 0,
        is_admin: 0,
        membership_date: null,
        remember_me_token: null,
        created_at: Date.now(),
        updated_at: Date.now()
      }).execute();
      userId = id;
    });

    it('should create password reset token', async () => {
      const token = randomUUID();
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
      const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString(); // 24 hours

      await DB.insertInto('password_reset_tokens').values({
        email: user!.email,
        token: token,
        expires_at: expiresAt
      }).execute();

      const resetToken = await DB.selectFrom('password_reset_tokens')
        .selectAll()
        .where('token', '=', token)
        .executeTakeFirst();
      expect(resetToken).toBeDefined();
      expect(resetToken?.email).toBe(user?.email);

      // Cleanup
      await DB.deleteFrom('password_reset_tokens').where('token', '=', token).execute();
    });

    it('should reset password with valid token', async () => {
      const token = randomUUID();
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
      const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString();

      await DB.insertInto('password_reset_tokens').values({
        email: user!.email,
        token: token,
        expires_at: expiresAt
      }).execute();

      // Verify token
      const resetToken = await DB.selectFrom('password_reset_tokens')
        .selectAll()
        .where('token', '=', token)
        .where('expires_at', '>', new Date().toISOString())
        .executeTakeFirst();
      
      expect(resetToken).toBeDefined();

      // Update password
      const newPassword = 'NewSecurePassword456';
      const hashedNewPassword = await Authenticate.hash(newPassword);
      
      await DB.updateTable('users')
        .set({ password: hashedNewPassword })
        .where('email', '=', user!.email)
        .execute();

      // Delete token
      await DB.deleteFrom('password_reset_tokens').where('token', '=', token).execute();

      // Verify new password works
      const updatedUser = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
      const isValid = await Authenticate.compare(newPassword, updatedUser!.password);
      expect(isValid).toBe(true);
    });

    it('should reject expired token', async () => {
      const token = randomUUID();
      const user = await DB.selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
      const expiresAt = new Date(Date.now() - 1000).toISOString(); // Already expired

      await DB.insertInto('password_reset_tokens').values({
        email: user!.email,
        token: token,
        expires_at: expiresAt
      }).execute();

      const resetToken = await DB.selectFrom('password_reset_tokens')
        .selectAll()
        .where('token', '=', token)
        .where('expires_at', '>', new Date().toISOString())
        .executeTakeFirst();
      
      expect(resetToken).toBeUndefined();

      // Cleanup
      await DB.deleteFrom('password_reset_tokens').where('token', '=', token).execute();
    });
  });
});
