/**
 * Redis Service
 * Provides Redis caching and data storage capabilities
 */

import Redis from 'ioredis';

let client: Redis | null = null;

function getClient(): Redis {
  if (!client) {
    client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }
  return client;
}

export const RedisService = {
  // Basic operations
  async get(key: string): Promise<string | null> {
    return await getClient().get(key);
  },

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return await getClient().set(key, value, 'EX', ttl);
    }
    return await getClient().set(key, value);
  },

  async del(key: string | string[]): Promise<number> {
    return await getClient().del(typeof key === 'string' ? [key] : key);
  },

  // Hash operations
  async hget(key: string, field: string): Promise<string | null> {
    return await getClient().hget(key, field);
  },

  async hset(key: string, field: string, value: string): Promise<number> {
    return await getClient().hset(key, field, value);
  },

  async hgetall(key: string): Promise<{ [key: string]: string }> {
    return await getClient().hgetall(key);
  },

  // List operations
  async lpush(key: string, value: string | string[]): Promise<number> {
    return await getClient().lpush(key, ...(Array.isArray(value) ? value : [value]));
  },

  async rpush(key: string, value: string | string[]): Promise<number> {
    return await getClient().rpush(key, ...(Array.isArray(value) ? value : [value]));
  },

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await getClient().lrange(key, start, stop);
  },

  // Set operations
  async sadd(key: string, value: string | string[]): Promise<number> {
    return await getClient().sadd(key, ...(Array.isArray(value) ? value : [value]));
  },

  async smembers(key: string): Promise<string[]> {
    return await getClient().smembers(key);
  },

  // Utility methods
  async exists(key: string): Promise<number> {
    return await getClient().exists(key);
  },

  async incr(key: string): Promise<number> {
    return await getClient().incr(key);
  },

  async ttl(key: string): Promise<number> {
    return await getClient().ttl(key);
  },

  async expire(key: string, seconds: number): Promise<number> {
    return await getClient().expire(key, seconds);
  },

  // Close connection
  async disconnect(): Promise<void> {
    if (client) {
      await client.quit();
      client = null;
    }
  }
};

export default RedisService;