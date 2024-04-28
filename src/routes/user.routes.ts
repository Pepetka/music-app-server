import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import {
  ResponseError,
  withResponseErrorBoundary,
} from "../errors/response.error";
import {
  CREATED_STATUS,
  NO_CONTENT_STATUS,
  OK_STATUS,
} from "../utils/constants";

class UserRoutes {
  router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const body = req.body;
        ResponseError.emptyParams("Body is required", body);
        const newUser = await UserController.createUser(body!);
        return res.status(CREATED_STATUS).json(newUser);
      });
    });

    this.router.get("/get/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        ResponseError.emptyParams("Id is required", id);
        const user = await UserController.getUser(id!);
        return res.status(OK_STATUS).json(user);
      });
    });

    this.router.get("/get", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const email = req.query.email;
        ResponseError.emptyParams("Email is required", email);
        const user = await UserController.getUserByEmail(email as string);
        return res.status(OK_STATUS).json(user);
      });
    });

    this.router.put("/update/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        const body = req.body;
        ResponseError.emptyParams("Id and Body are required", id, body);
        await UserController.updateUser(id!, body!);
        return res.status(NO_CONTENT_STATUS).send();
      });
    });

    this.router.delete("/delete/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        ResponseError.emptyParams("Id is required", id);
        await UserController.deleteUser(id!);
        return res.status(NO_CONTENT_STATUS).send();
      });
    });
  }
}

export default new UserRoutes().router;
