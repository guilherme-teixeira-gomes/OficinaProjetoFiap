"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCriticalStockUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class GetCriticalStockUseCase {
    async execute() {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        return repo.createQueryBuilder("part").where("part.stock <= part.minimumStock").orderBy("part.stock", "ASC").getMany();
    }
}
exports.GetCriticalStockUseCase = GetCriticalStockUseCase;
