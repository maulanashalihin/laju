/**
 * Unit Tests for CacheService
 * Testing in-memory caching with TTL
 */

import { describe, it, expect, beforeEach } from 'vitest';
import CacheService from '../../../app/services/CacheService';

describe('CacheService', () => {
  beforeEach(() => {
    // Clear cache before each test
    CacheService.flush();
  });

  describe('Basic Operations', () => {
    it('should store and retrieve a value', () => {
      CacheService.put('key1', 'value1', 5);

      const result = CacheService.get('key1');
      expect(result).toBe('value1');
    });

    it('should return null for non-existent key', () => {
      const result = CacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return null for expired key', async () => {
      CacheService.put('key1', 'value1', 0.01); // 0.01 minutes = 0.6 seconds

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 700));

      const result = CacheService.get('key1');
      expect(result).toBeNull();
    });

    it('should delete expired key on get', async () => {
      CacheService.put('key1', 'value1', 0.01);

      await new Promise(resolve => setTimeout(resolve, 700));

      // First get should return null and delete
      CacheService.get('key1');

      // Key should be deleted
      expect(CacheService.has('key1')).toBe(false);
    });

    it('should update existing key', () => {
      CacheService.put('key1', 'value1', 5);
      CacheService.put('key1', 'value2', 5);

      const result = CacheService.get('key1');
      expect(result).toBe('value2');
    });
  });

  describe('Different Data Types', () => {
    it('should cache string', () => {
      CacheService.put('str', 'hello', 5);
      expect(CacheService.get('str')).toBe('hello');
    });

    it('should cache number', () => {
      CacheService.put('num', 42, 5);
      expect(CacheService.get('num')).toBe(42);
    });

    it('should cache object', () => {
      const obj = { name: 'John', age: 30 };
      CacheService.put('obj', obj, 5);

      const result = CacheService.get('obj');
      expect(result).toEqual(obj);
      // Note: In-memory cache stores reference, so result === obj
      // This is expected behavior for in-memory cache (performance optimization)
      expect(result).toBe(obj);
    });

    it('should cache array', () => {
      const arr = [1, 2, 3];
      CacheService.put('arr', arr, 5);

      const result = CacheService.get('arr');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should cache null', () => {
      CacheService.put('null', null, 5);

      // Note: get returns null for both "not found" and "cached null"
      // This is a design limitation
      const result = CacheService.get('null');
      expect(result).toBeNull();
    });
  });

  describe('remember() - Async', () => {
    it('should return cached value if exists', async () => {
      CacheService.put('key1', 'cached', 5);

      const callback = async () => 'new-value';
      const result = await CacheService.remember('key1', 5, callback);

      expect(result).toBe('cached');
    });

    it('should call callback and cache result if not exists', async () => {
      const callback = async () => 'computed';
      const result = await CacheService.remember('key1', 5, callback);

      expect(result).toBe('computed');
      expect(CacheService.get('key1')).toBe('computed');
    });

    it('should only call callback once for same key', async () => {
      let callCount = 0;
      const callback = async () => {
        callCount++;
        return 'value';
      };

      await CacheService.remember('key1', 5, callback);
      await CacheService.remember('key1', 5, callback);
      await CacheService.remember('key1', 5, callback);

      expect(callCount).toBe(1);
    });

    it('should not cache null values from callback', async () => {
      const callback = async () => null;
      await CacheService.remember('key1', 5, callback);

      // Should call callback again because null wasn't cached
      let callCount = 0;
      const callback2 = async () => {
        callCount++;
        return null;
      };

      await CacheService.remember('key1', 5, callback2);
      expect(callCount).toBe(1); // Callback was called
    });
  });

  describe('rememberSync() - Sync', () => {
    it('should return cached value if exists', () => {
      CacheService.put('key1', 'cached', 5);

      const callback = () => 'new-value';
      const result = CacheService.rememberSync('key1', 5, callback);

      expect(result).toBe('cached');
    });

    it('should call callback and cache result if not exists', () => {
      const callback = () => 'computed';
      const result = CacheService.rememberSync('key1', 5, callback);

      expect(result).toBe('computed');
      expect(CacheService.get('key1')).toBe('computed');
    });
  });

  describe('forget()', () => {
    it('should delete specific key', () => {
      CacheService.put('key1', 'value1', 5);
      CacheService.put('key2', 'value2', 5);

      CacheService.forget('key1');

      expect(CacheService.get('key1')).toBeNull();
      expect(CacheService.get('key2')).toBe('value2');
    });

    it('should not throw for non-existent key', () => {
      expect(() => CacheService.forget('non-existent')).not.toThrow();
    });
  });

  describe('has()', () => {
    it('should return true for existing key', () => {
      CacheService.put('key1', 'value1', 5);
      expect(CacheService.has('key1')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(CacheService.has('non-existent')).toBe(false);
    });

    it('should return false for expired key', async () => {
      CacheService.put('key1', 'value1', 0.01);

      await new Promise(resolve => setTimeout(resolve, 700));

      expect(CacheService.has('key1')).toBe(false);
    });
  });

  describe('ttl()', () => {
    it('should return remaining seconds', () => {
      CacheService.put('key1', 'value1', 5); // 5 minutes = 300 seconds

      const ttl = CacheService.ttl('key1');

      expect(ttl).toBeGreaterThan(295); // Allow some margin
      expect(ttl).toBeLessThanOrEqual(300);
    });

    it('should return 0 for non-existent key', () => {
      expect(CacheService.ttl('non-existent')).toBe(0);
    });

    it('should return 0 for expired key', async () => {
      CacheService.put('key1', 'value1', 0.01);

      await new Promise(resolve => setTimeout(resolve, 700));

      expect(CacheService.ttl('key1')).toBe(0);
    });
  });

  describe('flush()', () => {
    it('should clear all entries', () => {
      CacheService.put('key1', 'value1', 5);
      CacheService.put('key2', 'value2', 5);
      CacheService.put('key3', 'value3', 5);

      CacheService.flush();

      expect(CacheService.get('key1')).toBeNull();
      expect(CacheService.get('key2')).toBeNull();
      expect(CacheService.get('key3')).toBeNull();
      expect(CacheService.stats().size).toBe(0);
    });
  });

  describe('stats()', () => {
    it('should return correct size', () => {
      CacheService.put('key1', 'value1', 5);
      CacheService.put('key2', 'value2', 5);

      const stats = CacheService.stats();

      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });

    it('should return empty stats for empty cache', () => {
      CacheService.flush();
      const stats = CacheService.stats();

      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });
  });

  describe('cleanup()', () => {
    it('should remove expired entries', async () => {
      CacheService.put('key1', 'value1', 0.01); // expires quickly
      CacheService.put('key2', 'value2', 5);    // stays valid

      await new Promise(resolve => setTimeout(resolve, 700));

      const cleaned = CacheService.cleanup();

      expect(cleaned).toBe(1);
      expect(CacheService.has('key1')).toBe(false);
      expect(CacheService.has('key2')).toBe(true);
    });

    it('should return 0 if no entries to clean', () => {
      CacheService.put('key1', 'value1', 5);
      CacheService.put('key2', 'value2', 5);

      const cleaned = CacheService.cleanup();

      expect(cleaned).toBe(0);
    });
  });

  describe('Performance', () => {
    it('should handle high throughput', () => {
      const iterations = 10000;

      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        CacheService.put(`key-${i}`, `value-${i}`, 5);
      }

      for (let i = 0; i < iterations; i++) {
        CacheService.get(`key-${i}`);
      }

      const duration = performance.now() - start;

      // Should complete 20k operations in less than 100ms
      expect(duration).toBeLessThan(100);

      // All values should be retrievable
      expect(CacheService.stats().size).toBe(iterations);
    });
  });
});