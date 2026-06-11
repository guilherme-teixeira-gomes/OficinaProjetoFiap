"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestoreStockUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
const StockMovementRepository_1 = require("../../../infrastructure/repositories/StockMovementRepository");
class RestoreStockUseCase {
    async execute(partId, quantity, serviceOrderId) {
        const part = await PartRepository_1.PartRepository.findOne({ where: { id: partId } });
        if (!part)
            throw new Error("Peça não encontrada");
        part.stock += quantity;
        await PartRepository_1.PartRepository.save(part);
        const movement = StockMovementRepository_1.StockMovementRepository.create({
            partId: part.id,
            partName: part.name,
            quantity,
            type: "IN",
            unitPrice: part.price,
            totalValue: part.price * quantity,
            serviceOrderId,
            status: "CONFIRMADO"
        });
        return StockMovementRepository_1.StockMovementRepository.save(movement);
    }
}
exports.RestoreStockUseCase = RestoreStockUseCase;
