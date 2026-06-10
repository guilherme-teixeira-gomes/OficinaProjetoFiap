import { Client } from "../../domain/entities/Client";
import { AppDataSource } from "../database/data-source";

export const getClientRepository = () => AppDataSource.getRepository(Client);
export const ClientRepository = new Proxy({} as ReturnType<typeof getClientRepository>, {
  get(_target, prop) {
    return getClientRepository()[prop as keyof ReturnType<typeof getClientRepository>];
  }
});
