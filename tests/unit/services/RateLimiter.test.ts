/**
 * Unit Tests for Rate Limiter Service
 * Testing rate limiting logic and sliding window algorithm
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import rateLimiter from '../../../app/services/RateLimiter';

describe('RateLimiter Service', () => {
  beforeEach(() => {
    // Reset rate limiter before each test
    rateLimiter.resetAll();
  });

  afterEach(() => {
    // Cleanup after each test
    rateLimiter.resetAll();
  });

  describe('Basic Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const key = 'test-user-1';
      const config = {
        windowMs: 60000, // 1 minute
        maxRequests: 5
      };

      // Make 5 requests (should all be allowed)
      for (let i = 0; i < 5; i++) {
        const result = rateLimiter.check(key, config);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(5 - i - 1);
      }
    });

    it('should block requests exceeding limit', () => {
      const key = 'test-user-2';
      const config = {
        windowMs: 60000,
        maxRequests: 3
      };

      // Make 3 requests (allowed)
      for (let i = 0; i < 3; i++) {
        const result = rateLimiter.check(key, config);
        expect(result.allowed).toBe(true);
      }

      // 4th request should be blocked
      const result = rateLimiter.check(key, config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should track remaining requests correctly', () => {
      const key = 'test-user-3';
      const config = {
        windowMs: 60000,
        maxRequests: 10
      };

      // First request
      let result = rateLimiter.check(key, config);
      expect(result.remaining).toBe(9);

      // Second request
      result = rateLimiter.check(key, config);
      expect(result.remaining).toBe(8);

      // Third request
      result = rateLimiter.check(key, config);
      expect(result.remaining).toBe(7);
    });
  });

  describe('Window Reset', () => {
    it('should reset after window expires', async () => {
      const key = 'test-user-4';
      const config = {
        windowMs: 100, // 100ms window
        maxRequests: 2
      };

      // Use up the limit
      rateLimiter.check(key, config);
      rateLimiter.check(key, config);

      // Should be blocked
      let result = rateLimiter.check(key, config);
      expect(result.allowed).toBe(false);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be allowed again
      result = rateLimiter.check(key, config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(1);
    });
  });

  describe('Multiple Keys', () => {
    it('should track different keys independently', () => {
      const config = {
        windowMs: 60000,
        maxRequests: 2
      };

      // User 1 makes 2 requests
      rateLimiter.check('user-1', config);
      rateLimiter.check('user-1', config);

      // User 1 should be blocked
      let result = rateLimiter.check('user-1', config);
      expect(result.allowed).toBe(false);

      // User 2 should still be allowed
      result = rateLimiter.check('user-2', config);
      expect(result.allowed).toBe(true);
    });
  });

  describe('Reset Functions', () => {
    it('should reset specific key', () => {
      const key = 'test-user-5';
      const config = {
        windowMs: 60000,
        maxRequests: 2
      };

      // Use up the limit
      rateLimiter.check(key, config);
      rateLimiter.check(key, config);

      // Should be blocked
      let result = rateLimiter.check(key, config);
      expect(result.allowed).toBe(false);

      // Reset the key
      rateLimiter.reset(key);

      // Should be allowed again
      result = rateLimiter.check(key, config);
      expect(result.allowed).toBe(true);
    });

    it('should reset all keys', () => {
      const config = {
        windowMs: 60000,
        maxRequests: 1
      };

      // Multiple users hit limit
      rateLimiter.check('user-1', config);
      rateLimiter.check('user-2', config);
      rateLimiter.check('user-3', config);

      // All should be blocked
      expect(rateLimiter.check('user-1', config).allowed).toBe(false);
      expect(rateLimiter.check('user-2', config).allowed).toBe(false);
      expect(rateLimiter.check('user-3', config).allowed).toBe(false);

      // Reset all
      rateLimiter.resetAll();

      // All should be allowed
      expect(rateLimiter.check('user-1', config).allowed).toBe(true);
      expect(rateLimiter.check('user-2', config).allowed).toBe(true);
      expect(rateLimiter.check('user-3', config).allowed).toBe(true);
    });
  });

  describe('Status Tracking', () => {
    it('should return current status', () => {
      const key = 'test-user-6';
      const config = {
        windowMs: 60000,
        maxRequests: 5
      };

      // Make some requests
      rateLimiter.check(key, config);
      rateLimiter.check(key, config);

      // Get status
      const status = rateLimiter.getStatus(key);
      expect(status).toBeDefined();
      expect(status?.count).toBe(2);
      expect(status?.requests.length).toBe(2);
    });

    it('should return undefined for non-existent key', () => {
      const status = rateLimiter.getStatus('non-existent');
      expect(status).toBeUndefined();
    });

    it('should track total number of keys', () => {
      const config = {
        windowMs: 60000,
        maxRequests: 10
      };

      expect(rateLimiter.size()).toBe(0);

      rateLimiter.check('user-1', config);
      expect(rateLimiter.size()).toBe(1);

      rateLimiter.check('user-2', config);
      expect(rateLimiter.size()).toBe(2);

      rateLimiter.check('user-3', config);
      expect(rateLimiter.size()).toBe(3);
    });
  });

  describe('Sliding Window', () => {
    it('should use sliding window algorithm', async () => {
      const key = 'test-user-7';
      const config = {
        windowMs: 200, // 200ms window
        maxRequests: 3
      };

      // Make 3 requests at t=0
      rateLimiter.check(key, config);
      rateLimiter.check(key, config);
      rateLimiter.check(key, config);

      // Should be blocked
      expect(rateLimiter.check(key, config).allowed).toBe(false);

      // Wait 100ms (half the window)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Still blocked (old requests still in window)
      expect(rateLimiter.check(key, config).allowed).toBe(false);

      // Wait another 150ms (total 250ms, old requests expired)
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be allowed (old requests outside window)
      expect(rateLimiter.check(key, config).allowed).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero max requests', () => {
      const key = 'test-user-8';
      const config = {
        windowMs: 60000,
        maxRequests: 0
      };

      const result = rateLimiter.check(key, config);
      expect(result.allowed).toBe(false);
    });

    it('should handle very large max requests', () => {
      const key = 'test-user-9';
      const config = {
        windowMs: 60000,
        maxRequests: 1000000
      };

      // Make many requests
      for (let i = 0; i < 100; i++) {
        const result = rateLimiter.check(key, config);
        expect(result.allowed).toBe(true);
      }
    });

    it('should handle concurrent requests for same key', () => {
      const key = 'test-user-10';
      const config = {
        windowMs: 60000,
        maxRequests: 5
      };

      // Simulate concurrent requests
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(rateLimiter.check(key, config));
      }

      // First 5 should be allowed
      expect(results.slice(0, 5).every(r => r.allowed)).toBe(true);

      // Rest should be blocked
      expect(results.slice(5).every(r => !r.allowed)).toBe(true);
    });
  });
});
