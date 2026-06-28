import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Service } from "../../../domain/entities/Service";

interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  active?: boolean;
}

export class CreateServiceUseCase {
  async create(data: CreateServiceDTO) {
    const repo = AppDataSource.getRepository(Service);
    const service = repo.create(data);
    return repo.save(service);
  }
}