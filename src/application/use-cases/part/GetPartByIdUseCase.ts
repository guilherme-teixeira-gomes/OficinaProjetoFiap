import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

export class GetPartByIdUseCase {
  async getById(id: number) {
    const repo = AppDataSource.getRepository(Part);
    return repo.findOne({ where: { id } });
  }
}