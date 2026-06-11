"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLowStockUseCase = void 0;
const typeorm_1 = require("typeorm");
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
class GetLowStockUseCase {
    async execute() {
        return PartRepository_1.PartRepository.find({
            where: { stock: (0, typeorm_1.LessThan)(5) },
            order: { stock: "ASC" }
        });
    }
}
exports.GetLowStockUseCase = GetLowStockUseCase;
