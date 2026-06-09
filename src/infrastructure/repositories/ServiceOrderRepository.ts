import { ServiceOrder } from "../../domain/entities/ServiceOrder";
import { AppDataSource } from "../database/data-source";

export const ServiceOrderRepository = AppDataSource.getRepository(ServiceOrder);