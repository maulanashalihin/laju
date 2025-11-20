"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const Logger_1 = require("./Logger");
class RateLimiterService {
    constructor() {
        this.store = new Map();
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }
    check(key, config) {
        const now = Date.now();
        let record = this.store.get(key);
        if (!record) {
            record = {
                count: 0,
                resetAt: now + config.windowMs,
                requests: []
            };
            this.store.set(key, record);
        }
        if (now > record.resetAt) {
            record.count = 0;
            record.resetAt = now + config.windowMs;
            record.requests = [];
        }
        record.requests = record.requests.filter(timestamp => timestamp > now - config.windowMs);
        if (record.requests.length >= config.maxRequests) {
            const oldestRequest = record.requests[0];
            const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);
            (0, Logger_1.logWarn)('Rate limit exceeded', {
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
        record.requests.push(now);
        record.count++;
        return {
            allowed: true,
            remaining: config.maxRequests - record.requests.length,
            resetAt: record.resetAt
        };
    }
    reset(key) {
        this.store.delete(key);
    }
    resetAll() {
        this.store.clear();
    }
    getStatus(key) {
        return this.store.get(key);
    }
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, record] of this.store.entries()) {
            if (now > record.resetAt + 60000) {
                this.store.delete(key);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            (0, Logger_1.logWarn)(`Rate limiter cleanup: removed ${cleaned} expired entries`);
        }
    }
    size() {
        return this.store.size;
    }
    destroy() {
        clearInterval(this.cleanupInterval);
        this.store.clear();
    }
}
exports.rateLimiter = new RateLimiterService();
exports.default = exports.rateLimiter;
//# sourceMappingURL=RateLimiter.js.map