import { PartRepository } from "../../../infrastructure/repositories/PartRepository";
import { StockMovementRepository } from "../../../infrastructure/repositories/StockMovementRepository";

export class AddStockUseCase {
  async execute(partId: number, quantity: number, description?: string) {
    const part = await PartRepository.findOne({ where: { id: partId } });

    if (!part) throw new Error("Peça não encontrada");

    part.stock += quantity;
    await PartRepository.save(part);

    const movement = StockMovementRepository.create({
      partId: part.id,
      partName: part.name,
      quantity,
      type: "IN",
      unitPrice: part.price,
      totalValue: part.price * quantity,
      description: description || "Entrada de estoque",
      status: "CONFIRMADO"
    });

    return StockMovementRepository.save(movement);
  }
}