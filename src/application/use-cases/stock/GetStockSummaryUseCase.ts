import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

export class GetStockSummaryUseCase {
  async execute() {
    const repo = AppDataSource.getRepository(Part);
    const parts = await repo.find();
    const totalValue = parts.reduce((sum, part) => sum + (part.price * part.stock), 0);
    return {
      totalParts: parts.length,
      totalValue,
      partsByStock: parts.map(part => ({ name: part.name, stock: part.stock, minimumStock: part.minimumStock, status: part.stock <= part.minimumStock ? "CRÍTICO" : part.stock < 10 ? "BAIXO" : "NORMAL" }))
    };
  }
}