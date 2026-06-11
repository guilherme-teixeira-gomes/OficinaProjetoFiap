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

// Criação de usuário e login
routes.post("/user", new UserController().handle);
routes.post("/user/login", new UserController().login);

// Busca de cliente por CPF/CNPJ (para o formulário de abertura de OS)
routes.get("/clients/document/:document", new ClientController().getDocument);

// Consulta de OS por ID — pública para o cliente acompanhar sem login
routes.get("/service-order/:id", new ServiceOrderController().get);

// Consulta de status da OS — pública para o cliente acompanhar
routes.get("/service-order/:id/status", new ServiceOrderController().getStatus);

// Aprovação/recusa de orçamento — notificação externa do cliente (sem login)
routes.post("/service-order/:id/approve", new ServiceOrderController().approve);
routes.post("/service-order/:id/reject", new ServiceOrderController().reject);

// ─── Middleware de autenticação (tudo abaixo exige JWT) ───────────────────────
routes.use(AuthMiddleware);

// ─── Usuário ─────────────────────────────────────────────────────────────────
routes.post("/user/logout", new UserController().logout);

// ─── Clientes ────────────────────────────────────────────────────────────────
routes.post("/clients", createClientValidation, new ClientController().handle);
routes.get("/clients", new ClientController().list);
routes.get("/clients/:id", new ClientController().get);
routes.put("/clients/:id", new ClientController().update);
routes.delete("/clients/:id", new ClientController().delete);

// ─── Estoque ─────────────────────────────────────────────────────────────────
routes.get("/stock/low", new StockController().getLowStock);
routes.get("/stock/critical", new StockController().getCriticalStock);
routes.get("/stock/movements", new StockController().getMovements);
routes.get("/stock/summary", new StockController().getStockSummary);
routes.post("/stock/add", new StockController().addStock);
routes.get("/stock/check/:partId/:quantity", new StockController().checkAvailability);

// ─── Ordens de serviço ────────────────────────────────────────────────────────
routes.post("/service-order", new ServiceOrderController().handle);
routes.get("/service-order", new ServiceOrderController().list);
routes.post("/service-order/:id/accept", new ServiceOrderController().acceptOrder);
routes.post("/service-order/:id/diagnostic", new ServiceOrderController().addDiagnostic);
routes.post("/service-order/:id/finish-diagnostic", new ServiceOrderController().finishDiagnostic);
routes.post("/service-order/:id/finish", new ServiceOrderController().finish);
routes.post("/service-order/:id/deliver", new ServiceOrderController().deliver);

// ─── Execuções de serviço ─────────────────────────────────────────────────────
routes.post("/service-executions/start", new ServiceExecutionController().startService);
routes.post("/service-executions/finish", new ServiceExecutionController().finishService);
routes.get("/service-executions/average/:serviceId", new ServiceExecutionController().getAverageByService);
routes.get("/service-executions/averages", new ServiceExecutionController().getAllAverages);
routes.get("/service-executions/timeline/:serviceOrderId", new ServiceExecutionController().getTimeline);

// ─── Veículos ─────────────────────────────────────────────────────────────────
routes.post("/vehicles", createVehicleValidation, new VehicleController().handle);
routes.get("/vehicles", new VehicleController().list);
routes.get("/vehicles/:id", new VehicleController().get);
routes.put("/vehicles/:id", new VehicleController().update);
routes.delete("/vehicles/:id", new VehicleController().delete);

// ─── Peças ────────────────────────────────────────────────────────────────────
routes.post("/parts", new PartController().handle);
routes.get("/parts", new PartController().list);
routes.get("/parts/:id", new PartController().get);
routes.put("/parts/:id", new PartController().update);
routes.delete("/parts/:id", new PartController().delete);

// ─── Serviços ─────────────────────────────────────────────────────────────────
routes.post("/services", new ServiceController().handle);
routes.get("/services", new ServiceController().list);
routes.get("/services/:id", new ServiceController().get);
routes.put("/services/:id", new ServiceController().update);
routes.delete("/services/:id", new ServiceController().delete);