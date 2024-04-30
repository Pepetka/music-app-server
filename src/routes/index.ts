import type { Application } from "express";
import userRoutes from "./user.routes";
import notFoundRoutes from "./notFound.routes";

class Routes {
  baseUrl: string = "/api";

  constructor(app: Application) {
    app.use(`${this.baseUrl}/user`, userRoutes);
    app.use("*", notFoundRoutes);
  }
}

export default Routes;
