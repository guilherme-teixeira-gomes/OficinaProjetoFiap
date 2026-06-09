"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const ClientController_1 = require("../controllers/ClientController");
const ServiceOrderController_1 = require("../controllers/ServiceOrderController");
const VehiclesController_ts_1 = require("../controllers/VehiclesController.ts");
const PartController_1 = require("../controllers/PartController");
const ServiceController_1 = require("../controllers/ServiceController");
const UserController_1 = require("../controllers/UserController");
const ServiceExecutionController_1 = require("../controllers/ServiceExecutionController");
const StockController_1 = require("../controllers/StockController");
const AuthMiddleware_1 = require("../../auth/middlewares/AuthMiddleware");
const clientValidations_1 = require("../../../shared/validations/clientValidations");
const vehicleValidations_1 = require("../../../shared/validations/vehicleValidations");
exports.routes = (0, express_1.Router)();
// Rotas públicas
exports.routes.get('/static');
// Criacao de usuário
exports.routes.post("/user", new UserController_1.UserController().handle);
// Login de usuário
exports.routes.post("/user/login", new UserController_1.UserController().login);
// Busca de cliente por cnpj ou cpf
exports.routes.get("/clients/document/:document", new ClientController_1.ClientController().getDocument);
// Busca de service order por id
exports.routes.get("/service-order/:id", new ServiceOrderController_1.ServiceOrderController().get);
// Aprovacao de ordem de servico por parte do cliente
exports.routes.post("/service-order/:id/approve", new ServiceOrderController_1.ServiceOrderController().approve);
// Middleware de autenticação
exports.routes.use(AuthMiddleware_1.AuthMiddleware);
// Rotas de usuário
exports.routes.post("/user/logout", new UserController_1.UserController().logout);
// Rotas de clientes
exports.routes.post("/clients", clientValidations_1.createClientValidation, new ClientController_1.ClientController().handle);
exports.routes.get("/clients", new ClientController_1.ClientController().list);
exports.routes.get("/clients/:id", new ClientController_1.ClientController().get);
// Rotas de estoque
exports.routes.get("/stock/low", new StockController_1.StockController().getLowStock);
exports.routes.get("/stock/critical", new StockController_1.StockController().getCriticalStock);
exports.routes.get("/stock/movements", new StockController_1.StockController().getMovements);
exports.routes.get("/stock/summary", new StockController_1.StockController().getStockSummary);
exports.routes.post("/stock/add", new StockController_1.StockController().addStock);
exports.routes.get("/stock/check/:partId/:quantity", new StockController_1.StockController().checkAvailability);
// Rotas de ordem de serviço
exports.routes.post("/service-order/", new ServiceOrderController_1.ServiceOrderController().handle);
exports.routes.get("/service-order", new ServiceOrderController_1.ServiceOrderController().list);
exports.routes.get("/service-order/:id", new ServiceOrderController_1.ServiceOrderController().get);
exports.routes.get("/service-order/:id/status", new ServiceOrderController_1.ServiceOrderController().getStatus); // NOVA
exports.routes.post("/service-order/:id/accept", new ServiceOrderController_1.ServiceOrderController().acceptOrder);
exports.routes.post("/service-order/:id/reject", new ServiceOrderController_1.ServiceOrderController().reject); // NOVA
exports.routes.post("/service-order/:id/diagnostic", new ServiceOrderController_1.ServiceOrderController().addDiagnostic);
exports.routes.post("/service-order/:id/finish-diagnostic", new ServiceOrderController_1.ServiceOrderController().finishDiagnostic);
exports.routes.post("/service-order/:id/approve", new ServiceOrderController_1.ServiceOrderController().approve);
exports.routes.post("/service-order/:id/finish", new ServiceOrderController_1.ServiceOrderController().finish);
exports.routes.post("/service-order/:id/deliver", new ServiceOrderController_1.ServiceOrderController().deliver);
// Rotas de execucao de servicos
exports.routes.post("/service-executions/start", new ServiceExecutionController_1.ServiceExecutionController().startService);
exports.routes.post("/service-executions/finish", new ServiceExecutionController_1.ServiceExecutionController().finishService);
exports.routes.get("/service-executions/average/:serviceId", new ServiceExecutionController_1.ServiceExecutionController().getAverageByService);
exports.routes.get("/service-executions/averages", new ServiceExecutionController_1.ServiceExecutionController().getAllAverages);
exports.routes.get("/service-executions/timeline/:serviceOrderId", new ServiceExecutionController_1.ServiceExecutionController().getTimeline);
// Rotas de veículos
exports.routes.post("/vehicles", vehicleValidations_1.createVehicleValidation, new VehiclesController_ts_1.VehicleController().handle);
exports.routes.get("/vehicles", new VehiclesController_ts_1.VehicleController().list);
exports.routes.get("/vehicles/:id", new VehiclesController_ts_1.VehicleController().get);
// Rotas de peças
exports.routes.post("/parts", new PartController_1.PartController().handle);
exports.routes.get("/parts", new PartController_1.PartController().list);
exports.routes.get("/parts/:id", new PartController_1.PartController().get);
exports.routes.put("/parts/:id", new PartController_1.PartController().update);
exports.routes.delete("/parts/:id", new PartController_1.PartController().delete);
// Rotas de serviços
exports.routes.post("/services", new ServiceController_1.ServiceController().handle);
exports.routes.get("/services", new ServiceController_1.ServiceController().list);
exports.routes.get("/services/:id", new ServiceController_1.ServiceController().get);
exports.routes.put("/services/:id", new ServiceController_1.ServiceController().update);
exports.routes.delete("/services/:id", new ServiceController_1.ServiceController().delete);
