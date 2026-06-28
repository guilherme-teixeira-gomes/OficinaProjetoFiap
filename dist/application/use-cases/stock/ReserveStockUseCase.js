"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveStockUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
const StockMovement_1 = require("../../../domain/entities/StockMovement");
class ReserveStockUseCase {
    async execute(partId, quantity, serviceOrderId, description) {
        const partRepo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const movementRepo = data_source_1.AppDataSource.getRepository(StockMovement_1.StockMovement);
        const part = await partRepo.findOne({ where: { id: partId } });
        if (!part)
            throw new Error("Peça não encontrada");
        if (part.stock < quantity)
            throw new Error(`Estoque insuficiente para ${part.name}`);
        part.stock -= quantity;
        await partRepo.save(part);
        const movement = movementRepo.create({ partId: part.id, partName: part.name, quantity: -quantity, type: "OUT", unitPrice: part.price, totalValue: part.price * quantity, serviceOrderId, description: description || `Baixa de ${quantity} unidade(s)`, status: "CONFIRMADO" });
        return movementRepo.save(movement);
    }
}
exports.ReserveStockUseCase = ReserveStockUseCase;
