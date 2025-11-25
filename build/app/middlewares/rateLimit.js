"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customRateLimit = exports.userRateLimit = exports.createAccountRateLimit = exports.uploadRateLimit = exports.emailRateLimit = exports.passwordResetRateLimit = exports.generalRateLimit = exports.apiRateLimit = exports.authRateLimit = void 0;
exports.rateLimit = rateLimit;
const RateLimiter_1 = __importDefault(require("../services/RateLimiter"));
const Logger_1 = require("../services/Logger");
function rateLimit(options = {}) {
    const config = {
        windowMs: options.windowMs || 15 * 60 * 1000,
        maxRequests: options.maxRequests || 100,
        message: options.message || 'Too many requests, please try again later',
        statusCode: options.statusCode || 429,
        keyGenerator: options.keyGenerator || ((req) => req.ip || 'unknown'),
        skip: options.skip || (() => false),
        handler: options.handler
    };
    return async (request, response) => {
        if (config.skip(request)) {
            return;
        }
        const key = config.keyGenerator(request);
        const result = RateLimiter_1.default.check(key, {
            windowMs: config.windowMs,
            maxRequests: config.maxRequests,
            message: config.message
        });
        response.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
        response.setHeader('X-RateLimit-Remaining', result.remaining.toString());
        response.setHeader('X-RateLimit-Reset', new Date(result.resetAt).toISOString());
        if (!result.allowed) {
            response.setHeader('Retry-After', result.retryAfter?.toString() || '60');
            (0, Logger_1.logWarn)('Rate limit exceeded', {
                ip: request.ip,
                url: request.url,
                method: request.method,
                key,
                retryAfter: result.retryAfter
            });
            if (config.handler) {
                return config.handler(request, response);
            }
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
    };
}
exports.authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many login attempts, please try again later'
});
exports.apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    message: 'Too many API requests, please try again later'
});
exports.generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000,
    message: 'Too many requests, please try again later'
});
exports.passwordResetRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: 'Too many password reset attempts, please try again later',
    keyGenerator: (req) => {
        const email = req.body?.email || req.ip;
        return `password-reset:${email}`;
    }
});
exports.emailRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
    message: 'Too many emails sent, please try again later',
    keyGenerator: (req) => {
        const userId = req.user?.id || req.ip;
        return `email:${userId}`;
    }
});
exports.uploadRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    maxRequests: 50,
    message: 'Too many file uploads, please try again later',
    keyGenerator: (req) => {
        const userId = req.user?.id || req.ip;
        return `upload:${userId}`;
    }
});
exports.createAccountRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: 'Too many accounts created from this IP, please try again later'
});
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return rateLimit({
        windowMs,
        maxRequests,
        keyGenerator: (req) => {
            const userId = req.user?.id || req.ip;
            return `user:${userId}`;
        },
        skip: (req) => !req.user
    });
};
exports.userRateLimit = userRateLimit;
const customRateLimit = (key, maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return rateLimit({
        windowMs,
        maxRequests,
        keyGenerator: () => key
    });
};
exports.customRateLimit = customRateLimit;
exports.default = rateLimit;
//# sourceMappingURL=rateLimit.js.map