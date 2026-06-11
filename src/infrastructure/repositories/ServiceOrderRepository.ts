import { ServiceOrder } from "../../domain/entities/ServiceOrder";
import { AppDataSource } from "../database/data-source";

export const getServiceOrderRepository = () => AppDataSource.getRepository(ServiceOrder);
export const ServiceOrderRepository = new Proxy({} as ReturnType<typeof getServiceOrderRepository>, {
  get(_target, prop) {
    return getServiceOrderRepository()[prop as keyof ReturnType<typeof getServiceOrderRepository>];
  }
});
