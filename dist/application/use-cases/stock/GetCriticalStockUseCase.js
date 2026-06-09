"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCriticalStockUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
class GetCriticalStockUseCase {
    async execute() {
        return PartRepository_1.PartRepository
            .createQueryBuilder("part")
            .where("part.stock <= part.minimumStock")
            .orderBy("part.stock", "ASC")
            .getMany();
    }
}
exports.GetCriticalStockUseCase = GetCriticalStockUseCase;
