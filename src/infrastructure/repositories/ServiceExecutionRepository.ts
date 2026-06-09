import { ServiceExecution } from "../../domain/entities/ServiceExecution";
import { AppDataSource } from "../database/data-source";

export const ServiceExecutionRepository = AppDataSource.getRepository(ServiceExecution);