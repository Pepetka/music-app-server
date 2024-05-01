import path from "path";
import http, { Server as HttpServer } from "http";
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "../../openApi/swagger.json";
import logger from "./utils/logger";
import Routes from "./routes";

class Server {
  private readonly server: HttpServer;

  constructor(app: Application) {
    this.config(app);
    new Routes(app);
    this.server = http.createServer(app);
  }

  private config(app: Application) {
    const corsConfig: CorsOptions = {
      origin: "http://localhost:8080",
    };
    const staticDir = path.join(__dirname, "../", "public");

    app.use(cors(corsConfig));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(staticDir));
    app.use(morgan("tiny"));

    this.initSwagger(app);
  }

  private initSwagger(app: Application) {
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));
  }

  public close() {
    this.server.close();
  }

  public listen(port: number) {
    this.server
      .listen(port, "localhost", () => {
        logger.debug(`Server listening on port ${port}`);
      })
      .on("error", (err: Error | string) => {
        if (err === "EADDRINUSE") {
          logger.debug(`Port ${port} is already in use`);
        } else {
          logger.error(err);
        }
      });
  }
}

export default Server;
