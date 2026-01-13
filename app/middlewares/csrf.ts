/**
 * CSRF Protection Middleware
 * Validates CSRF tokens on state-changing requests (POST, PUT, PATCH, DELETE)
 */

import { Request, Response } from '../../type';
import CSRF, { TOKEN_EXPIRY } from '../services/CSRF';

export interface CSRFOptions {
  excludePaths?: string[];  // Paths to exclude from CSRF check
  excludeAPIs?: boolean;    // Exclude /api/* routes (for token-based auth)
}

/**
 * CSRF middleware factory
 * @param options Configuration options
 */
export function csrf(options: CSRFOptions = {}) {
  const config = {
    excludePaths: new Set(options.excludePaths || []), // Use Set for O(1) lookup
    excludeAPIs: options.excludeAPIs ?? true  // Default: exclude API routes
  };

  return async (request: Request, response: Response) => {
    const method = request.method.toUpperCase();
    const path = request.path;

    // Only check state-changing methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      // For GET requests, ensure token exists in cookie
      if (!request.cookies.csrf_token) {
        CSRF.setToken(response);
      }
      return; // Continue to next handler
    }

    // Skip excluded paths (O(1) with Set)
    for (const excludedPath of config.excludePaths) {
      if (path.startsWith(excludedPath)) {
        return;
      }
    }

    // Skip API routes if configured
    if (config.excludeAPIs && path.startsWith('/api/')) {
      return;
    }

    // Validate CSRF token
    const token = CSRF.getTokenFromRequest(request);
    const cookieToken = request.cookies.csrf_token;

    if (!token || !cookieToken || token !== cookieToken || !CSRF.validate(token)) {
      return response.status(403).json({
        success: false,
        error: {
          message: 'Invalid CSRF token',
          code: 'CSRF_INVALID'
        }
      });
    }

    // Token valid, generate new one for next request (token rotation)
    const newToken = CSRF.regenerate();
    response.cookie('csrf_token', newToken, TOKEN_EXPIRY, {
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  };
}

/**
 * Simple CSRF check for individual routes
 * Use this when you don't want global CSRF but need it on specific routes
 */
export async function csrfCheck(request: Request, response: Response) {
  const token = CSRF.getTokenFromRequest(request);
  const cookieToken = request.cookies.csrf_token;

  if (!token || !cookieToken || token !== cookieToken || !CSRF.validate(token)) {
    return response.status(403).json({
      success: false,
      error: {
        message: 'Invalid CSRF token',
        code: 'CSRF_INVALID'
      }
    });
  }

  // Rotate token
  const newToken = CSRF.regenerate();
  response.cookie('csrf_token', newToken, TOKEN_EXPIRY, {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
}

export default csrf;
