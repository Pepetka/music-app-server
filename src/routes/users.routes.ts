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
import redisCache from "../cache/redis";
import { sleep } from "../utils/test";
import { getPathWithQueryParameters } from "../utils/path";

class UsersRoutes {
  baseUrl: string;
  router: Router = Router();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/all", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const users = await UserController.getAllUsers();
        await sleep(1000);
        await redisCache.set(req.originalUrl, users);
        return res.status(OK_STATUS).json({
          users,
        });
      });
    });

    this.router.get("/get/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        ResponseError.emptyParams("Id is required", id);
        const user = await UserController.getUser(id!);
        await sleep(1000);
        await redisCache.set(req.originalUrl, user);
        return res.status(OK_STATUS).json({
          user,
        });
      });
    });

    this.router.get("/get", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const email = req.query.email;
        ResponseError.emptyParams("Email is required", email);
        const user = await UserController.getUserByEmail(email as string);
        await sleep(1000);
        await redisCache.set(req.originalUrl, user);
        return res.status(OK_STATUS).json({
          user,
        });
      });
    });

    this.router.post("/create", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const body = req.body;
        ResponseError.emptyParams("Body is required", body);
        const user = await UserController.createUser(body!);
        await this.invalidateCache();
        return res.status(CREATED_STATUS).json({
          user,
        });
      });
    });

    this.router.put("/update/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        const body = req.body;
        ResponseError.emptyParams("Id and Body are required", id, body);
        const user = await UserController.updateUser(id!, body!);
        await this.invalidateCache(id!, user.email!);
        return res.status(NO_CONTENT_STATUS).send();
      });
    });

    this.router.delete("/delete/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(res, async () => {
        const id = req.params.id;
        ResponseError.emptyParams("Id is required", id);
        const user = await UserController.deleteUser(id!);
        await this.invalidateCache(id!, user.email!);
        return res.status(NO_CONTENT_STATUS).send();
      });
    });
  }

  private async invalidateCache(id?: string, email?: string) {
    const keysArr: string[] = [`${this.baseUrl}/all`];

    if (id) {
      keysArr.push(`${this.baseUrl}/get/${id}`);
    }

    if (email) {
      keysArr.push(
        getPathWithQueryParameters(`${this.baseUrl}/get`, {
          email,
        }),
      );
    }

    await redisCache.delete(keysArr);
  }
}

export default UsersRoutes;
