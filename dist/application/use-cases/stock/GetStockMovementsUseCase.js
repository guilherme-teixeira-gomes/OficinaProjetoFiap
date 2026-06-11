"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStockMovementsUseCase = void 0;
const StockMovementRepository_1 = require("../../../infrastructure/repositories/StockMovementRepository");
class GetStockMovementsUseCase {
    async execute(filters) {
        const query = StockMovementRepository_1.StockMovementRepository
            .createQueryBuilder("movement")
            .leftJoinAndSelect("movement.part", "part")
            .leftJoinAndSelect("movement.serviceOrder", "serviceOrder")
            .orderBy("movement.createdAt", "DESC");
        if (filters?.partId) {
            query.andWhere("movement.partId = :partId", { partId: filters.partId });
        }
        if (filters?.serviceOrderId) {
            query.andWhere("movement.serviceOrderId = :serviceOrderId", {
                serviceOrderId: filters.serviceOrderId
            });
        }
        if (filters?.startDate) {
            query.andWhere("movement.createdAt >= :startDate", {
                startDate: filters.startDate
            });
        }
        if (filters?.endDate) {
            query.andWhere("movement.createdAt <= :endDate", {
                endDate: filters.endDate
            });
        }
        if (filters?.type) {
            query.andWhere("movement.type = :type", {
                type: filters.type
            });
        }
        return query.getMany();
    }
}
exports.GetStockMovementsUseCase = GetStockMovementsUseCase;
