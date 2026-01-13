/**
 * Security Headers Middleware
 * Adds security-related HTTP headers to all responses
 * Similar to helmet.js but for HyperExpress
 */

import { Request, Response } from '../../type';

export interface SecurityHeadersOptions {
  contentSecurityPolicy?: boolean | string;
  strictTransportSecurity?: boolean | string;
  xFrameOptions?: boolean | string;
  xContentTypeOptions?: boolean;
  xXSSProtection?: boolean | string;
  referrerPolicy?: boolean | string;
  permissionsPolicy?: boolean | string;
  crossOriginEmbedderPolicy?: boolean;
  crossOriginOpenerPolicy?: boolean | string;
  crossOriginResourcePolicy?: boolean | string;
}

/**
 * Default security headers configuration
 */
const defaultHeaders: SecurityHeadersOptions = {
  // Content Security Policy - Prevent XSS attacks
  // In development: Allow all external resources for convenience
  // In production: Strict policy for security
  contentSecurityPolicy: process.env.NODE_ENV === 'production'
    ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'self';"
    : `default-src 'self' http: https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: http://localhost:${process.env.VITE_PORT || 5173}; style-src 'self' 'unsafe-inline' http: https: http://localhost:${process.env.VITE_PORT || 5173}; img-src 'self' data: blob: http: https: http://localhost:${process.env.VITE_PORT || 5173}; font-src 'self' data: http: https: http://localhost:${process.env.VITE_PORT || 5173}; connect-src 'self' http: https: ws: wss: http://localhost:${process.env.VITE_PORT || 5173} ws://localhost:${process.env.VITE_PORT || 5173}; frame-ancestors 'self';`,

  // HTTP Strict Transport Security - Force HTTPS in production
  strictTransportSecurity: process.env.NODE_ENV === 'production' ? 'max-age=31536000; includeSubDomains' : false,

  // X-Frame-Options - Prevent clickjacking (can be relaxed in dev if needed)
  xFrameOptions: 'DENY',

  // X-Content-Type-Options - Prevent MIME sniffing
  xContentTypeOptions: true,

  // Disabled legacy headers for performance (browser modern sudah punya built-in protection)
  // xXSSProtection: '1; mode=block',  // Legacy header, browser modern sudah punya built-in XSS protection
  // referrerPolicy: 'strict-origin-when-cross-origin',  // Opsional untuk privacy
  // permissionsPolicy: 'geolocation=(), microphone=(), camera=()',  // Opsional

  // Cross-Origin Embedder Policy - Require CORP/COEP headers
  crossOriginEmbedderPolicy: false, // Enable only if using COOP/COEP

  // Disabled for performance (hanya perlu jika kontrol cross-origin)
  // crossOriginOpenerPolicy: 'same-origin',
  // crossOriginResourcePolicy: 'same-site',
};

/**
 * Pre-computed headers cache
 */
interface PrecomputedHeaders {
  'Content-Security-Policy'?: string;
  'Strict-Transport-Security'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'X-XSS-Protection'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
  'Cross-Origin-Embedder-Policy'?: string;
  'Cross-Origin-Opener-Policy'?: string;
  'Cross-Origin-Resource-Policy'?: string;
  'X-DNS-Prefetch-Control'?: string;
  'X-Download-Options'?: string;
  'X-Permitted-Cross-Domain-Policies'?: string;
}

