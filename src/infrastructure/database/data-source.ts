import { DataSource } from "typeorm";

const isCompiled = __filename.endsWith(".js");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: isCompiled
    ? ["dist/domain/entities/*.js"]
    : ["src/domain/entities/*.ts"],
  migrations: isCompiled
    ? ["dist/migrations/*.js"]
    : ["src/migrations/*.ts"],
  synchronize: true,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});