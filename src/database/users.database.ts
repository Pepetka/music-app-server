import type { Pool, QueryResult } from "pg";
import type { UserCreationParams, UserModel } from "../models/user.model";

interface IUsersDatabase {
  init: () => Promise<void>;
  getAllUsers: () => Promise<QueryResult<UserModel> | undefined>;
  getUserById: (id: string) => Promise<QueryResult<UserModel> | undefined>;
  getUserByEmail: (
    email: string,
  ) => Promise<QueryResult<UserModel> | undefined>;
  createUser: (
    user: UserCreationParams,
  ) => Promise<QueryResult<UserModel> | undefined>;
  updateUser: (
    id: string,
    user: UserCreationParams,
  ) => Promise<QueryResult<UserModel> | undefined>;
  deleteUser: (id: string) => Promise<QueryResult<UserModel> | undefined>;
}

class UsersDatabase implements IUsersDatabase {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  public async init() {
    await this.createTable();
  }

  private async createTable() {
    const psqlCommand = `
      /* PSQL */
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL,
        "username" VARCHAR(100) NOT NULL,
        "password" VARCHAR(100) NOT NULL,
        "email" VARCHAR(100) UNIQUE NOT NULL,
        PRIMARY KEY ("id")
      );
  `;

    await this.db.query(psqlCommand);
  }

  public async getAllUsers() {
    return await this.db.query(
      `
      /* PSQL */
      SELECT * FROM users ORDER BY id ASC
    `,
    );
  }

  public async getUserById(id: string) {
    return await this.db.query(
      `
        /* PSQL */
        SELECT * FROM users WHERE id = $1
      `,
      [id],
    );
  }

  public async getUserByEmail(email: string) {
    return await this.db.query(
      `
      /* PSQL */
      SELECT * FROM users WHERE email = $1
    `,
      [email],
    );
  }

  public async createUser(user: UserCreationParams) {
    return await this.db.query(
      `
      /* PSQL */
      INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *
    `,
      [user.username, user.password, user.email],
    );
  }

  public async updateUser(id: string, user: UserCreationParams) {
    return await this.db.query(
      `
      /* PSQL */
      UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING *
    `,
      [user.username, user.password, user.email, id],
    );
  }

  public async deleteUser(id: string) {
    return await this.db.query(
      `
      /* PSQL */
      DELETE FROM users WHERE id = $1 RETURNING *
    `,
      [id],
    );
  }
}

export default UsersDatabase;
