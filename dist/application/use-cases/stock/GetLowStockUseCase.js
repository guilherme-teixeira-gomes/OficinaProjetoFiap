"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLowStockUseCase = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class GetLowStockUseCase {
    async execute() {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        return repo.find({ where: { stock: (0, typeorm_1.LessThan)(5) }, order: { stock: "ASC" } });
    }
}
exports.GetLowStockUseCase = GetLowStockUseCase;
