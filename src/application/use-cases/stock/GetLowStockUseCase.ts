import { LessThan } from "typeorm";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

export class GetLowStockUseCase {
  async execute() {
    const repo = AppDataSource.getRepository(Part);
    return repo.find({ where: { stock: LessThan(5) }, order: { stock: "ASC" } });
  }
}