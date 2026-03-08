"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const ClientController_1 = require("../controllers/ClientController");
const ServiceOrderController_1 = require("../controllers/ServiceOrderController");
const VehiclesController_ts_1 = require("../controllers/VehiclesController.ts");
const PartController_1 = require("../controllers/PartController");
const ServiceController_1 = require("../controllers/ServiceController");
exports.routes = (0, express_1.Router)();
exports.routes.get('/static');
// Criação de clientes
exports.routes.post("/clients", new ClientController_1.ClientController().handle); // postman ok 
exports.routes.get("/clients", new ClientController_1.ClientController().list); // postman ok 
exports.routes.get("/clients/:id", new ClientController_1.ClientController().get); // postman ok 
exports.routes.get("/clients/:document", new ClientController_1.ClientController().getDocument);
// Criação de ordem de serviço
exports.routes.post("/service-order", new ServiceOrderController_1.ServiceOrderController().handle);
exports.routes.get("/service-order", new ServiceOrderController_1.ServiceOrderController().list);
exports.routes.get("/service-order/:id", new ServiceOrderController_1.ServiceOrderController().get);
// Atualizar status da OS
exports.routes.patch("/service-order/:id/status", new ServiceOrderController_1.ServiceOrderController().updateStatus);
// Criação de veiculos
exports.routes.post("/vehicles", new VehiclesController_ts_1.VehicleController().handle); // postman ok 
exports.routes.get("/vehicles", new VehiclesController_ts_1.VehicleController().list); // postman ok 
exports.routes.get("/vehicles/:id", new VehiclesController_ts_1.VehicleController().get); // postman ok 
// Criação de pecas
exports.routes.post("/parts", new PartController_1.PartController().handle); // postman ok 
exports.routes.get("/parts", new PartController_1.PartController().list); // postman ok 
exports.routes.get("/parts/:id", new PartController_1.PartController().get); // postman ok 
exports.routes.put("/parts/:id", new PartController_1.PartController().update); // postman ok 
exports.routes.delete("/parts/:id", new PartController_1.PartController().delete);
// Criação de servicos
exports.routes.post("/services", new ServiceController_1.ServiceController().handle); // postman ok 
exports.routes.get("/services", new ServiceController_1.ServiceController().list); // postman ok 
exports.routes.get("/services/:id", new ServiceController_1.ServiceController().get); // postman ok 
exports.routes.put("/services/:id", new ServiceController_1.ServiceController().update);
exports.routes.delete("/services/:id", new ServiceController_1.ServiceController().delete);
exports.routes.use(AuthMiddleware_1.AuthMiddleware);
