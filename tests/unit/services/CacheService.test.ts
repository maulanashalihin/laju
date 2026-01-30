/**
 * Unit Tests for CacheService
 * Testing in-memory caching with TTL
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CacheService } from '../../../app/services/CacheService';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService();
  });

  describe('Basic Operations', () => {
    it('should store and retrieve a value', () => {
      cache.put('key1', 'value1', 5);
      
      const result = cache.get('key1');
      expect(result).toBe('value1');
    });

    it('should return null for non-existent key', () => {
      const result = cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return null for expired key', async () => {
      cache.put('key1', 'value1', 0.01); // 0.01 minutes = 0.6 seconds
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const result = cache.get('key1');
      expect(result).toBeNull();
    });

    it('should delete expired key on get', async () => {
      cache.put('key1', 'value1', 0.01);
      
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // First get should return null and delete
      cache.get('key1');
      
      // Key should be deleted
      expect(cache.has('key1')).toBe(false);
    });

    it('should update existing key', () => {
      cache.put('key1', 'value1', 5);
      cache.put('key1', 'value2', 5);
      
      const result = cache.get('key1');
      expect(result).toBe('value2');
    });
  });

  describe('Different Data Types', () => {
    it('should cache string', () => {
      cache.put('str', 'hello', 5);
      expect(cache.get('str')).toBe('hello');
    });

    it('should cache number', () => {
      cache.put('num', 42, 5);
      expect(cache.get('num')).toBe(42);
    });

    it('should cache object', () => {
      const obj = { name: 'John', age: 30 };
      cache.put('obj', obj, 5);
      
      const result = cache.get('obj');
      expect(result).toEqual(obj);
      // Note: In-memory cache stores reference, so result === obj
      // This is expected behavior for in-memory cache (performance optimization)
      expect(result).toBe(obj);
    });

    it('should cache array', () => {
      const arr = [1, 2, 3];
      cache.put('arr', arr, 5);
      
      const result = cache.get('arr');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should cache null', () => {
      cache.put('null', null, 5);
      
      // Note: get returns null for both "not found" and "cached null"
      // This is a design limitation
      const result = cache.get('null');
      expect(result).toBeNull();
    });
  });

  describe('remember() - Async', () => {
    it('should return cached value if exists', async () => {
      cache.put('key1', 'cached', 5);
      
      const callback = async () => 'new-value';
      const result = await cache.remember('key1', 5, callback);
      
      expect(result).toBe('cached');
    });

    it('should call callback and cache result if not exists', async () => {
      const callback = async () => 'computed';
      const result = await cache.remember('key1', 5, callback);
      
      expect(result).toBe('computed');
      expect(cache.get('key1')).toBe('computed');
    });

    it('should only call callback once for same key', async () => {
      let callCount = 0;
      const callback = async () => {
        callCount++;
        return 'value';
      };
      
      await cache.remember('key1', 5, callback);
      await cache.remember('key1', 5, callback);
      await cache.remember('key1', 5, callback);
      
      expect(callCount).toBe(1);
    });

    it('should not cache null values from callback', async () => {
      const callback = async () => null;
      await cache.remember('key1', 5, callback);
      
      // Should call callback again because null wasn't cached
      let callCount = 0;
      const callback2 = async () => {
        callCount++;
        return null;
      };
      
      await cache.remember('key1', 5, callback2);
      expect(callCount).toBe(1); // Callback was called
    });
  });

  describe('rememberSync() - Sync', () => {
    it('should return cached value if exists', () => {
      cache.put('key1', 'cached', 5);
      
      const callback = () => 'new-value';
      const result = cache.rememberSync('key1', 5, callback);
      
      expect(result).toBe('cached');
    });

    it('should call callback and cache result if not exists', () => {
      const callback = () => 'computed';
      const result = cache.rememberSync('key1', 5, callback);
      
      expect(result).toBe('computed');
      expect(cache.get('key1')).toBe('computed');
    });
  });

  describe('forget()', () => {
    it('should delete specific key', () => {
      cache.put('key1', 'value1', 5);
      cache.put('key2', 'value2', 5);
      
      cache.forget('key1');
      
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
    });

    it('should not throw for non-existent key', () => {
      expect(() => cache.forget('non-existent')).not.toThrow();
    });
  });

  describe('has()', () => {
    it('should return true for existing key', () => {
      cache.put('key1', 'value1', 5);
      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(cache.has('non-existent')).toBe(false);
    });

    it('should return false for expired key', async () => {
      cache.put('key1', 'value1', 0.01);
      
      await new Promise(resolve => setTimeout(resolve, 700));
      
      expect(cache.has('key1')).toBe(false);
    });
  });

  describe('ttl()', () => {
    it('should return remaining seconds', () => {
      cache.put('key1', 'value1', 5); // 5 minutes = 300 seconds
      
      const ttl = cache.ttl('key1');
      
      expect(ttl).toBeGreaterThan(295); // Allow some margin
      expect(ttl).toBeLessThanOrEqual(300);
    });

    it('should return 0 for non-existent key', () => {
      expect(cache.ttl('non-existent')).toBe(0);
    });

    it('should return 0 for expired key', async () => {
      cache.put('key1', 'value1', 0.01);
      
      await new Promise(resolve => setTimeout(resolve, 700));
      
      expect(cache.ttl('key1')).toBe(0);
    });
  });

  describe('flush()', () => {
    it('should clear all entries', () => {
      cache.put('key1', 'value1', 5);
      cache.put('key2', 'value2', 5);
      cache.put('key3', 'value3', 5);
      
      cache.flush();
      
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
      expect(cache.get('key3')).toBeNull();
      expect(cache.stats().size).toBe(0);
    });
  });

  describe('stats()', () => {
    it('should return correct size', () => {
      cache.put('key1', 'value1', 5);
      cache.put('key2', 'value2', 5);
      
      const stats = cache.stats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });

    it('should return empty stats for empty cache', () => {
      const stats = cache.stats();
      
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });
  });

  describe('cleanup()', () => {
    it('should remove expired entries', async () => {
      cache.put('key1', 'value1', 0.01); // expires quickly
      cache.put('key2', 'value2', 5);    // stays valid
      
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const cleaned = cache.cleanup();
      
      expect(cleaned).toBe(1);
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(true);
    });

    it('should return 0 if no entries to clean', () => {
      cache.put('key1', 'value1', 5);
      cache.put('key2', 'value2', 5);
      
      const cleaned = cache.cleanup();
      
      expect(cleaned).toBe(0);
    });
  });

  describe('Performance', () => {
    it('should handle high throughput', () => {
      const iterations = 10000;
      
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        cache.put(`key-${i}`, `value-${i}`, 5);
      }
      
      for (let i = 0; i < iterations; i++) {
        cache.get(`key-${i}`);
      }
      
      const duration = performance.now() - start;
      
      // Should complete 20k operations in less than 100ms
      expect(duration).toBeLessThan(100);
      
      // All values should be retrievable
      expect(cache.stats().size).toBe(iterations);
    });
  });
});
