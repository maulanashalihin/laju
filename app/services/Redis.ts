import Redis from 'ioredis';

class RedisService {
    private static instance: RedisService;
    private client: Redis;

    private constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
        });
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    // Basic operations
    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<'OK'> {
        if (ttl) {
            return await this.client.set(key, value, 'EX', ttl);
        }
        return await this.client.set(key, value);
    }

    async del(key: string | string[]): Promise<number> {
        return await this.client.del(typeof key === 'string' ? [key] : key);
    }

    // Hash operations
    async hget(key: string, field: string): Promise<string | null> {
        return await this.client.hget(key, field);
    }

    async hset(key: string, field: string, value: string): Promise<number> {
        return await this.client.hset(key, field, value);
    }

    async hgetall(key: string): Promise<{ [key: string]: string }> {
        return await this.client.hgetall(key);
    }

    // List operations
    async lpush(key: string, value: string | string[]): Promise<number> {
        return await this.client.lpush(key, ...(Array.isArray(value) ? value : [value]));
    }

    async rpush(key: string, value: string | string[]): Promise<number> {
        return await this.client.rpush(key, ...(Array.isArray(value) ? value : [value]));
    }

    async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return await this.client.lrange(key, start, stop);
    }

    // Set operations
    async sadd(key: string, value: string | string[]): Promise<number> {
        return await this.client.sadd(key, ...(Array.isArray(value) ? value : [value]));
    }

    async smembers(key: string): Promise<string[]> {
        return await this.client.smembers(key);
    }

    // Utility methods
    async exists(key: string): Promise<number> {
        return await this.client.exists(key);
    }

    async ttl(key: string): Promise<number> {
        return await this.client.ttl(key);
    }

    async expire(key: string, seconds: number): Promise<number> {
        return await this.client.expire(key, seconds);
    }

    // Close connection
    async disconnect(): Promise<void> {
        await this.client.quit();
    }
}

// Export a singleton instance
export default RedisService.getInstance();