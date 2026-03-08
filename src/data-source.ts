import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ["dist/entities/*.js"],   // <-- JS no build
  migrations: ["dist/migrations/*.js"],
  synchronize: true,                 // melhor false em produção
});