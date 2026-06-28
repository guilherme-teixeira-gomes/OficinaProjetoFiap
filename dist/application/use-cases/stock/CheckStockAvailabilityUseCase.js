"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckStockAvailabilityUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class CheckStockAvailabilityUseCase {
    async execute(partId, requiredQuantity) {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const part = await repo.findOne({ where: { id: partId } });
        if (!part)
            throw new Error(`Peça com ID ${partId} não encontrada`);
        const available = part.stock >= requiredQuantity;
        return { available, currentStock: part.stock, requiredQuantity, deficit: available ? undefined : requiredQuantity - part.stock };
    }
}
exports.CheckStockAvailabilityUseCase = CheckStockAvailabilityUseCase;