function precomputeHeaders(config: SecurityHeadersOptions): PrecomputedHeaders {
  const headers: PrecomputedHeaders = {};
  
  if (config.contentSecurityPolicy) {
    headers['Content-Security-Policy'] = typeof config.contentSecurityPolicy === 'string'
      ? config.contentSecurityPolicy
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
  }
  
  if (config.strictTransportSecurity) {
    headers['Strict-Transport-Security'] = typeof config.strictTransportSecurity === 'string'
      ? config.strictTransportSecurity
      : 'max-age=31536000; includeSubDomains';
  }
  
  if (config.xFrameOptions) {
    headers['X-Frame-Options'] = typeof config.xFrameOptions === 'string'
      ? config.xFrameOptions
      : 'DENY';
  }
  
  if (config.xContentTypeOptions) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }
  
  if (config.xXSSProtection) {
    headers['X-XSS-Protection'] = typeof config.xXSSProtection === 'string'
      ? config.xXSSProtection
      : '1; mode=block';
  }
  
  if (config.referrerPolicy) {
    headers['Referrer-Policy'] = typeof config.referrerPolicy === 'string'
      ? config.referrerPolicy
      : 'strict-origin-when-cross-origin';
  }
  
  if (config.permissionsPolicy) {
    headers['Permissions-Policy'] = typeof config.permissionsPolicy === 'string'
      ? config.permissionsPolicy
      : 'geolocation=(), microphone=(), camera=()';
  }
  
  if (config.crossOriginEmbedderPolicy) {
    headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
  }
  
  if (config.crossOriginOpenerPolicy) {
    headers['Cross-Origin-Opener-Policy'] = typeof config.crossOriginOpenerPolicy === 'string'
      ? config.crossOriginOpenerPolicy
      : 'same-origin';
  }
  
  if (config.crossOriginResourcePolicy) {
    headers['Cross-Origin-Resource-Policy'] = typeof config.crossOriginResourcePolicy === 'string'
      ? config.crossOriginResourcePolicy
      : 'same-site';
  }
  
  // Additional security headers
  headers['X-DNS-Prefetch-Control'] = 'off';
  headers['X-Download-Options'] = 'noopen';
  headers['X-Permitted-Cross-Domain-Policies'] = 'none';
  
  return headers;
}

/**
 * Security headers middleware factory
 * @param options Configuration options to override defaults
 */
export function securityHeaders(options: SecurityHeadersOptions = {}) {
  const config = { ...defaultHeaders, ...options };

  return async (request: Request, response: Response) => {
    if (config.contentSecurityPolicy) {
      const csp = typeof config.contentSecurityPolicy === 'string'
        ? config.contentSecurityPolicy
        : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
      response.header('Content-Security-Policy', csp);
    }

    if (config.strictTransportSecurity) {
      const hsts = typeof config.strictTransportSecurity === 'string'
        ? config.strictTransportSecurity
        : 'max-age=31536000; includeSubDomains';
      response.header('Strict-Transport-Security', hsts);
    }

    if (config.xFrameOptions) {
      const frameOptions = typeof config.xFrameOptions === 'string'
        ? config.xFrameOptions
        : 'DENY';
      response.header('X-Frame-Options', frameOptions);
    }

    if (config.xContentTypeOptions) {
      response.header('X-Content-Type-Options', 'nosniff');
    }

    if (config.xXSSProtection) {
      const xssProtection = typeof config.xXSSProtection === 'string'
        ? config.xXSSProtection
        : '1; mode=block';
      response.header('X-XSS-Protection', xssProtection);
    }

    if (config.referrerPolicy) {
      const referrer = typeof config.referrerPolicy === 'string'
        ? config.referrerPolicy
        : 'strict-origin-when-cross-origin';
      response.header('Referrer-Policy', referrer);
    }

    if (config.permissionsPolicy) {
      const permissions = typeof config.permissionsPolicy === 'string'
        ? config.permissionsPolicy
        : 'geolocation=(), microphone=(), camera=()';
      response.header('Permissions-Policy', permissions);
    }

    if (config.crossOriginEmbedderPolicy) {
      response.header('Cross-Origin-Embedder-Policy', 'require-corp');
    }

    if (config.crossOriginOpenerPolicy) {
      const coop = typeof config.crossOriginOpenerPolicy === 'string'
        ? config.crossOriginOpenerPolicy
        : 'same-origin';
      response.header('Cross-Origin-Opener-Policy', coop);
    }

    if (config.crossOriginResourcePolicy) {
      const corp = typeof config.crossOriginResourcePolicy === 'string'
        ? config.crossOriginResourcePolicy
        : 'same-site';
      response.header('Cross-Origin-Resource-Policy', corp);
    }

    response.header('X-DNS-Prefetch-Control', 'off');
    response.header('X-Download-Options', 'noopen');
    response.header('X-Permitted-Cross-Domain-Policies', 'none');
  };
}

/**
 * Preset for development mode - less restrictive
 */
export function developmentSecurityHeaders() {
  return securityHeaders({
    contentSecurityPolicy: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    strictTransportSecurity: false,
  });
}

/**
 * Preset for production mode - most restrictive
 */
export function productionSecurityHeaders() {
  return securityHeaders({
    contentSecurityPolicy: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
    strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
  });
}

export default securityHeaders;
