/**
 * Rate Limit Middleware
 * Provides flexible rate limiting for routes
 */

import { Request, Response } from '../../type';
import rateLimiter from '../services/RateLimiter';
import { logWarn } from '../services/Logger';

export interface RateLimitOptions {
  windowMs?: number;           // Time window (default: 15 minutes)
  maxRequests?: number;        // Max requests per window (default: 100)
  message?: string;            // Custom error message
  statusCode?: number;         // HTTP status code (default: 429)
  keyGenerator?: (req: Request) => string;  // Custom key generator
  skip?: (req: Request) => boolean;         // Skip rate limiting
  handler?: (req: Request, res: Response) => void;  // Custom handler
}

/**
 * Create rate limit middleware
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const config = {
    windowMs: options.windowMs || 15 * 60 * 1000,  // 15 minutes
    maxRequests: options.maxRequests || 100,
    message: options.message || 'Too many requests, please try again later',
    statusCode: options.statusCode || 429,
    keyGenerator: options.keyGenerator || ((req: Request) => req.ip || 'unknown'),
    skip: options.skip || (() => false),
    handler: options.handler
  };

  return async (request: Request, response: Response, next?: Function) => {
    // Skip if condition met
    if (config.skip(request)) {
      if (next) next();
      return;
    }

    // Generate key
    const key = config.keyGenerator(request);

    // Check rate limit
    const result = rateLimiter.check(key, {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      message: config.message
    });

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
    response.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    response.setHeader('X-RateLimit-Reset', new Date(result.resetAt).toISOString());

    // If rate limit exceeded
    if (!result.allowed) {
      response.setHeader('Retry-After', result.retryAfter?.toString() || '60');

      logWarn('Rate limit exceeded', {
        ip: request.ip,
        url: request.url,
        method: request.method,
        key,
        retryAfter: result.retryAfter
      });

      // Use custom handler if provided
      if (config.handler) {
        return config.handler(request, response);
      }

      // Default response
      return response.status(config.statusCode).json({
        success: false,
        error: {
          message: config.message,
          code: 'RATE_LIMIT_EXCEEDED',
          statusCode: config.statusCode,
          retryAfter: result.retryAfter
        }
      });
    }

    // Continue to next middleware
    if (next) next();
  };
}

/**
 * Preset rate limiters for common use cases
 */

// Strict rate limit for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 5,             // 5 requests
  message: 'Too many login attempts, please try again later'
});

// Moderate rate limit for API endpoints
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 100,           // 100 requests
  message: 'Too many API requests, please try again later'
});

// Lenient rate limit for general routes
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 1000,          // 1000 requests
  message: 'Too many requests, please try again later'
});

// Very strict for password reset
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 3,             // 3 requests
  message: 'Too many password reset attempts, please try again later',
  keyGenerator: (req) => {
    // Use email from request body if available
    const email = req.body?.email || req.ip;
    return `password-reset:${email}`;
  }
});

// Email sending rate limit
export const emailRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 10,            // 10 emails
  message: 'Too many emails sent, please try again later',
  keyGenerator: (req) => {
    const userId = req.user?.id || req.ip;
    return `email:${userId}`;
  }
});

// File upload rate limit
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 50,            // 50 uploads
  message: 'Too many file uploads, please try again later',
  keyGenerator: (req) => {
    const userId = req.user?.id || req.ip;
    return `upload:${userId}`;
  }
});

// Create account rate limit (by IP)
export const createAccountRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 3,             // 3 accounts
  message: 'Too many accounts created from this IP, please try again later'
});

/**
 * Rate limit by user ID (for authenticated routes)
 */
export const userRateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (req) => {
      const userId = req.user?.id || req.ip;
      return `user:${userId}`;
    },
    skip: (req) => !req.user  // Skip if not authenticated
  });
};

/**
 * Rate limit by custom key
 */
export const customRateLimit = (
  key: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
) => {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: () => key
  });
};

export default rateLimit;
