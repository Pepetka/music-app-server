import { Pool } from "pg";
import { prodConfig, devConfig } from "./database.config";
import logger from "../utils/logger";

class Database {
  public readonly pool: Pool;

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
      .then(() => {
        logger.debug("Connection has been established successfully.");
      })
      .catch((err) => {
        logger.error(`Unable to connect to the Database: ${err.toString()}`);
        throw err;
      });
  }

  public async disconnect() {
    await this.pool.end();
  }
}

export default Database;
