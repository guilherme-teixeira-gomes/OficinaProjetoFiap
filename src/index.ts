import "reflect-metadata";
import express from "express";
import cors from "cors";
import "express-async-errors";
import { AppDataSource } from "./data-source";
import { routes } from "./routes/routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.get("/", (req, res) => {
  return res.json({ message: "API Oficina funcionando 🚗" });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  })
  .catch((error) => console.log(error));