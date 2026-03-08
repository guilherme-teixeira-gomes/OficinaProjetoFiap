import { Router } from "express";
import { CreateClientController } from "../controllers/CreateClientController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";



export const routes = Router();
routes.get('/static')
routes.post("/clients", new CreateClientController().handle); 
routes.use(AuthMiddleware)

routes.get('',);
routes.put(":id", ); 
routes.delete(":id", );

