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



export const routes = Router();
routes.get('/static')
routes.post("/user", new UserController().handle);  // postman ok 
routes.post("/user/login", new UserController().login); //doc ok
routes.get("/clients/document/:document", new ClientController().getDocument); // postman ok 
routes.get("/service-order/:id", new ServiceOrderController().get); // postman ok 

routes.use(AuthMiddleware)
routes.post("/user/logout", new UserController().logout); //doc ok

// Criação de clientes
routes.post("/clients", createClientValidation, new ClientController().handle);  // postman ok 
routes.get("/clients", new ClientController().list); // postman ok 
routes.get("/clients/:id", new ClientController().get); // postman ok 

// Criação de ordem de serviço
routes.post("/service-order", new ServiceOrderController().handle); // postman ok 
routes.get("/service-order", new ServiceOrderController().list); // postman ok 

// Atualizar status da OS
routes.patch("/service-order/:id/status", new ServiceOrderController().updateStatus); // postman ok 

// Criação de veiculos
routes.post("/vehicles", createVehicleValidation, new VehicleController().handle); // postman ok 
routes.get("/vehicles", new VehicleController().list);  // postman ok 
routes.get("/vehicles/:id", new VehicleController().get);  // postman ok 

// Criação de pecas
routes.post("/parts", new PartController().handle); // postman ok 
routes.get("/parts", new PartController().list); // postman ok 
routes.get("/parts/:id", new PartController().get); // postman ok 
routes.put("/parts/:id", new PartController().update); // postman ok 
routes.delete("/parts/:id", new PartController().delete);  // postman ok 

// Criação de servicos
routes.post("/services", new ServiceController().handle); // postman ok 
routes.get("/services", new ServiceController().list); // postman ok 
routes.get("/services/:id", new ServiceController().get); // postman ok 
routes.put("/services/:id", new ServiceController().update);  // postman ok 
routes.delete("/services/:id", new ServiceController().delete); // postman ok 