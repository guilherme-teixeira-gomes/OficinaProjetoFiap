import { Service } from "../../domain/entities/Service";
import { AppDataSource } from "../database/data-source";

export const getServiceRepository = () => AppDataSource.getRepository(Service);
export const ServiceRepository = new Proxy({} as ReturnType<typeof getServiceRepository>, {
  get(_target, prop) {
    return getServiceRepository()[prop as keyof ReturnType<typeof getServiceRepository>];
  }
});
