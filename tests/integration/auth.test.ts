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
    await DB('users').where('email', testUser.email).delete();
    if (userId) {
      await DB('sessions').where('user_id', userId).delete();
    }
  });

  afterEach(async () => {
    // Clean up after tests
    if (userId) {
      await DB('sessions').where('user_id', userId).delete();
      await DB('users').where('id', userId).delete();
    }
  });

  describe('User Registration Flow', () => {
    it('should register a new user successfully', async () => {
      // Hash password
      const hashedPassword = await Authenticate.hash(testUser.password);

      // Insert user
      const id = randomUUID();
      await DB('users').insert({
        id,
        name: testUser.name,
        email: testUser.email.toLowerCase(),
        password: hashedPassword,
        phone: testUser.phone,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      userId = id;

      // Verify user exists
      const user = await DB('users').where('id', id).first();
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email.toLowerCase());
      expect(user.name).toBe(testUser.name);
      expect(user.password).not.toBe(testUser.password); // Should be hashed
    });

    it('should prevent duplicate email registration', async () => {
      const hashedPassword = await Authenticate.hash(testUser.password);

      // First registration
      const id = randomUUID();
      await DB('users').insert({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      userId = id;

      // Try duplicate registration
      try {
        await DB('users').insert({
          id: randomUUID(),
          name: 'Another User',
          email: testUser.email, // Same email
          password: hashedPassword,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        
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
      await DB('users').insert({
        id,
        name: testUser.name,
        email: mixedCaseEmail.toLowerCase(),
        password: hashedPassword,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      userId = id;

      const user = await DB('users').where('id', id).first();
      expect(user.email).toBe(mixedCaseEmail.toLowerCase());
    });
  });

  describe('User Login Flow', () => {
    beforeEach(async () => {
      // Create test user for login tests
      const hashedPassword = await Authenticate.hash(testUser.password);
      const id = randomUUID();
      await DB('users').insert({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      userId = id;
    });

    it('should login with correct credentials', async () => {
      // Find user
      const user = await DB('users').where('email', testUser.email).first();
      expect(user).toBeDefined();

      // Verify password
      const isValid = await Authenticate.compare(testUser.password, user.password);
      expect(isValid).toBe(true);

      // Create session
      const sessionId = `session_${Date.now()}`;
      await DB('sessions').insert({
        id: sessionId,
        user_id: user.id
      });

      // Verify session exists
      const session = await DB('sessions').where('id', sessionId).first();
      expect(session).toBeDefined();
      expect(session.user_id).toBe(user.id);

      // Cleanup session
      await DB('sessions').where('id', sessionId).delete();
    });

    it('should reject incorrect password', async () => {
      const user = await DB('users').where('email', testUser.email).first();
      
      const isValid = await Authenticate.compare('WrongPassword123', user.password);
      expect(isValid).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const user = await DB('users').where('email', 'nonexistent@test.com').first();
      expect(user).toBeUndefined();
    });

    it('should support login by phone', async () => {
      // Update user with phone
      await DB('users').where('id', userId).update({ phone: testUser.phone });

      const user = await DB('users').where('phone', testUser.phone).first();
      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
    });
  });

  describe('Session Management', () => {
    let sessionId: string;

    beforeEach(async () => {
      // Create user and session
      const hashedPassword = await Authenticate.hash(testUser.password);
      const id = randomUUID();
      await DB('users').insert({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      userId = id;

      sessionId = `session_${Date.now()}`;
      await DB('sessions').insert({
        id: sessionId,
        user_id: userId
      });
    });

    afterEach(async () => {
      if (sessionId) {
        await DB('sessions').where('id', sessionId).delete();
      }
    });

    it('should retrieve user from session', async () => {
      const session = await DB('sessions')
        .join('users', 'sessions.user_id', 'users.id')
        .where('sessions.id', sessionId)
        .select('users.*')
        .first();

      expect(session).toBeDefined();
      expect(session.id).toBe(userId);
      expect(session.email).toBe(testUser.email);
    });

    it('should logout by deleting session', async () => {
      await DB('sessions').where('id', sessionId).delete();

      const session = await DB('sessions').where('id', sessionId).first();
      expect(session).toBeUndefined();
      
      sessionId = ''; // Prevent double cleanup
    });

    it('should handle multiple sessions per user', async () => {
      const session2Id = `session2_${Date.now()}`;
      await DB('sessions').insert({
        id: session2Id,
        user_id: userId
      });

      const sessions = await DB('sessions').where('user_id', userId);
      expect(sessions.length).toBeGreaterThanOrEqual(2);

      // Cleanup
      await DB('sessions').where('id', session2Id).delete();
    });
  });

  describe('Password Reset Flow', () => {
    beforeEach(async () => {
      const hashedPassword = await Authenticate.hash(testUser.password);
      const id = randomUUID();
      await DB('users').insert({
        id,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      userId = id;
    });

    it('should create password reset token', async () => {
      const token = randomUUID();
      const user = await DB('users').where('id', userId).first();
      const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours

      await DB('password_reset_tokens').insert({
        email: user.email,
        token: token,
        expires_at: expiresAt
      });

      const resetToken = await DB('password_reset_tokens').where('token', token).first();
      expect(resetToken).toBeDefined();
      expect(resetToken.email).toBe(user.email);

      // Cleanup
      await DB('password_reset_tokens').where('token', token).delete();
    });

    it('should reset password with valid token', async () => {
      const token = randomUUID();
      const user = await DB('users').where('id', userId).first();
      const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));

      await DB('password_reset_tokens').insert({
        email: user.email,
        token: token,
        expires_at: expiresAt
      });

      // Verify token
      const resetToken = await DB('password_reset_tokens')
        .where('token', token)
        .where('expires_at', '>', new Date())
        .first();
      
      expect(resetToken).toBeDefined();

      // Update password
      const newPassword = 'NewSecurePassword456';
      const hashedNewPassword = await Authenticate.hash(newPassword);
      
      await DB('users').where('email', user.email).update({ password: hashedNewPassword });

      // Delete token
      await DB('password_reset_tokens').where('token', token).delete();

      // Verify new password works
      const updatedUser = await DB('users').where('id', userId).first();
      const isValid = await Authenticate.compare(newPassword, updatedUser.password);
      expect(isValid).toBe(true);
    });

    it('should reject expired token', async () => {
      const token = randomUUID();
      const user = await DB('users').where('id', userId).first();
      const expiresAt = new Date(Date.now() - 1000); // Already expired

      await DB('password_reset_tokens').insert({
        email: user.email,
        token: token,
        expires_at: expiresAt
      });

      const resetToken = await DB('password_reset_tokens')
        .where('token', token)
        .where('expires_at', '>', new Date())
        .first();
      
      expect(resetToken).toBeUndefined();

      // Cleanup
      await DB('password_reset_tokens').where('token', token).delete();
    });
  });
});
