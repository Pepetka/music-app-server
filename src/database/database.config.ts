import type { PoolConfig } from "pg";

export const prodConfig: PoolConfig = {
  host: "localhost",
  user: "admin_pg",
  password: "2035",
  database: "music_db",
};

export const devConfig: PoolConfig = {
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "postgres",
};
