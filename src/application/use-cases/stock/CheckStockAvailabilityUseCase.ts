import { PartRepository } from "../../../infrastructure/repositories/PartRepository";

export class CheckStockAvailabilityUseCase {
  async execute(partId: number, requiredQuantity: number) {
    const part = await PartRepository.findOne({ where: { id: partId } });

    if (!part) {
      throw new Error(`Peça com ID ${partId} não encontrada`);
    }

    const available = part.stock >= requiredQuantity;

    return {
      available,
      currentStock: part.stock,
      requiredQuantity,
      deficit: available ? undefined : requiredQuantity - part.stock
    };
  }
}