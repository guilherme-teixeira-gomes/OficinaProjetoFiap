"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExecutionsByPeriodUseCase = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceExecution_1 = require("../../../domain/entities/ServiceExecution");
class GetExecutionsByPeriodUseCase {
    async execute(startDate, endDate) {
        const repo = data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
        return repo.find({ where: { startedAt: (0, typeorm_1.Between)(startDate, endDate), status: "CONCLUIDO" }, relations: ["service", "serviceOrder", "serviceOrder.mechanic"] });
    }
}
exports.GetExecutionsByPeriodUseCase = GetExecutionsByPeriodUseCase;
