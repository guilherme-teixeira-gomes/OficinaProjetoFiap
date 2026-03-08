"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const data_source_1 = require("./data-source");
const routes_1 = require("./routes/routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.routes);
app.get("/", (req, res) => {
    return res.json({ message: "API Oficina funcionando 🚗" });
});
data_source_1.AppDataSource.initialize()
    .then(() => {
    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
    });
})
    .catch((error) => console.log(error));
