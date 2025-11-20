/**
 * Unit Tests for Authenticate Service
 * Testing password hashing and comparison
 */

import { describe, it, expect } from 'vitest';
import Authenticate from '../../../app/services/Authenticate';

describe('Authenticate Service', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123';
      const hashed = await Authenticate.hash(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'samePassword';
      const hash1 = await Authenticate.hash(password);
      const hash2 = await Authenticate.hash(password);
      
      // Hashes should be different due to salt
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashed = await Authenticate.hash(password);
      
      expect(hashed).toBeDefined();
    });
  });

  describe('Password Comparison', () => {
    it('should verify correct password', async () => {
      const password = 'correctPassword123';
      const hashed = await Authenticate.hash(password);
      
      const isValid = await Authenticate.compare(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const hashed = await Authenticate.hash(password);
      
      const isValid = await Authenticate.compare(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'Password123';
      const hashed = await Authenticate.hash(password);
      
      const isValid1 = await Authenticate.compare('password123', hashed);
      const isValid2 = await Authenticate.compare('PASSWORD123', hashed);
      
      expect(isValid1).toBe(false);
      expect(isValid2).toBe(false);
    });

    it('should handle special characters', async () => {
      const password = 'P@ssw0rd!#$%^&*()';
      const hashed = await Authenticate.hash(password);
      
      const isValid = await Authenticate.compare(password, hashed);
      expect(isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(200);
      const hashed = await Authenticate.hash(longPassword);
      
      const isValid = await Authenticate.compare(longPassword, hashed);
      expect(isValid).toBe(true);
    });

    it('should handle unicode characters', async () => {
      const password = 'パスワード123🔒';
      const hashed = await Authenticate.hash(password);
      
      const isValid = await Authenticate.compare(password, hashed);
      expect(isValid).toBe(true);
    });
  });
});
