import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Service } from "../../../domain/entities/Service";

export class GetServiceByIdUseCase {
  async getById(id: number) {
    const repo = AppDataSource.getRepository(Service);
    return repo.findOne({ where: { id } });
  }
}