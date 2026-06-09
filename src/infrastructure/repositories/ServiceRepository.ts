import { Service } from "../../domain/entities/Service";
import { AppDataSource } from "../database/data-source";

export const ServiceRepository = AppDataSource.getRepository(Service);