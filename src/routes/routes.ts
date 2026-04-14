import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ClientController } from "../controllers/ClientController";
import { ServiceOrderController } from "../controllers/ServiceOrderController";
import { VehicleController } from "../controllers/VehiclesController.ts";
import { PartController } from "../controllers/PartController";
import { ServiceController } from "../controllers/ServiceController";
import { UserController } from "../controllers/UserController";
import { createClientValidation } from "../validations/clientValidations";
import { createVehicleValidation } from "../validations/vehicleValidations";
import { ServiceExecutionController } from "../controllers/ServiceExecutionController";
import { StockController } from "../controllers/StockController";


export const routes = Router();

// Rotas públicas
routes.get('/static');

// Criacao de usuário
routes.post("/user", new UserController().handle);

// Login de usuário
routes.post("/user/login", new UserController().login);

// Busca de cliente por cnpj ou cpf
routes.get("/clients/document/:document", new ClientController().getDocument);

// Busca de service order por id
routes.get("/service-order/:id", new ServiceOrderController().get);

// Aprovacao de ordem de servico por parte do cliente
routes.post("/service-order/:id/approve", new ServiceOrderController().approve);

// Middleware de autenticação
routes.use(AuthMiddleware);

// Rotas de usuário
routes.post("/user/logout", new UserController().logout);

// Rotas de clientes
routes.post("/clients", createClientValidation, new ClientController().handle);
routes.get("/clients", new ClientController().list);
routes.get("/clients/:id", new ClientController().get);

// Rotas de estoque
routes.get("/stock/low", new StockController().getLowStock);
routes.get("/stock/critical", new StockController().getCriticalStock); 
routes.get("/stock/movements", new StockController().getMovements);  
routes.get("/stock/summary",  new StockController().getStockSummary); 
routes.post("/stock/add",  new StockController().addStock); 
routes.get("/stock/check/:partId/:quantity", new StockController().checkAvailability);

// Rotas de ordem de serviço
routes.post("/service-order/", new ServiceOrderController().handle);
routes.get("/service-order", new ServiceOrderController().list);
routes.post("/service-order/:id/accept", new ServiceOrderController().acceptOrder);
routes.post("/service-order/:id/diagnostic", new ServiceOrderController().addDiagnostic);
routes.post("/service-order/:id/finish-diagnostic", new ServiceOrderController().finishDiagnostic);
routes.post("/service-order/:id/finish", new ServiceOrderController().finish);
routes.post("/service-order/:id/deliver", new ServiceOrderController().deliver);

// Rotas de execucao de servicos
routes.post("/service-executions/start", new ServiceExecutionController().startService);
routes.post("/service-executions/finish",  new ServiceExecutionController().finishService);
routes.get("/service-executions/average/:serviceId",  new ServiceExecutionController().getAverageByService);
routes.get("/service-executions/averages",  new ServiceExecutionController().getAllAverages);
routes.get("/service-executions/timeline/:serviceOrderId", new ServiceExecutionController().getTimeline);

// Rotas de veículos
routes.post("/vehicles", createVehicleValidation, new VehicleController().handle);
routes.get("/vehicles", new VehicleController().list);
routes.get("/vehicles/:id", new VehicleController().get);

// Rotas de peças
routes.post("/parts", new PartController().handle);
routes.get("/parts", new PartController().list);
routes.get("/parts/:id", new PartController().get);
routes.put("/parts/:id", new PartController().update);
routes.delete("/parts/:id", new PartController().delete);

// Rotas de serviços
routes.post("/services", new ServiceController().handle);
routes.get("/services", new ServiceController().list);
routes.get("/services/:id", new ServiceController().get);
routes.put("/services/:id", new ServiceController().update);
routes.delete("/services/:id", new ServiceController().delete);