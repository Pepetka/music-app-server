import type { QueryResult } from "pg";
import type { UserModel, UserCreationParams } from "../models/user.model";
import db from "../database/database";
import { ZERO } from "../utils/constants";

interface IUsersRepository {
  createUser(user: Omit<UserModel, "id">): Promise<UserModel | null>;
  getAllUsers(): Promise<UserModel[] | null>;
  getUser(id: string): Promise<UserModel | null>;
  getUserByEmail(email: string): Promise<UserModel | null>;
  updateUser(
    id: string,
    user: Omit<UserModel, "id">,
  ): Promise<UserModel | null>;
  deleteUser(id: string): Promise<UserModel | null>;
}

class UsersRepository implements IUsersRepository {
  async createUser(user: UserCreationParams): Promise<UserModel | null> {
    try {
      const newUser: QueryResult<UserModel> | undefined = await db.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
        [user.username, user.password, user.email],
      );

      return newUser?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to create User! Msg: ${(error as Error).message}`,
      );
    }
  }

  async getAllUsers(): Promise<UserModel[] | null> {
    try {
      const users: QueryResult<UserModel> | undefined = await db.query(
        "SELECT * FROM users ORDER BY id ASC",
      );

      return users?.rows ?? null;
    } catch (error: unknown) {
      throw new Error(`Failed to get Users! Msg: ${(error as Error).message}`);
    }
  }

  async getUser(id: string): Promise<UserModel | null> {
    try {
      const user: QueryResult<UserModel> | undefined = await db.query(
        "SELECT * FROM users WHERE id = $1",
        [id],
      );

      return user?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(`Failed to get User! Msg: ${(error as Error).message}`);
    }
  }

  async getUserByEmail(email: string): Promise<UserModel | null> {
    try {
      const user: QueryResult<UserModel> | undefined = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      return user?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to get User by email! Msg: ${(error as Error).message}`,
      );
    }
  }

  async updateUser(
    id: string,
    user: UserCreationParams,
  ): Promise<UserModel | null> {
    try {
      const affectedUsers: QueryResult<UserModel> | undefined = await db.query(
        "UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING *",
        [user.username, user.password, user.email, id],
      );

      return affectedUsers?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to update User! Msg: ${(error as Error).message}`,
      );
    }
  }

  async deleteUser(id: string): Promise<UserModel | null> {
    try {
      const deletedUser: QueryResult<UserModel> | undefined = await db.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id],
      );

      return deletedUser?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to delete User! Msg: ${(error as Error).message}`,
      );
    }
  }
}

export default new UsersRepository();
