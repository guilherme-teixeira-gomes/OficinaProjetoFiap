import { Client } from "../../domain/entities/Client";
import { AppDataSource } from "../database/data-source";

export const ClientRepository = AppDataSource.getRepository(Client);