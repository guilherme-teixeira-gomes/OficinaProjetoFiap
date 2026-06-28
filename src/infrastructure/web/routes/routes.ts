import { Router } from "express";
import { ClientController } from "../controllers/ClientController";
import { ServiceOrderController } from "../controllers/ServiceOrderController";
import { PartController } from "../controllers/PartController";
import { ServiceController } from "../controllers/ServiceController";
import { UserController } from "../controllers/UserController";
import { ServiceExecutionController } from "../controllers/ServiceExecutionController";
import { StockController } from "../controllers/StockController";
import { AuthMiddleware } from "../../auth/middlewares/AuthMiddleware";
import { createClientValidation } from "../../../shared/validations/clientValidations";
import { createVehicleValidation } from "../../../shared/validations/vehicleValidations";
import { VehicleController } from "../controllers/VehiclesController";

export const routes = Router();

// ─── Rotas públicas ───────────────────────────────────────────────────────────

routes.post("/user", (req, res) => new UserController().handle(req, res));
routes.post("/user/login", (req, res) => new UserController().login(req, res));

routes.get("/clients/document/:document", (req, res) => new ClientController().getDocument(req, res));

routes.get("/service-order/:id", (req, res) => new ServiceOrderController().get(req, res));
routes.get("/service-order/:id/status", (req, res) => new ServiceOrderController().getStatus(req, res));

routes.post("/service-order/:id/approve", (req, res) => new ServiceOrderController().approve(req, res));
routes.post("/service-order/:id/reject", (req, res) => new ServiceOrderController().reject(req, res));

// ─── Middleware de autenticação ───────────────────────────────────────────────
routes.use(AuthMiddleware);

// ─── Usuário ──────────────────────────────────────────────────────────────────
routes.post("/user/logout", (req, res) => new UserController().logout(req, res));

// ─── Clientes ─────────────────────────────────────────────────────────────────
routes.post("/clients", createClientValidation, (req, res) => new ClientController().handle(req, res));
routes.get("/clients", (req, res) => new ClientController().list(req, res));
routes.get("/clients/:id", (req, res) => new ClientController().get(req, res));
routes.put("/clients/:id", (req, res) => new ClientController().update(req, res));
routes.delete("/clients/:id", (req, res) => new ClientController().delete(req, res));

// ─── Estoque ──────────────────────────────────────────────────────────────────
routes.get("/stock/low", (req, res) => new StockController().getLowStock(req, res));
routes.get("/stock/critical", (req, res) => new StockController().getCriticalStock(req, res));
routes.get("/stock/movements", (req, res) => new StockController().getMovements(req, res));
routes.get("/stock/summary", (req, res) => new StockController().getStockSummary(req, res));
routes.post("/stock/add", (req, res) => new StockController().addStock(req, res));
routes.get("/stock/check/:partId/:quantity", (req, res) => new StockController().checkAvailability(req, res));

// ─── Ordens de serviço ────────────────────────────────────────────────────────
routes.post("/service-order", (req, res) => new ServiceOrderController().handle(req, res));
routes.get("/service-order", (req, res) => new ServiceOrderController().list(req, res));
routes.post("/service-order/:id/accept", (req, res) => new ServiceOrderController().acceptOrder(req, res));
routes.post("/service-order/:id/diagnostic", (req, res) => new ServiceOrderController().addDiagnostic(req, res));
routes.post("/service-order/:id/finish-diagnostic", (req, res) => new ServiceOrderController().finishDiagnostic(req, res));
routes.post("/service-order/:id/finish", (req, res) => new ServiceOrderController().finish(req, res));
routes.post("/service-order/:id/deliver", (req, res) => new ServiceOrderController().deliver(req, res));

// ─── Execuções de serviço ─────────────────────────────────────────────────────
routes.post("/service-executions/start", (req, res) => new ServiceExecutionController().startService(req, res));
routes.post("/service-executions/finish", (req, res) => new ServiceExecutionController().finishService(req, res));
routes.get("/service-executions/average/:serviceId", (req, res) => new ServiceExecutionController().getAverageByService(req, res));
routes.get("/service-executions/averages", (req, res) => new ServiceExecutionController().getAllAverages(req, res));
routes.get("/service-executions/timeline/:serviceOrderId", (req, res) => new ServiceExecutionController().getTimeline(req, res));

// ─── Veículos ─────────────────────────────────────────────────────────────────
routes.post("/vehicles", createVehicleValidation, (req, res) => new VehicleController().handle(req, res));
routes.get("/vehicles", (req, res) => new VehicleController().list(req, res));
routes.get("/vehicles/:id", (req, res) => new VehicleController().get(req, res));
routes.put("/vehicles/:id", (req, res) => new VehicleController().update(req, res));
routes.delete("/vehicles/:id", (req, res) => new VehicleController().delete(req, res));

// ─── Peças ────────────────────────────────────────────────────────────────────
routes.post("/parts", (req, res) => new PartController().handle(req, res));
routes.get("/parts", (req, res) => new PartController().list(req, res));
routes.get("/parts/:id", (req, res) => new PartController().get(req, res));
routes.put("/parts/:id", (req, res) => new PartController().update(req, res));
routes.delete("/parts/:id", (req, res) => new PartController().delete(req, res));

// ─── Serviços ─────────────────────────────────────────────────────────────────
routes.post("/services", (req, res) => new ServiceController().handle(req, res));
routes.get("/services", (req, res) => new ServiceController().list(req, res));
routes.get("/services/:id", (req, res) => new ServiceController().get(req, res));
routes.put("/services/:id", (req, res) => new ServiceController().update(req, res));
routes.delete("/services/:id", (req, res) => new ServiceController().delete(req, res));