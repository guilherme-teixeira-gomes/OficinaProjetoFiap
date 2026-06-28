import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Client } from "../../../domain/entities/Client";

export class GetClientByIdUseCase {
  async getById(id: number) {
    const repo = AppDataSource.getRepository(Client);
    return repo.findOne({ where: { id }, relations: ["vehicles", "orders"] });
  }
}