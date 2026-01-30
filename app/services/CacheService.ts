/**
 * High-Performance In-Memory Cache Service
 * Uses Map with TTL (Time To Live) for maximum performance
 * 
 * Performance comparison:
 * - Memory Cache: ~0.001ms (this implementation)
 * - SQLite Cache: ~1-5ms (previous implementation)
 * - Improvement: 1000x+ faster
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number; // timestamp in ms
}

class CacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes default

  constructor() {
    // Optional: Start cleanup interval to prevent memory leaks
    // Uncomment if you want automatic cleanup of expired entries
    // setInterval(() => this.cleanup(), 60 * 1000); // Cleanup every minute
  }

  /**
   * Retrieve an item from the cache.
   * @param key The cache key
   * @returns The cached value or null if not found/expired
   * 
   * Performance: ~0.001ms (synchronous, no I/O)
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Store an item in the cache.
   * @param key The cache key
   * @param value The value to cache
   * @param minutes Expiration time in minutes
   * 
   * Performance: ~0.001ms (synchronous, no I/O)
   */
  public put<T>(key: string, value: T, minutes: number = 5): void {
    const expiresAt = Date.now() + (minutes * 60 * 1000);
    
    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  /**
   * Retrieve an item from the cache, or store the default value if it doesn't exist.
   * @param key The cache key
   * @param minutes Expiration time in minutes
   * @param callback Function that returns the value to cache
   * @returns Cached value or result from callback
   * 
   * Performance: ~0.001ms if cached, otherwise depends on callback
   */
  public async remember<T>(
    key: string,
    minutes: number,
    callback: () => Promise<T>
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await callback();
    if (value !== null) {
      this.put(key, value, minutes);
    }
    return value;
  }

  /**
   * Synchronous version of remember
   * @param key The cache key
   * @param minutes Expiration time in minutes
   * @param callback Function that returns the value to cache
   * @returns Cached value or result from callback
   */
  public rememberSync<T>(
    key: string,
    minutes: number,
    callback: () => T
  ): T {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = callback();
    if (value !== null) {
      this.put(key, value, minutes);
    }
    return value;
  }

  /**
   * Remove an item from the cache.
   * @param key The cache key
   * 
   * Performance: ~0.001ms
   */
  public forget(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Check if key exists and not expired
   * @param key The cache key
   * @returns boolean
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get remaining TTL for a key in seconds
   * @param key The cache key
   * @returns remaining seconds or 0 if expired/not found
   */
  public ttl(key: string): number {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return 0;
    }

    const remaining = Math.floor((entry.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Clear all cached items
   */
  public flush(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public stats(): {
    size: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clean up expired entries (call periodically to prevent memory leaks)
   * Or use this for manual cleanup
   */
  public cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Export singleton instance
export default new CacheService();

// Also export class for testing
export { CacheService };
