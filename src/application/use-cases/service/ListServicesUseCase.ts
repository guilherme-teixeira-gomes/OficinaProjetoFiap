import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Service } from "../../../domain/entities/Service";

export class ListServicesUseCase {
  async list() {
    const repo = AppDataSource.getRepository(Service);
    return repo.find();
  }
}