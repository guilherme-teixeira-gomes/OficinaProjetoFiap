"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExecutionsByPeriodUseCase = void 0;
const typeorm_1 = require("typeorm");
const ServiceExecutionRepository_1 = require("../../../infrastructure/repositories/ServiceExecutionRepository");
class GetExecutionsByPeriodUseCase {
    async execute(startDate, endDate) {
        return ServiceExecutionRepository_1.ServiceExecutionRepository.find({
            where: {
                startedAt: (0, typeorm_1.Between)(startDate, endDate),
                status: "CONCLUIDO"
            },
            relations: ["service", "serviceOrder", "serviceOrder.mechanic"]
        });
    }
}
exports.GetExecutionsByPeriodUseCase = GetExecutionsByPeriodUseCase;
