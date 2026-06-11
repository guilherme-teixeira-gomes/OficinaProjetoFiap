"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckStockAvailabilityUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
class CheckStockAvailabilityUseCase {
    async execute(partId, requiredQuantity) {
        const part = await PartRepository_1.PartRepository.findOne({ where: { id: partId } });
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
exports.CheckStockAvailabilityUseCase = CheckStockAvailabilityUseCase;
