import { Pool } from "pg";
import { config } from "./database.config";

class Database {
  public pool: Pool | undefined;

  constructor() {
    this.init();
  }

  private async connectToDatabase() {
    this.pool = new Pool({
      ...config,
    });

    await this.pool
      .connect()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the Database:", err);
      });
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

    this.pool?.query(createCommand);
  }

  private async init() {
    await this.connectToDatabase();
    await this.createTable();
  }
}

export default new Database().pool;
