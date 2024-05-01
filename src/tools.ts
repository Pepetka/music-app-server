import Database from "./database/database";
import RedisCache from "./cache/redis";
import MessageBroker from "./services/messageBroker";

export const database = new Database();
export const cache = new RedisCache();
export const broker = new MessageBroker();
