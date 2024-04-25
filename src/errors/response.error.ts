import type { Response } from "express";

export class ResponseError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ResponseError";
    this.status = status;
  }
}

export const withResponseErrorBoundary = async (
  res: Response,
  tryCallback: () => Promise<Response>,
) => {
  try {
    await tryCallback();
  } catch (error: unknown) {
    console.log("withResponseErrorBoundary error: ", error);
    if (error instanceof ResponseError) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
