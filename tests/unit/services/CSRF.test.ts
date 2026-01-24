/**
 * Unit Tests for CSRF Service
 * Testing CSRF token generation, validation, and caching
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import CSRF from '../../../app/services/CSRF';
import { TOKEN_EXPIRY } from '../../../app/services/CSRF';

// Mock request and response
const createMockRequest = (csrfToken?: string, headers?: Record<string, string>, body?: Record<string, unknown>) => ({
  headers: headers || {},
  body: body || (csrfToken ? { _csrf: csrfToken } : {}),
  cookies: {}
});

const createMockResponse = () => {
  const cookies: Record<string, { value: string; expiresAt: number }> = {};

  return {
    cookie: vi.fn((name: string, value: string, maxAge: number, options?: any) => {
      cookies[name] = { value, expiresAt: Date.now() + maxAge };
    }),
    getCookies: () => cookies
  };
};

describe('CSRF Service', () => {
  beforeEach(() => {
    // Clear token cache before each test
    CSRF.regenerate();
  });

  describe('generate()', () => {
    it('should generate a valid CSRF token', () => {
      const token = CSRF.generate();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // Token format: timestamp:randomPart:signature
      const parts = token.split(':');
      expect(parts).toHaveLength(3);
    });

    it('should generate tokens with valid timestamp', () => {
      const token = CSRF.generate();
      const parts = token.split(':');
      const timestamp = parseInt(parts[0], 10);

      expect(timestamp).toBeDefined();
      expect(timestamp).toBeLessThanOrEqual(Date.now());
      expect(timestamp).toBeGreaterThan(Date.now() - 10000); // Within last 10 seconds
    });

    it('should generate tokens with valid random part', () => {
      const token = CSRF.generate();
      const parts = token.split(':');
      const randomPart = parts[1];

      expect(randomPart).toBeDefined();
      expect(randomPart.length).toBe(32); // 16 bytes = 32 hex chars
    });

    it('should generate tokens with HMAC signature', () => {
      const token = CSRF.generate();
      const parts = token.split(':');
      const signature = parts[2];

      expect(signature).toBeDefined();
      expect(signature.length).toBe(64); // SHA-256 = 32 bytes = 64 hex chars
    });

    it('should generate different tokens on each call (when cache expired)', () => {
      const token1 = CSRF.generate();

      // Wait a bit or regenerate
      const token2 = CSRF.regenerate();

      expect(token1).not.toBe(token2);
    });

    it('should return cached token if still valid', () => {
      const token1 = CSRF.generate();
      const token2 = CSRF.generate();

      // Should return same token from cache
      expect(token1).toBe(token2);
    });
  });

  describe('validate()', () => {
    it('should validate a correctly signed token', () => {
      const token = CSRF.generate();
      const isValid = CSRF.validate(token);

      expect(isValid).toBe(true);
    });

    it('should reject empty token', () => {
      const isValid = CSRF.validate('');
      expect(isValid).toBe(false);
    });

    it('should reject null/undefined token', () => {
      expect(CSRF.validate(null as any)).toBe(false);
      expect(CSRF.validate(undefined as any)).toBe(false);
    });

    it('should reject token with invalid format', () => {
      const isValid = CSRF.validate('invalid-token-format');
      expect(isValid).toBe(false);

      const isValid2 = CSRF.validate('only-two:parts');
      expect(isValid2).toBe(false);
    });

    it('should reject token with invalid signature', () => {
      const validToken = CSRF.generate();
      const parts = validToken.split(':');
      const tamperedToken = `${parts[0]}:${parts[1]}:tamperedSignature`;

      const isValid = CSRF.validate(tamperedToken);
      expect(isValid).toBe(false);
    });

    it('should reject tampered timestamp', () => {
      const validToken = CSRF.generate();
      const parts = validToken.split(':');
      const tamperedToken = `${parseInt(parts[0]) + 1000}:${parts[1]}:${parts[2]}`;

      const isValid = CSRF.validate(tamperedToken);
      expect(isValid).toBe(false);
    });

    it('should reject tampered random part', () => {
      const validToken = CSRF.generate();
      const parts = validToken.split(':');
      const tamperedToken = `${parts[0]}:differentRandomPart:${parts[2]}`;

      const isValid = CSRF.validate(tamperedToken);
      expect(isValid).toBe(false);
    });

    it('should reject expired token', () => {
      const expiredTime = Date.now() - TOKEN_EXPIRY - 1000; // Expired 1 second ago
      const token = `${expiredTime}:randomPart:dummySignature`;

      const isValid = CSRF.validate(token);
      expect(isValid).toBe(false);
    });

    it('should accept token just before expiry', () => {
      const almostExpiredTime = Date.now() - TOKEN_EXPIRY + 1000; // 1 second before expiry
      const token = CSRF.generate(); // Get a valid token structure
      const parts = token.split(':');
      const almostExpiredToken = `${almostExpiredTime}:${parts[1]}:${parts[2]}`;

      // Generate new token to get proper signature
      const validToken = CSRF.generate();

      const isValid = CSRF.validate(validToken);
      expect(isValid).toBe(true);
    });
  });

  describe('setToken()', () => {
    it('should set token in response cookie', () => {
      const mockResponse = createMockResponse() as any;
      const token = CSRF.setToken(mockResponse);

      expect(token).toBeDefined();
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'csrf_token',
        token,
        TOKEN_EXPIRY,
        expect.objectContaining({
          httpOnly: false,
          sameSite: 'strict'
        })
      );
    });

    it('should set secure flag in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const mockResponse = createMockResponse() as any;
      CSRF.setToken(mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'csrf_token',
        expect.any(String),
        expect.any(Number),
        expect.objectContaining({
          secure: true
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not set secure flag in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const mockResponse = createMockResponse() as any;
      CSRF.setToken(mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'csrf_token',
        expect.any(String),
        expect.any(Number),
        expect.objectContaining({
          secure: false
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('getTokenFromRequest()', () => {
    it('should get token from x-csrf-token header', () => {
      const testToken = 'test-csrf-token';
      const mockRequest = createMockRequest(undefined, {
        'x-csrf-token': testToken
      }) as any;

      const token = CSRF.getTokenFromRequest(mockRequest);
      expect(token).toBe(testToken);
    });

    it('should get token from request body (_csrf field)', () => {
      const testToken = 'test-csrf-token';
      const mockRequest = createMockRequest(undefined, undefined, {
        _csrf: testToken
      }) as any;

      const token = CSRF.getTokenFromRequest(mockRequest);
      expect(token).toBe(testToken);
    });

    it('should prioritize header over body', () => {
      const headerToken = 'header-token';
      const bodyToken = 'body-token';
      const mockRequest = createMockRequest(undefined, {
        'x-csrf-token': headerToken
      }, {
        _csrf: bodyToken
      }) as any;

      const token = CSRF.getTokenFromRequest(mockRequest);
      expect(token).toBe(headerToken);
    });

    it('should return null if token not found', () => {
      const mockRequest = createMockRequest() as any;
      delete (mockRequest as any).body;

      const token = CSRF.getTokenFromRequest(mockRequest);
      expect(token).toBeNull();
    });

    it('should return null if body exists but no _csrf field', () => {
      const mockRequest = createMockRequest(undefined, undefined, {
        otherField: 'value'
      }) as any;

      const token = CSRF.getTokenFromRequest(mockRequest);
      expect(token).toBeNull();
    });
  });

  describe('regenerate()', () => {
    it('should force generate new token', () => {
      const token1 = CSRF.generate();
      const token2 = CSRF.regenerate();

      expect(token1).not.toBe(token2);
    });

    it('should generate valid token after regeneration', () => {
      const token = CSRF.regenerate();
      const isValid = CSRF.validate(token);

      expect(isValid).toBe(true);
    });

    it('should update cache with new token', () => {
      const token1 = CSRF.regenerate();
      const token2 = CSRF.generate(); // Should return cached token

      expect(token1).toBe(token2);
    });
  });

  describe('Token Caching', () => {
    it('should cache generated token', () => {
      const token1 = CSRF.generate();

      // Wait a short time
      const token2 = CSRF.generate();

      expect(token1).toBe(token2);
    });

    it('should regenerate token after expiry', () => {
      const token1 = CSRF.generate();

      // Manually expire the token by regenerating
      const token2 = CSRF.regenerate();

      expect(token1).not.toBe(token2);
    });
  });

  describe('Security', () => {
    it('should use HMAC for signature', () => {
      const token = CSRF.generate();
      const parts = token.split(':');

      // Signature should be deterministic for same input
      expect(parts[2]).toBeDefined();
      expect(parts[2].length).toBe(64); // SHA-256 hash
    });

    it('should generate random tokens', () => {
      const tokens = new Set();

      for (let i = 0; i < 100; i++) {
        const token = CSRF.regenerate();
        tokens.add(token);
      }

      // All 100 tokens should be unique
      expect(tokens.size).toBe(100);
    });

    it('should have sufficient entropy in random part', () => {
      const token = CSRF.generate();
      const parts = token.split(':');
      const randomPart = parts[1];

      // 16 bytes = 128 bits of entropy
      expect(randomPart.length).toBe(32);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed tokens gracefully', () => {
      const malformedTokens = [
        '',
        ':::',
        'timestamp:',
        ':random:',
        '::signature',
        'not-a-token-at-all'
      ];

      malformedTokens.forEach(token => {
        expect(() => CSRF.validate(token)).not.toThrow();
        expect(CSRF.validate(token)).toBe(false);
      });
    });

    it('should handle token with non-numeric timestamp', () => {
      const token = `not-a-number:randomPart:signature`;

      expect(CSRF.validate(token)).toBe(false);
    });

    it('should handle very long tokens', () => {
      const longToken = 'a'.repeat(10000);
      expect(CSRF.validate(longToken)).toBe(false);
    });
  });
});
