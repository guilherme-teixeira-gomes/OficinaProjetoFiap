"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStockUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
const StockMovementRepository_1 = require("../../../infrastructure/repositories/StockMovementRepository");
class AddStockUseCase {
    async execute(partId, quantity, description) {
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
            description: description || "Entrada de estoque",
            status: "CONFIRMADO"
        });
        return StockMovementRepository_1.StockMovementRepository.save(movement);
    }
}
exports.AddStockUseCase = AddStockUseCase;
