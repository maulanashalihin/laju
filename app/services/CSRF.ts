/**
 * CSRF Protection Service
 * Generates and validates CSRF tokens using crypto
 */

import { randomBytes, createHmac } from 'crypto';
import { Request, Response } from '../../type';

const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex');
export const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

interface TokenData {
  token: string;
  timestamp: number;
}

// Cache for generated tokens to avoid repeated crypto operations
interface CachedToken {
  token: string;
  expiresAt: number;
}

let tokenCache: CachedToken | null = null;

class CSRFService {
  /**
   * Generate a CSRF token (cached)
   * Returns token to be stored in cookie and sent to client
   */
  generate(): string {
    const now = Date.now();
    
    // Return cached token if still valid
    if (tokenCache && tokenCache.expiresAt > now) {
      return tokenCache.token;
    }
    
    // Generate new token
    const timestamp = now;
    const randomPart = randomBytes(16).toString('hex');
    const data = `${timestamp}:${randomPart}`;
    const signature = createHmac('sha256', CSRF_SECRET).update(data).digest('hex');
    const token = `${data}:${signature}`;
    
    // Cache the token with expiry
    tokenCache = {
      token,
      expiresAt: now + TOKEN_EXPIRY
    };
    
    return token;
  }

  /**
   * Validate a CSRF token
   */
  validate(token: string): boolean {
    if (!token) return false;

    const parts = token.split(':');
    if (parts.length !== 3) return false;

    const [timestamp, randomPart, signature] = parts;
    const tokenTime = parseInt(timestamp, 10);

    // Check expiry
    if (Date.now() - tokenTime > TOKEN_EXPIRY) {
      return false;
    }

    // Verify signature
    const data = `${timestamp}:${randomPart}`;
    const expectedSignature = createHmac('sha256', CSRF_SECRET).update(data).digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Set CSRF token in cookie and return token for forms
   */
  setToken(response: Response): string {
    const token = this.generate();
    response.cookie('csrf_token', token, TOKEN_EXPIRY, {
      httpOnly: false, // Must be readable by JS for AJAX
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    return token;
  }
  
  /**
   * Force regenerate token (for token rotation)
   */
  regenerate(): string {
    const now = Date.now();
    const timestamp = now;
    const randomPart = randomBytes(16).toString('hex');
    const data = `${timestamp}:${randomPart}`;
    const signature = createHmac('sha256', CSRF_SECRET).update(data).digest('hex');
    const token = `${data}:${signature}`;
    
    // Update cache
    tokenCache = {
      token,
      expiresAt: now + TOKEN_EXPIRY
    };
    
    return token;
  }

  /**
   * Get token from request (header or body)
   */
  getTokenFromRequest(request: Request): string | null {
    // Check header first (for AJAX)
    const headerToken = request.headers['x-csrf-token'] as string;
    if (headerToken) return headerToken;

    // Check body (for forms)
    const body = request.body as Record<string, unknown>;
    if (body && typeof body._csrf === 'string') return body._csrf;

    return null;
  }
}

export default new CSRFService();
