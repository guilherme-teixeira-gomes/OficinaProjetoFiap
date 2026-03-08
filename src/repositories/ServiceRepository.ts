import { AppDataSource } from "../data-source";
import { Service } from "../entities/Service";

export const ServiceRepository = AppDataSource.getRepository(Service);