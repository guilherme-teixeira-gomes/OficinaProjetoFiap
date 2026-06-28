import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

export class ListPartsUseCase {
  async list() {
    const repo = AppDataSource.getRepository(Part);
    return repo.find();
  }
}