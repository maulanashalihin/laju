/**
 * Logger Service using Winston
 * Provides structured logging with different levels and transports
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return msg;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { 
    service: 'laju-app',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error logs - only errors
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Combined logs - all levels
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log') 
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log') 
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Helper methods for structured logging
export const logError = (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
  logger.error(message, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    code: error instanceof Error && 'code' in error ? (error as { code?: string }).code : undefined,
    ...meta
  });
};

export const logInfo = (message: string, meta?: Record<string, unknown>) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: Record<string, unknown>) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, unknown>) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: Record<string, unknown>) => {
  logger.http(message, meta);
};

// Request logging helper
interface HttpRequest {
  method?: string;
  url?: string;
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
}

export const logRequest = (req: HttpRequest, meta?: Record<string, unknown>) => {
  try {
    logger.http('HTTP Request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers?.['user-agent'],
      ...meta
    });
  } catch (error) {
    // Ignore errors from accessing request properties after response is sent
    // This can happen with HyperExpress/uWS when response is already completed
    logger.debug('HTTP Request (partial)', {
      ...meta
    });
  }
};

// Response logging helper
interface HttpResponse {
  statusCode?: number;
}

export const logResponse = (req: HttpRequest, res: HttpResponse, duration: number) => {
  try {
    logger.http('HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  } catch (error) {
    // Ignore errors from accessing request properties after response is sent
    logger.debug('HTTP Response (partial)', {
      duration: `${duration}ms`
    });
  }
};

// Database query logging helper
export const logQuery = (query: string, duration?: number, meta?: Record<string, unknown>) => {
  logger.debug('Database Query', {
    query,
    duration: duration ? `${duration}ms` : undefined,
    ...meta
  });
};

export default logger;
