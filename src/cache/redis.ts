import { createClient, RedisClientType } from "redis";

class RedisCache {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient();
  }

  public async init() {
    await this.client.connect();
  }

  public async connect() {
    await this.client.connect();
  }

  public async disconnect() {
    await this.client.disconnect();
  }

  async set(key: string, value: unknown, expiration?: number) {
    await this.client.set(key, JSON.stringify(value), {
      EX: expiration,
    });
  }

  async get(key: string) {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  async delete(keys: string | string[]) {
    if (Array.isArray(keys)) {
      for (const key of keys) {
        await this.client.del(key);
      }
    } else {
      await this.client.del(keys);
    }
  }

  async deleteAll() {
    await this.client.flushDb();
  }
}

export default RedisCache;
