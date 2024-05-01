import { Response, Router } from "express";
import { NOT_FOUND_STATUS } from "../utils/constants";

class NotFoundRoutes {
  router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("*", (_, res: Response) => {
      res.status(NOT_FOUND_STATUS).json({
        message: "Not found",
      });
    });

    this.router.post("*", (_, res: Response) => {
      res.status(NOT_FOUND_STATUS).json({
        message: "Not found",
      });
    });

    this.router.put("*", (_, res: Response) => {
      res.status(NOT_FOUND_STATUS).json({
        message: "Not found",
      });
    });

    this.router.patch("*", (_, res: Response) => {
      res.status(NOT_FOUND_STATUS).json({
        message: "Not found",
      });
    });

    this.router.delete("*", (_, res: Response) => {
      res.status(NOT_FOUND_STATUS).json({
        message: "Not found",
      });
    });
  }
}

export default NotFoundRoutes;
