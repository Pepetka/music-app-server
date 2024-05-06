import { Request, Response, Router } from "express";
import { cache } from "../tools";
import UserController from "../controllers/user.controller";
import {
  ResponseError,
  withResponseErrorBoundary,
} from "../errors/response.error";
import {
  CREATED_STATUS,
  NO_CONTENT_STATUS,
  OK_STATUS,
} from "../utils/constants";
import { getPathWithQueryParameters } from "../utils/path";

class UsersRoutes {
  private readonly baseUrl: string;
  public readonly router: Router = Router();
  private readonly userController: UserController;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.initRoutes();
    this.userController = new UserController();
  }

  private initRoutes() {
    this.router.get("/all", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(req, res, async () => {
        const users = await this.userController.getAllUsers();
        await cache.set(
          req.originalUrl,
          {
            users,
          },
          60 * 60,
        );
        return res.status(OK_STATUS).json({
          users,
        });
      });
    });

    this.router.get("/get/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(req, res, async () => {
        const id = req.params.id;
        ResponseError.emptyParams("Id is required", id);
        const user = await this.userController.getUser(id!);
        await cache.set(
          req.originalUrl,
          {
            user,
          },
          60 * 60,
        );
        return res.status(OK_STATUS).json({
          user,
        });
      });
    });

    this.router.get("/get", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(req, res, async () => {
        const email = req.query.email;
        ResponseError.emptyParams("Email is required", email);
        const user = await this.userController.getUserByEmail(email as string);
        await cache.set(
          req.originalUrl,
          {
            user,
          },
          60 * 60,
        );
        return res.status(OK_STATUS).json({
          user,
        });
      });
    });

    this.router.post("/create", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(req, res, async () => {
        const body = req.body;
        ResponseError.emptyParams("Body is required", body);
        const user = await this.userController.createUser(body!);
        await this.invalidateCache();
        return res.status(CREATED_STATUS).json({
          user,
        });
      });
    });

    this.router.put("/update/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(req, res, async () => {
        const id = req.params.id;
        const body = req.body;
        ResponseError.emptyParams("Id and Body are required", id, body);
        const user = await this.userController.updateUser(id!, body!);
        await this.invalidateCache(id!, user.email!);
        return res.status(NO_CONTENT_STATUS).send();
      });
    });

    this.router.delete("/delete/:id", async (req: Request, res: Response) => {
      await withResponseErrorBoundary(req, res, async () => {
        const id = req.params.id;
        ResponseError.emptyParams("Id is required", id);
        const user = await this.userController.deleteUser(id!);
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

    await cache.delete(keysArr);
  }
}

export default UsersRoutes;
