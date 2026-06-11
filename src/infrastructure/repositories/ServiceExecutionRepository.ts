import { ServiceExecution } from "../../domain/entities/ServiceExecution";
import { AppDataSource } from "../database/data-source";

export const getServiceExecutionRepository = () => AppDataSource.getRepository(ServiceExecution);
export const ServiceExecutionRepository = new Proxy({} as ReturnType<typeof getServiceExecutionRepository>, {
  get(_target, prop) {
    return getServiceExecutionRepository()[prop as keyof ReturnType<typeof getServiceExecutionRepository>];
  }
});
