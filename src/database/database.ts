import { Pool, PoolClient } from "pg";
import { prodConfig, devConfig } from "./database.config";
import logger from "../utils/logger";

class Database {
  public readonly pool: Pool;
  private client: PoolClient | undefined;

  constructor() {
    const config =
      process.env.NODE_ENV === "production" ? prodConfig : devConfig;
    this.pool = new Pool({
      ...config,
    });
  }

  public async init() {
    await this.connect();
  }

  private async connect() {
    await this.pool
      .connect()
      .then((client) => {
        this.client = client;
        logger.debug("Connection has been established successfully.");
      })
      .catch((err) => {
        logger.error(`Unable to connect to the Database: ${err.toString()}`);
        throw err;
      });
  }

  public async disconnect() {
    this.client?.release();
    await this.pool.end();
  }
}

export default Database;
