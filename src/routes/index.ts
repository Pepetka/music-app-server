import { Application } from "express";
import UsersRoutes from "./users.routes";
import NotFoundRoutes from "./notFound.routes";
import { cacheMiddleware } from "../cache/cache.middleware";

class Routes {
  baseUrl: string = "/api";

  constructor(app: Application) {
    app.use(
      `${this.baseUrl}/users`,
      cacheMiddleware(),
      new UsersRoutes(`${this.baseUrl}/users`).router,
    );
    app.use("*", new NotFoundRoutes().router);
  }
}

export default Routes;
