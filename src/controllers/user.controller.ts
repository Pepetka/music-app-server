import {
  Post,
  Route,
  Response,
  SuccessResponse,
  Body,
  Example,
  Controller,
  Get,
  Tags,
  Path,
  Query,
  Put,
  Delete,
} from "tsoa";
import UserRepository from "../repositories/users.repository";
import type { UserModel, UserCreationParams } from "../models/user.model";
import { ResponseError } from "../errors/response.error";
import {
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  NO_CONTENT_STATUS,
  NOT_FOUND_STATUS,
} from "../utils/constants";

@Tags("Users")
@Route("users")
export class UserController extends Controller {
  /**
   * Get all users.
   */
  @Get("/all")
  @Response<{ message: "Internal server error" }>(
    INTERNAL_SERVER_ERROR_STATUS,
    "Internal server error",
  )
  @Response<{ message: "Not Found" }>(NOT_FOUND_STATUS, "Not Found")
  @Example({
    users: [
      {
        userId: "<USER_ID>",
        username: "<USERNAME>",
        password: "<PASSWORD>",
        email: "<EMAIL>",
      },
      {
        userId: "<USER_ID>",
        username: "<USERNAME>",
        password: "<PASSWORD>",
        email: "<EMAIL>",
      },
    ],
  })
  public static async getAllUsers(): Promise<UserModel[]> {
    const users = await UserRepository.getAllUsers();

    if (!users) {
      throw new ResponseError("Users not found", NOT_FOUND_STATUS);
    }

    return users;
  }
  /**
   * Get a user by id.
   * @param id The id of the user to get.
   */
  @Get("/get/{id}")
  @Response<{ message: "Internal server error" }>(
    INTERNAL_SERVER_ERROR_STATUS,
    "Internal server error",
  )
  @Response<{ message: "Not Found" }>(NOT_FOUND_STATUS, "Not Found")
  @Response<{ message: "Id is required" }>(BAD_REQUEST_STATUS, "Id is required")
  @Example({
    user: {
      userId: "<USER_ID>",
      username: "<USERNAME>",
      password: "<PASSWORD>",
      email: "<EMAIL>",
    },
  })
  public static async getUser(@Path() id: string): Promise<UserModel> {
    const user = await UserRepository.getUser(id);

    if (!user) {
      throw new ResponseError("User not found", NOT_FOUND_STATUS);
    }

    return user;
  }
  /**
   * Get a user by email.
   * @param email The email of the user to get.
   */
  @Get("/get")
  @Response<{ message: "Internal server error" }>(
    INTERNAL_SERVER_ERROR_STATUS,
    "Internal server error",
  )
  @Response<{ message: "Not Found" }>(NOT_FOUND_STATUS, "Not Found")
  @Response<{ message: "Email is required" }>(
    BAD_REQUEST_STATUS,
    "Email is required",
  )
  @Example({
    user: {
      userId: "<USER_ID>",
      username: "<USERNAME>",
      password: "<PASSWORD>",
      email: "<EMAIL>",
    },
  })
  public static async getUserByEmail(
    @Query() email: string,
  ): Promise<UserModel> {
    const user = await UserRepository.getUserByEmail(email);

    if (!user) {
      throw new ResponseError("User not found", NOT_FOUND_STATUS);
    }

    return user;
  }
  /**
   * Create a new user.
   * @param userData The user to create.
   */
  @Post("create")
  @Response<{ message: "Internal server error" }>(
    INTERNAL_SERVER_ERROR_STATUS,
    "Internal server error",
  )
  @Response<{ message: "Body is required" }>(
    BAD_REQUEST_STATUS,
    "Body is required",
  )
  @SuccessResponse(CREATED_STATUS, "Created")
  @Example({
    user: {
      userId: "<USER_ID>",
      username: "<USERNAME>",
      password: "<PASSWORD>",
      email: "<EMAIL>",
    },
  })
  public static async createUser(
    @Body() userData: UserCreationParams,
  ): Promise<UserModel> {
    const user = await UserRepository.createUser(userData);

    if (!user) {
      throw new ResponseError("User not created", INTERNAL_SERVER_ERROR_STATUS);
    }

    return user;
  }
  /**
   * Update a user.
   * @param id The id of the user to update.
   * @param userData The user to update.
   */
  @Put("/update/{id}")
  @Response<{ message: "Internal server error" }>(
    INTERNAL_SERVER_ERROR_STATUS,
    "Internal server error",
  )
  @Response<{ message: "Not Found" }>(NOT_FOUND_STATUS, "Not Found")
  @Response<{ message: "Id and Body are required" }>(
    BAD_REQUEST_STATUS,
    "Id and Body are required",
  )
  @SuccessResponse(NO_CONTENT_STATUS, "Updated")
  public static async updateUser(
    @Path() id: string,
    @Body() userData: UserCreationParams,
  ): Promise<UserModel> {
    const user = await UserRepository.updateUser(id, userData);

    if (!user) {
      throw new ResponseError("User not found", NOT_FOUND_STATUS);
    }

    return user;
  }
  /**
   * Delete a user.
   * @param id The id of the user to delete.
   */
  @Delete("/delete/{id}")
  @Response<{ message: "Internal server error" }>(
    INTERNAL_SERVER_ERROR_STATUS,
    "Internal server error",
  )
  @Response<{ message: "Not Found" }>(NOT_FOUND_STATUS, "Not Found")
  @Response<{ message: "Id is required" }>(BAD_REQUEST_STATUS, "Id is required")
  @SuccessResponse(NO_CONTENT_STATUS, "Deleted")
  public static async deleteUser(@Path() id: string): Promise<UserModel> {
    const user = await UserRepository.deleteUser(id);

    if (!user) {
      throw new ResponseError("User not found", NOT_FOUND_STATUS);
    }

    return user;
  }
}
