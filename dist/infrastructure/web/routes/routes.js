"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const ClientController_1 = require("../controllers/ClientController");
const ServiceOrderController_1 = require("../controllers/ServiceOrderController");
const PartController_1 = require("../controllers/PartController");
const ServiceController_1 = require("../controllers/ServiceController");
const UserController_1 = require("../controllers/UserController");
const ServiceExecutionController_1 = require("../controllers/ServiceExecutionController");
const StockController_1 = require("../controllers/StockController");
const AuthMiddleware_1 = require("../../auth/middlewares/AuthMiddleware");
const clientValidations_1 = require("../../../shared/validations/clientValidations");
const vehicleValidations_1 = require("../../../shared/validations/vehicleValidations");
const VehiclesController_1 = require("../controllers/VehiclesController");
exports.routes = (0, express_1.Router)();
// ─── Rotas públicas ───────────────────────────────────────────────────────────
exports.routes.post("/user", (req, res) => new UserController_1.UserController().handle(req, res));
exports.routes.post("/user/login", (req, res) => new UserController_1.UserController().login(req, res));
exports.routes.get("/clients/document/:document", (req, res) => new ClientController_1.ClientController().getDocument(req, res));
exports.routes.get("/service-order/:id", (req, res) => new ServiceOrderController_1.ServiceOrderController().get(req, res));
exports.routes.get("/service-order/:id/status", (req, res) => new ServiceOrderController_1.ServiceOrderController().getStatus(req, res));
exports.routes.post("/service-order/:id/approve", (req, res) => new ServiceOrderController_1.ServiceOrderController().approve(req, res));
exports.routes.post("/service-order/:id/reject", (req, res) => new ServiceOrderController_1.ServiceOrderController().reject(req, res));
// ─── Middleware de autenticação ───────────────────────────────────────────────
exports.routes.use(AuthMiddleware_1.AuthMiddleware);
// ─── Usuário ──────────────────────────────────────────────────────────────────
exports.routes.post("/user/logout", (req, res) => new UserController_1.UserController().logout(req, res));
// ─── Clientes ─────────────────────────────────────────────────────────────────
exports.routes.post("/clients", clientValidations_1.createClientValidation, (req, res) => new ClientController_1.ClientController().handle(req, res));
exports.routes.get("/clients", (req, res) => new ClientController_1.ClientController().list(req, res));
exports.routes.get("/clients/:id", (req, res) => new ClientController_1.ClientController().get(req, res));
exports.routes.put("/clients/:id", (req, res) => new ClientController_1.ClientController().update(req, res));
exports.routes.delete("/clients/:id", (req, res) => new ClientController_1.ClientController().delete(req, res));
// ─── Estoque ──────────────────────────────────────────────────────────────────
exports.routes.get("/stock/low", (req, res) => new StockController_1.StockController().getLowStock(req, res));
exports.routes.get("/stock/critical", (req, res) => new StockController_1.StockController().getCriticalStock(req, res));
exports.routes.get("/stock/movements", (req, res) => new StockController_1.StockController().getMovements(req, res));
exports.routes.get("/stock/summary", (req, res) => new StockController_1.StockController().getStockSummary(req, res));
exports.routes.post("/stock/add", (req, res) => new StockController_1.StockController().addStock(req, res));
exports.routes.get("/stock/check/:partId/:quantity", (req, res) => new StockController_1.StockController().checkAvailability(req, res));
// ─── Ordens de serviço ────────────────────────────────────────────────────────
exports.routes.post("/service-order", (req, res) => new ServiceOrderController_1.ServiceOrderController().handle(req, res));
exports.routes.get("/service-order", (req, res) => new ServiceOrderController_1.ServiceOrderController().list(req, res));
exports.routes.post("/service-order/:id/accept", (req, res) => new ServiceOrderController_1.ServiceOrderController().acceptOrder(req, res));
exports.routes.post("/service-order/:id/diagnostic", (req, res) => new ServiceOrderController_1.ServiceOrderController().addDiagnostic(req, res));
exports.routes.post("/service-order/:id/finish-diagnostic", (req, res) => new ServiceOrderController_1.ServiceOrderController().finishDiagnostic(req, res));
exports.routes.post("/service-order/:id/finish", (req, res) => new ServiceOrderController_1.ServiceOrderController().finish(req, res));
exports.routes.post("/service-order/:id/deliver", (req, res) => new ServiceOrderController_1.ServiceOrderController().deliver(req, res));
// ─── Execuções de serviço ─────────────────────────────────────────────────────
exports.routes.post("/service-executions/start", (req, res) => new ServiceExecutionController_1.ServiceExecutionController().startService(req, res));
exports.routes.post("/service-executions/finish", (req, res) => new ServiceExecutionController_1.ServiceExecutionController().finishService(req, res));
exports.routes.get("/service-executions/average/:serviceId", (req, res) => new ServiceExecutionController_1.ServiceExecutionController().getAverageByService(req, res));
exports.routes.get("/service-executions/averages", (req, res) => new ServiceExecutionController_1.ServiceExecutionController().getAllAverages(req, res));
exports.routes.get("/service-executions/timeline/:serviceOrderId", (req, res) => new ServiceExecutionController_1.ServiceExecutionController().getTimeline(req, res));
// ─── Veículos ─────────────────────────────────────────────────────────────────
exports.routes.post("/vehicles", vehicleValidations_1.createVehicleValidation, (req, res) => new VehiclesController_1.VehicleController().handle(req, res));
exports.routes.get("/vehicles", (req, res) => new VehiclesController_1.VehicleController().list(req, res));
exports.routes.get("/vehicles/:id", (req, res) => new VehiclesController_1.VehicleController().get(req, res));
exports.routes.put("/vehicles/:id", (req, res) => new VehiclesController_1.VehicleController().update(req, res));
exports.routes.delete("/vehicles/:id", (req, res) => new VehiclesController_1.VehicleController().delete(req, res));
// ─── Peças ────────────────────────────────────────────────────────────────────
exports.routes.post("/parts", (req, res) => new PartController_1.PartController().handle(req, res));
exports.routes.get("/parts", (req, res) => new PartController_1.PartController().list(req, res));
exports.routes.get("/parts/:id", (req, res) => new PartController_1.PartController().get(req, res));
exports.routes.put("/parts/:id", (req, res) => new PartController_1.PartController().update(req, res));
exports.routes.delete("/parts/:id", (req, res) => new PartController_1.PartController().delete(req, res));
// ─── Serviços ─────────────────────────────────────────────────────────────────
exports.routes.post("/services", (req, res) => new ServiceController_1.ServiceController().handle(req, res));
exports.routes.get("/services", (req, res) => new ServiceController_1.ServiceController().list(req, res));
exports.routes.get("/services/:id", (req, res) => new ServiceController_1.ServiceController().get(req, res));
exports.routes.put("/services/:id", (req, res) => new ServiceController_1.ServiceController().update(req, res));
exports.routes.delete("/services/:id", (req, res) => new ServiceController_1.ServiceController().delete(req, res));
