import Redis from "ioredis";
import { env } from "../../config/env";

class RedisService {
  private client: Redis | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    if (!env.redisUrl) {
      console.warn("Redis URL is not configured. Caching is disabled.");
      return;
    }

    try {
      this.client = new Redis(env.redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        }
      });

      this.client.on("connect", () => {
        console.log("Redis connected successfully.");
      });

      this.client.on("error", (error) => {
        console.error("Redis connection error:", error);
      });
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
    }
  }

  public getClient(): Redis | null {
    return this.client;
  }

  public async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, "EX", ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error);
    }
  }

  public async del(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error);
    }
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      console.log("Redis connection closed.");
    }
  }
}

export const redisService = new RedisService();
