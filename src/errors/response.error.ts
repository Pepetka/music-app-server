import type { Response } from "express";
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} from "../utils/constants";

export class ResponseError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ResponseError";
    this.status = status;
  }

  public static emptyParams<T>(message: string, ...args: T[]): void {
    const condition = args.reduce<boolean>((acc, data) => {
      return acc || !data;
    }, false);

    if (condition) {
      throw new ResponseError(message, BAD_REQUEST_STATUS);
    }
  }
}

export const withResponseErrorBoundary = async (
  res: Response,
  tryCallback: () => Promise<Response>,
) => {
  try {
    await tryCallback();
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof ResponseError) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .json({ message: "Internal server error" });
    }
  }
};
