import { AppDataSource } from "../data-source";
import { ServiceOrder } from "../entities/ServiceOrder";


const ServiceOrderRepository = AppDataSource.getRepository(ServiceOrder);