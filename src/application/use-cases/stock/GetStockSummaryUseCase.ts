import { PartRepository } from "../../../infrastructure/repositories/PartRepository";

export class GetStockSummaryUseCase {

  async execute() {
    const parts = await PartRepository.find();

    const totalValue = parts.reduce(
      (sum, part) => sum + (part.price * part.stock),
      0
    );

    return {
      totalParts: parts.length,
      totalValue,
      partsByStock: parts.map(part => ({
        name: part.name,
        stock: part.stock,
        minimumStock: part.minimumStock,
        status:
          part.stock <= part.minimumStock
            ? "CRÍTICO"
            : part.stock < 10
            ? "BAIXO"
            : "NORMAL"
      }))
    };
  }
}