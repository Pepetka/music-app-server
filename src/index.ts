import express, { Application } from "express";
import dotenv from "dotenv";
import Server from "./server";
import { broker, cache, database } from "./tools";
import logger from "./utils/logger";

(async () => {
  dotenv.config();
  const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

  await database.init();
  await cache.connect();
  await broker.init();

  const app: Application = express();
  const server: Server = new Server(app);

  server.listen(PORT);

  const onShutdown = () => {
    Promise.all([
      database.disconnect(),
      cache.disconnect(),
      broker.close(),
      server.close,
    ])
      .then(() => {
        logger.info("Server closed");
        logger.close();
        process.exit(0);
      })
      .catch((error: unknown) => {
        logger.error(error);
        logger.close();
        process.exit(1);
      });

    setTimeout(() => {
      logger.close();
      process.exit(1);
    }, 5000);
  };

  process.on("SIGINT", onShutdown);
  process.on("SIGTERM", onShutdown);
})();
