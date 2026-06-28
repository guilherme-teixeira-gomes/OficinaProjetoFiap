"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStockSummaryUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class GetStockSummaryUseCase {
    async execute() {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const parts = await repo.find();
        const totalValue = parts.reduce((sum, part) => sum + (part.price * part.stock), 0);
        return {
            totalParts: parts.length,
            totalValue,
            partsByStock: parts.map(part => ({ name: part.name, stock: part.stock, minimumStock: part.minimumStock, status: part.stock <= part.minimumStock ? "CRÍTICO" : part.stock < 10 ? "BAIXO" : "NORMAL" }))
        };
    }
}
exports.GetStockSummaryUseCase = GetStockSummaryUseCase;
