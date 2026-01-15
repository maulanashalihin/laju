import DB from "./DB";

class CacheService {
    /**
     * Retrieve an item from the cache.
     * @param key The cache key
     * @returns The cached value or null if not found/expired
     */
    public async get<T>(key: string): Promise<T | null> {
        try {
            const record = await DB.from("cache").where("key", key).first();

            if (!record) {
                return null;
            }

            const now = Math.floor(Date.now() / 1000);
            
            if (record.expiration < now) {
                await this.forget(key);
                return null;
            }

            return JSON.parse(record.value);
        } catch (error) {
            console.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Store an item in the cache.
     * @param key The cache key
     * @param value The value to cache
     * @param minutes Expiration time in minutes
     */
    public async put<T>(key: string, value: T, minutes: number): Promise<void> {
        try {
            const expiration = Math.floor(Date.now() / 1000) + (minutes * 60);
            const serializedValue = JSON.stringify(value);

            // Use insert or replace (upsert) behavior
            // Since SQLite supports INSERT OR REPLACE, and Knex has .onConflict().merge()
            
            // First try to check if it exists to decide update or insert, 
            // or use native upsert if supported. 
            // For cross-db compatibility usually we can just delete and insert or use specific syntax.
            // Knex has .insert().onConflict().merge()
            
            await DB.from("cache")
                .insert({
                    key,
                    value: serializedValue,
                    expiration
                })
                .onConflict("key")
                .merge();

        } catch (error) {
            console.error(`Cache put error for key ${key}:`, error);
        }
    }

    /**
     * Retrieve an item from the cache, or store the default value if it doesn't exist.
     * @param key The cache key
     * @param minutes Expiration time in minutes
     * @param callback Function that returns the value to cache
     */
    public async remember<T>(key: string, minutes: number, callback: () => Promise<T>): Promise<T> {
        const cached = await this.get<T>(key);

        if (cached !== null) {
            return cached;
        }

        const value = await callback();
        if (value !== null) {
            await this.put(key, value, minutes);
        }
        return value;
    }

    /**
     * Remove an item from the cache.
     * @param key The cache key
     */
    public async forget(key: string): Promise<void> {
        try {
            await DB.from("cache").where("key", key).delete();
        } catch (error) {
            console.error(`Cache forget error for key ${key}:`, error);
        }
    }
}

export default new CacheService();
