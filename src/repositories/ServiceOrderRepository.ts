import { AppDataSource } from "../data-source";
import { ServiceOrder } from "../entities/ServiceOrder";

export const ServiceOrderRepository = AppDataSource.getRepository(ServiceOrder);