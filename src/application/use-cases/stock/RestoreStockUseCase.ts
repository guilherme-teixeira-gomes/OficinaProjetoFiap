import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";
import { StockMovement } from "../../../domain/entities/StockMovement";

export class RestoreStockUseCase {
  async execute(partId: number, quantity: number, serviceOrderId: number) {
    const partRepo = AppDataSource.getRepository(Part);
    const movementRepo = AppDataSource.getRepository(StockMovement);

    const part = await partRepo.findOne({ where: { id: partId } });
    if (!part) throw new Error("Peça não encontrada");

    part.stock += quantity;
    await partRepo.save(part);

    const movement = movementRepo.create({ partId: part.id, partName: part.name, quantity, type: "IN", unitPrice: part.price, totalValue: part.price * quantity, serviceOrderId, status: "CONFIRMADO" });
    return movementRepo.save(movement);
  }
}