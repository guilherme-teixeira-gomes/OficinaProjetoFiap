"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveStockUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
const StockMovementRepository_1 = require("../../../infrastructure/repositories/StockMovementRepository");
class ReserveStockUseCase {
    async execute(partId, quantity, serviceOrderId, description) {
        const part = await PartRepository_1.PartRepository.findOne({ where: { id: partId } });
        if (!part)
            throw new Error("Peça não encontrada");
        if (part.stock < quantity) {
            throw new Error(`Estoque insuficiente para ${part.name}`);
        }
        part.stock -= quantity;
        await PartRepository_1.PartRepository.save(part);
        const movement = StockMovementRepository_1.StockMovementRepository.create({
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
        return StockMovementRepository_1.StockMovementRepository.save(movement);
    }
}
exports.ReserveStockUseCase = ReserveStockUseCase;
