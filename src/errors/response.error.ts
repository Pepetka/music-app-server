import type { Response, Request } from "express";
import logger from "../utils/logger";
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
  req: Request,
  res: Response,
  tryCallback: () => Promise<Response>,
) => {
  try {
    await tryCallback();
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error(
        `[${req.method} | ${error?.status}] ${req.originalUrl} - ${error}`,
      );
      return res.status(error.status).json({ message: error.message });
    } else {
      logger.error(
        `[${req.method} ${INTERNAL_SERVER_ERROR_STATUS}] ${req.originalUrl} - ${error}`,
      );
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .json({ message: "Internal server error" });
    }
  }
};
