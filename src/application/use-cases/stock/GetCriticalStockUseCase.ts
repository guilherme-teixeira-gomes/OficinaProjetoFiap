import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

export class GetCriticalStockUseCase {
  async execute() {
    const repo = AppDataSource.getRepository(Part);
    return repo.createQueryBuilder("part").where("part.stock <= part.minimumStock").orderBy("part.stock", "ASC").getMany();
  }
}