import express, { Application } from "express";
import dotenv from "dotenv";
import Server from "./server";

dotenv.config();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const app: Application = express();
const server: Server = new Server(app);

server.listen(PORT);
