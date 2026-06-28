"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const isCompiled = __filename.endsWith(".js");
exports.AppDataSource = new typeorm_1.DataSource({
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
});
