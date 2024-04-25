import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import {
  ResponseError,
  withResponseErrorBoundary,
} from "../errors/response.error";

class UserRoutes {
  router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        if (!req.body) {
          throw new ResponseError("Body is required", 400);
        }
        const newUser = await UserController.createUser(req.body);
        return res.status(201).json(newUser);
      });
    });

    this.router.get("/get/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        if (!id) {
          throw new ResponseError("Id is required", 400);
        }
        const user = await UserController.getUser(id);
        return res.status(200).json(user);
      });
    });

    this.router.get("/get", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const email = req.query.email;
        if (!email) {
          throw new ResponseError("Email is required", 400);
        }
        const user = await UserController.getUserByEmail(email as string);
        return res.status(200).json(user);
      });
    });

    this.router.put("/update/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        if (!id || !req.body) {
          throw new ResponseError("Id and Body are required", 400);
        }
        await UserController.updateUser(id, req.body);
        return res.status(204).send();
      });
    });

    this.router.delete("/delete/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        if (!id) {
          throw new ResponseError("Id is required", 400);
        }
        await UserController.deleteUser(id);
        return res.status(204).send();
      });
    });
  }
}

export default new UserRoutes().router;
