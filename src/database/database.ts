import { Pool } from "pg";
import logger from "../utils/logger";
import { config } from "./database.config";

class Database {
  public readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      ...config,
    });
  }

  public async init() {
    await this.connectToDatabase();
    await this.createTable();
  }

  private async connectToDatabase() {
    await this.pool
      .connect()
      .then(() => {
        logger.debug("Connection has been established successfully.");
      })
      .catch((err) => {
        logger.error(`Unable to connect to the Database: ${err.toString()}`);
      });
  }

  public async disconnect() {
    await this.pool.end();
  }

  private async createTable() {
    const createCommand = `
      CREATE TABLE IF NOT EXISTS "users" (
      "id" SERIAL,
      "username" VARCHAR(100) NOT NULL,
      "password" VARCHAR(100) NOT NULL,
      "email" VARCHAR(100),
      PRIMARY KEY ("id")
    );`;

    await this.pool.query(createCommand);
  }
}

export default Database;
