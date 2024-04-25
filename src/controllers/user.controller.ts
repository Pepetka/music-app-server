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
import UserRepository from "../repositories/user.repository";
import type { UserModel, UserCreationParams } from "../models/user.model";
import { ResponseError } from "../errors/response.error";

@Tags("User")
@Route("user")
export class UserController extends Controller {
  /**
   * Create a new user.
   * @param userData The user to create.
   */
  @Post("create")
  @Response<{ message: "Internal server error" }>(500, "Internal server error")
  @Response<{ message: "Body is required" }>(400, "Body is required")
  @SuccessResponse("201", "Created")
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
  ): Promise<{ user: UserModel }> {
    const user = await UserRepository.createUser(userData);

    if (!user) {
      throw new ResponseError("User not created", 500);
    }

    return {
      user,
    };
  }
  /**
   * Get a user by id.
   * @param id The id of the user to get.
   */
  @Get("/get/{id}")
  @Response<{ message: "Internal server error" }>(500, "Internal server error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
  @Response<{ message: "Id is required" }>(400, "Id is required")
  @Example({
    user: {
      userId: "<USER_ID>",
      username: "<USERNAME>",
      password: "<PASSWORD>",
      email: "<EMAIL>",
    },
  })
  public static async getUser(
    @Path() id: string,
  ): Promise<{ user: UserModel | null }> {
    const user = await UserRepository.getUser(id);

    if (!user) {
      throw new ResponseError("User not found", 404);
    }

    return {
      user,
    };
  }
  /**
   * Get a user by email.
   * @param email The email of the user to get.
   */
  @Get("/get")
  @Response<{ message: "Internal server error" }>(500, "Internal server error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
  @Response<{ message: "Email is required" }>(400, "Email is required")
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
  ): Promise<{ user: UserModel | null }> {
    const user = await UserRepository.getUserByEmail(email);

    if (!user) {
      throw new ResponseError("User not found", 404);
    }

    return {
      user,
    };
  }
  /**
   * Update a user.
   * @param id The id of the user to update.
   * @param userData The user to update.
   */
  @Put("/update/{id}")
  @Response<{ message: "Internal server error" }>(500, "Internal server error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
  @Response<{ message: "Id and Body are required" }>(
    400,
    "Id and Body are required",
  )
  @SuccessResponse(204, "Updated")
  public static async updateUser(
    @Path() id: string,
    @Body() userData: UserCreationParams,
  ): Promise<void> {
    const user = await UserRepository.updateUser(id, userData);

    if (!user) {
      throw new ResponseError("User not found", 404);
    }
  }
  /**
   * Delete a user.
   * @param id The id of the user to delete.
   */
  @Delete("/delete/{id}")
  @Response<{ message: "Internal server error" }>(500, "Internal server error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
  @Response<{ message: "Id is required" }>(400, "Id is required")
  @SuccessResponse(204, "Deleted")
  public static async deleteUser(@Path() id: string): Promise<void> {
    const user = await UserRepository.deleteUser(id);

    if (!user) {
      throw new ResponseError("User not found", 404);
    }
  }
}
