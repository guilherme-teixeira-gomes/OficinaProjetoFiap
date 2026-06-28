import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

export class CheckStockAvailabilityUseCase {
  async execute(partId: number, requiredQuantity: number) {
    const repo = AppDataSource.getRepository(Part);
    const part = await repo.findOne({ where: { id: partId } });
    if (!part) throw new Error(`Peça com ID ${partId} não encontrada`);

    const available = part.stock >= requiredQuantity;
    return { available, currentStock: part.stock, requiredQuantity, deficit: available ? undefined : requiredQuantity - part.stock };
  }
}