import "reflect-metadata";
import express from "express";
import cors from "cors";
import "express-async-errors";

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../src/infrastructure/web/swagger/swagger.json'; 
import { AppDataSource } from "./infrastructure/database/data-source";
import { routes } from "./infrastructure/web/routes/routes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 
app.use(routes);
app.get("/", (req, res) => {
  return res.json({ message: "API Oficina funcionando 🚗" });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => console.log(error));