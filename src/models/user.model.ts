export type UserModel = {
  userId?: number;
  username?: string;
  password?: string;
  email?: string;
};

export type UserCreationParams = Pick<
  UserModel,
  "username" | "password" | "email"
>;
