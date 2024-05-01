import { NextFunction, Request, Response } from "express";
import { cache } from "../tools";
import { OK_STATUS } from "../utils/constants";

export const cacheMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const data = await cache.get(req.originalUrl);

    if (data) {
      res.status(OK_STATUS).json(data);
    } else {
      next();
    }
  };
