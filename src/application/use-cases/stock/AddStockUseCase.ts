import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";
import { StockMovement } from "../../../domain/entities/StockMovement";

export class AddStockUseCase {
  async execute(partId: number, quantity: number, description?: string) {
    const partRepo = AppDataSource.getRepository(Part);
    const movementRepo = AppDataSource.getRepository(StockMovement);

    const part = await partRepo.findOne({ where: { id: partId } });
    if (!part) throw new Error("Peça não encontrada");

    part.stock += quantity;
    await partRepo.save(part);

    const movement = movementRepo.create({ partId: part.id, partName: part.name, quantity, type: "IN", unitPrice: part.price, totalValue: part.price * quantity, description: description || "Entrada de estoque", status: "CONFIRMADO" });
    return movementRepo.save(movement);
  }
}