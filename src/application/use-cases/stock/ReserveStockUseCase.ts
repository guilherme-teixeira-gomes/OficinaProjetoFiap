import { PartRepository } from "../../../infrastructure/repositories/PartRepository";
import { StockMovementRepository } from "../../../infrastructure/repositories/StockMovementRepository";

export class ReserveStockUseCase {
  async execute(partId: number, quantity: number, serviceOrderId: number, description?: string) {
    const part = await PartRepository.findOne({ where: { id: partId } });

    if (!part) throw new Error("Peça não encontrada");

    if (part.stock < quantity) {
      throw new Error(`Estoque insuficiente para ${part.name}`);
    }

    part.stock -= quantity;
    await PartRepository.save(part);

    const movement = StockMovementRepository.create({
      partId: part.id,
      partName: part.name,
      quantity: -quantity,
      type: "OUT",
      unitPrice: part.price,
      totalValue: part.price * quantity,
      serviceOrderId,
      description: description || `Baixa de ${quantity} unidade(s)`,
      status: "CONFIRMADO"
    });

    return StockMovementRepository.save(movement);
  }
}