import { createClient, RedisClientType } from "redis";

class RedisCache {
  client: RedisClientType;

  constructor() {
    this.client = createClient();
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async set(key: string, value: unknown, expiration?: number) {
    await this.connect();
    await this.client.set(key, JSON.stringify(value), {
      EX: expiration,
    });
    await this.disconnect();
  }

  async get(key: string) {
    await this.connect();
    const data = await this.client.get(key);
    await this.disconnect();

    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  async delete(keys: string | string[]) {
    await this.connect();
    if (Array.isArray(keys)) {
      for (const key of keys) {
        await this.client.del(key);
      }
    } else {
      await this.client.del(keys);
    }
    await this.disconnect();
  }

  async deleteAll() {
    await this.connect();
    await this.client.flushDb();
    await this.disconnect();
  }
}

export default new RedisCache();
