import { AppDataSource } from "../data-source";
import { Client } from "../entities/Client";

export const ClientRepository = AppDataSource.getRepository(Client);