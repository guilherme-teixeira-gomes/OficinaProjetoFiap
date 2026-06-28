"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./infrastructure/web/swagger/swagger.json"));
const data_source_1 = require("./infrastructure/database/data-source");
const routes_1 = require("./infrastructure/web/routes/routes");
exports.app = (0, express_1.default)();
const PORT = 3000;
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
exports.app.use(routes_1.routes);
exports.app.get("/", (req, res) => {
    return res.json({ message: "API Oficina funcionando 🚗" });
});
// Só sobe o servidor se este arquivo for executado diretamente (não em testes)
if (require.main === module) {
    data_source_1.AppDataSource.initialize()
        .then(() => {
        exports.app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📚 Swagger disponível em http://localhost:${PORT}/api-docs`);
        });
    })
        .catch((error) => {
        console.error("ERRO AO INICIALIZAR BANCO:", error);
        process.exit(1);
    });
}
