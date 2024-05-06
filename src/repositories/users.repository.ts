import type { Pool } from "pg";
import UsersDatabase from "../database/users.database";
import type { UserModel, UserCreationParams } from "../models/user.model";
import { ZERO } from "../utils/constants";

interface IUsersRepository {
  createUser(user: Omit<UserModel, "id">): Promise<UserModel | null>;
  getAllUsers(): Promise<UserModel[] | null>;
  getUserById(id: string): Promise<UserModel | null>;
  getUserByEmail(email: string): Promise<UserModel | null>;
  updateUser(
    id: string,
    user: Omit<UserModel, "id">,
  ): Promise<UserModel | null>;
  deleteUser(id: string): Promise<UserModel | null>;
}

class UsersRepository implements IUsersRepository {
  private readonly db: UsersDatabase;

  constructor(database: Pool) {
    this.db = new UsersDatabase(database);
  }

  public async getAllUsers(): Promise<UserModel[] | null> {
    try {
      const users = await this.db.getAllUsers();

      return users?.rows ?? null;
    } catch (error: unknown) {
      throw new Error(`Failed to get Users! Msg: ${(error as Error).message}`);
    }
  }

  public async getUserById(id: string): Promise<UserModel | null> {
    try {
      const user = await this.db.getUserById(id);

      return user?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(`Failed to get User! Msg: ${(error as Error).message}`);
    }
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    try {
      const user = await this.db.getUserByEmail(email);

      return user?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to get User by email! Msg: ${(error as Error).message}`,
      );
    }
  }

  public async createUser(user: UserCreationParams): Promise<UserModel | null> {
    try {
      const newUser = await this.db.createUser(user);

      return newUser?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to create User! Msg: ${(error as Error).message}`,
      );
    }
  }

  public async updateUser(
    id: string,
    user: UserCreationParams,
  ): Promise<UserModel | null> {
    try {
      const affectedUsers = await this.db.updateUser(id, user);

      return affectedUsers?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to update User! Msg: ${(error as Error).message}`,
      );
    }
  }

  public async deleteUser(id: string): Promise<UserModel | null> {
    try {
      const deletedUser = await this.db.deleteUser(id);

      return deletedUser?.rows[ZERO] ?? null;
    } catch (error: unknown) {
      throw new Error(
        `Failed to delete User! Msg: ${(error as Error).message}`,
      );
    }
  }
}

export default UsersRepository;
