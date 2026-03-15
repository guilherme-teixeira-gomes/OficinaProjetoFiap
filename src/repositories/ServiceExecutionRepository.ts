import { AppDataSource } from "../data-source";
import { ServiceExecution } from "../entities/ServiceExecution";

export const ServiceExecutionRepository = AppDataSource.getRepository(ServiceExecution);