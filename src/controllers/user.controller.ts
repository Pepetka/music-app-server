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

@Tags("User")
@Route("user")
export class UserController extends Controller {
  /**
   * Create a new user.
   * @param userData The user to create.
   */
  @Post("create")
  @Response<{ message: "Server Error" }>(500, "Server Error")
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
    const newUser = await UserRepository.createUser(userData);

    return {
      user: newUser,
    };
  }
  /**
   * Get a user by id.
   * @param id The id of the user to get.
   */
  @Get("/get/{id}")
  @Response<{ message: "Server Error" }>(500, "Server Error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
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
    const newUser = await UserRepository.getUser(id);

    return {
      user: newUser,
    };
  }
  /**
   * Get a user by email.
   * @param email The email of the user to get.
   */
  @Get("/get")
  @Response<{ message: "Server Error" }>(500, "Server Error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
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
    const newUser = await UserRepository.getUserByEmail(email);

    return {
      user: newUser,
    };
  }
  /**
   * Update a user.
   * @param id The id of the user to update.
   * @param userData The user to update.
   */
  @Put("/update/{id}")
  @Response<{ message: "Server Error" }>(500, "Server Error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
  @SuccessResponse(204, "Updated")
  @Example({
    user: {
      userId: "<USER_ID>",
      username: "<USERNAME>",
      password: "<PASSWORD>",
      email: "<EMAIL>",
    },
  })
  public static async updateUser(
    @Path() id: string,
    @Body() userData: UserCreationParams,
  ): Promise<{ user: UserModel | null }> {
    const newUser = await UserRepository.updateUser(id, userData);

    return {
      user: newUser,
    };
  }
  /**
   * Delete a user.
   * @param id The id of the user to delete.
   */
  @Delete("/delete/{id}")
  @Response<{ message: "Server Error" }>(500, "Server Error")
  @Response<{ message: "Not Found" }>(404, "Not Found")
  @SuccessResponse(204, "Updated")
  @Example({
    user: {
      userId: "<USER_ID>",
      username: "<USERNAME>",
      password: "<PASSWORD>",
      email: "<EMAIL>",
    },
  })
  public static async deleteUser(
    @Path() id: string,
  ): Promise<{ user: UserModel | null }> {
    const newUser = await UserRepository.deleteUser(id);

    return {
      user: newUser,
    };
  }
}
