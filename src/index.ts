import "reflect-metadata";
import express from "express";
import cors from "cors";
import "express-async-errors";

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './infrastructure/web/swagger/swagger.json';
import { AppDataSource } from "./infrastructure/database/data-source";
import { routes } from "./infrastructure/web/routes/routes";
import { correlationMiddleware } from "./infrastructure/observability/correlationMiddleware";
import { requestLoggerMiddleware } from "./infrastructure/observability/requestLoggerMiddleware";
import { logger } from "./infrastructure/observability/logger";

export const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// Observabilidade: correlação entre requisições + log estruturado de cada request
app.use(correlationMiddleware);
app.use(requestLoggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);
app.get("/", (req, res) => {
  return res.json({ message: "API Oficina funcionando 🚗" });
});

// Só sobe o servidor se este arquivo for executado diretamente (não em testes)
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      app.listen(PORT, () => {
        logger.info("server_started", { port: PORT, swagger: `http://localhost:${PORT}/api-docs` });
      });
    })
    .catch((error) => {
      logger.error("database_initialization_failed", { error: error.message });
      process.exit(1);
    });
}
