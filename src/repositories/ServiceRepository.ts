import { AppDataSource } from "../data-source";
import { Service } from "../entities/Service";


const ServiceRepository = AppDataSource.getRepository(Service);