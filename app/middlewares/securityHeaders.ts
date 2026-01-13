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
  contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self';",

  // HTTP Strict Transport Security - Force HTTPS in production
  strictTransportSecurity: process.env.NODE_ENV === 'production' ? 'max-age=31536000; includeSubDomains' : false,

  // X-Frame-Options - Prevent clickjacking
  xFrameOptions: 'DENY',

  // X-Content-Type-Options - Prevent MIME sniffing
  xContentTypeOptions: true,

  // X-XSS-Protection - Enable browser XSS filter (legacy but still useful)
  xXSSProtection: '1; mode=block',

  // Referrer-Policy - Control referrer information
  referrerPolicy: 'strict-origin-when-cross-origin',

  // Permissions-Policy (formerly Feature-Policy) - Control browser features
  permissionsPolicy: 'geolocation=(), microphone=(), camera=()',

  // Cross-Origin Embedder Policy - Require CORP/COEP headers
  crossOriginEmbedderPolicy: false, // Enable only if using COOP/COEP

  // Cross-Origin Opener Policy - Control cross-origin window access
  crossOriginOpenerPolicy: 'same-origin',

  // Cross-Origin Resource Policy - Control cross-origin resource sharing
  crossOriginResourcePolicy: 'same-site',
};

/**
 * Security headers middleware factory
 * @param options Configuration options to override defaults
 */
export function securityHeaders(options: SecurityHeadersOptions = {}) {
  const config = { ...defaultHeaders, ...options };

  return async (request: Request, response: Response) => {
    // Content Security Policy
    if (config.contentSecurityPolicy) {
      const csp = typeof config.contentSecurityPolicy === 'string'
        ? config.contentSecurityPolicy
        : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
      response.header('Content-Security-Policy', csp);
    }

    // HTTP Strict Transport Security
    if (config.strictTransportSecurity) {
      const hsts = typeof config.strictTransportSecurity === 'string'
        ? config.strictTransportSecurity
        : 'max-age=31536000; includeSubDomains';
      response.header('Strict-Transport-Security', hsts);
    }

    // X-Frame-Options
    if (config.xFrameOptions) {
      const frameOptions = typeof config.xFrameOptions === 'string'
        ? config.xFrameOptions
        : 'DENY';
      response.header('X-Frame-Options', frameOptions);
    }

    // X-Content-Type-Options
    if (config.xContentTypeOptions) {
      response.header('X-Content-Type-Options', 'nosniff');
    }

    // X-XSS-Protection
    if (config.xXSSProtection) {
      const xssProtection = typeof config.xXSSProtection === 'string'
        ? config.xXSSProtection
        : '1; mode=block';
      response.header('X-XSS-Protection', xssProtection);
    }

    // Referrer-Policy
    if (config.referrerPolicy) {
      const referrer = typeof config.referrerPolicy === 'string'
        ? config.referrerPolicy
        : 'strict-origin-when-cross-origin';
      response.header('Referrer-Policy', referrer);
    }

    // Permissions-Policy
    if (config.permissionsPolicy) {
      const permissions = typeof config.permissionsPolicy === 'string'
        ? config.permissionsPolicy
        : 'geolocation=(), microphone=(), camera=()';
      response.header('Permissions-Policy', permissions);
    }

    // Cross-Origin-Embedder-Policy
    if (config.crossOriginEmbedderPolicy) {
      response.header('Cross-Origin-Embedder-Policy', 'require-corp');
    }

    // Cross-Origin-Opener-Policy
    if (config.crossOriginOpenerPolicy) {
      const coop = typeof config.crossOriginOpenerPolicy === 'string'
        ? config.crossOriginOpenerPolicy
        : 'same-origin';
      response.header('Cross-Origin-Opener-Policy', coop);
    }

    // Cross-Origin-Resource-Policy
    if (config.crossOriginResourcePolicy) {
      const corp = typeof config.crossOriginResourcePolicy === 'string'
        ? config.crossOriginResourcePolicy
        : 'same-site';
      response.header('Cross-Origin-Resource-Policy', corp);
    }

    // Additional security headers
    response.header('X-DNS-Prefetch-Control', 'off'); // Disable DNS prefetching
    response.header('X-Download-Options', 'noopen');  // Prevent opening files directly in IE
    response.header('X-Permitted-Cross-Domain-Policies', 'none'); // Restrict cross-domain policies
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
