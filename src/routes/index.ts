import { Application } from "express";
import userRoutes from "./user.routes";

class Routes {
  baseUrl: string = "/api";

  constructor(app: Application) {
    app.use(`${this.baseUrl}/user`, userRoutes);
  }
}

export default Routes;
