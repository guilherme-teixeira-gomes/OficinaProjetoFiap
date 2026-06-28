import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";
import { StockMovement } from "../../../domain/entities/StockMovement";

export class ReserveStockUseCase {
  async execute(partId: number, quantity: number, serviceOrderId: number, description?: string) {
    const partRepo = AppDataSource.getRepository(Part);
    const movementRepo = AppDataSource.getRepository(StockMovement);

    const part = await partRepo.findOne({ where: { id: partId } });
    if (!part) throw new Error("Peça não encontrada");
    if (part.stock < quantity) throw new Error(`Estoque insuficiente para ${part.name}`);

    part.stock -= quantity;
    await partRepo.save(part);

    const movement = movementRepo.create({ partId: part.id, partName: part.name, quantity: -quantity, type: "OUT", unitPrice: part.price, totalValue: part.price * quantity, serviceOrderId, description: description || `Baixa de ${quantity} unidade(s)`, status: "CONFIRMADO" });
    return movementRepo.save(movement);
  }
}