import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Client } from "../../../domain/entities/Client";

export class ListClientsUseCase {
  async list() {
    const repo = AppDataSource.getRepository(Client);
    return repo.find({ relations: ["vehicles", "orders"] });
  }
}