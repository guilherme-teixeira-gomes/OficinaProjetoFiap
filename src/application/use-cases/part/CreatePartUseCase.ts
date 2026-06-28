import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

interface CreatePartDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  minimumStock?: number;
}

export class CreatePartUseCase {
  async create(data: CreatePartDTO) {
    const repo = AppDataSource.getRepository(Part);
    const part = repo.create(data);
    return repo.save(part);
  }
}