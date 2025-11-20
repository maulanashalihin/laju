/**
 * Rate Limiter Service
 * In-memory rate limiting with sliding window algorithm
 * For production with multiple servers, consider using Redis
 */

import { logWarn } from './Logger';

interface RateLimitRecord {
  count: number;
  resetAt: number;
  requests: number[];
}

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  message?: string;      // Custom error message
  skipSuccessfulRequests?: boolean;  // Don't count successful requests
  skipFailedRequests?: boolean;      // Don't count failed requests
}

class RateLimiterService {
  private store: Map<string, RateLimitRecord>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.store = new Map();
    
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request should be rate limited
   * @param key - Unique identifier (IP, user ID, etc.)
   * @param config - Rate limit configuration
   * @returns Object with allowed status and retry info
   */
  public check(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
  } {
    const now = Date.now();
    let record = this.store.get(key);

    // Create new record if doesn't exist
    if (!record) {
      record = {
        count: 0,
        resetAt: now + config.windowMs,
        requests: []
      };
      this.store.set(key, record);
    }

    // Reset if window expired
    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + config.windowMs;
      record.requests = [];
    }

    // Sliding window: remove old requests
    record.requests = record.requests.filter(
      timestamp => timestamp > now - config.windowMs
    );

    // Check if limit exceeded
    if (record.requests.length >= config.maxRequests) {
      const oldestRequest = record.requests[0];
      const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);

      logWarn('Rate limit exceeded', {
        key,
        requests: record.requests.length,
        maxRequests: config.maxRequests,
        retryAfter
      });

      return {
        allowed: false,
        remaining: 0,
        resetAt: record.resetAt,
        retryAfter
      };
    }

    // Add current request
    record.requests.push(now);
    record.count++;

    return {
      allowed: true,
      remaining: config.maxRequests - record.requests.length,
      resetAt: record.resetAt
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  public reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Reset all rate limits
   */
  public resetAll(): void {
    this.store.clear();
  }

  /**
   * Get current status for a key
   */
  public getStatus(key: string): RateLimitRecord | undefined {
    return this.store.get(key);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, record] of this.store.entries()) {
      if (now > record.resetAt + 60000) { // 1 minute grace period
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logWarn(`Rate limiter cleanup: removed ${cleaned} expired entries`);
    }
  }

  /**
   * Get total number of tracked keys
   */
  public size(): number {
    return this.store.size;
  }

  /**
   * Destroy the rate limiter (cleanup interval)
   */
  public destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiterService();

export default rateLimiter;
