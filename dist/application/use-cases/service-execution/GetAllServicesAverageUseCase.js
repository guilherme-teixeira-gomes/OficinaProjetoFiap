"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllServicesAverageUseCase = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceExecution_1 = require("../../../domain/entities/ServiceExecution");
class GetAllServicesAverageUseCase {
    async execute() {
        const repo = data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
        const executions = await repo.find({ where: { status: "CONCLUIDO", durationMinutes: (0, typeorm_1.Not)(null) }, relations: ["service"] });
        const map = new Map();
        for (const exec of executions) {
            if (!map.has(exec.serviceId))
                map.set(exec.serviceId, { serviceId: exec.serviceId, serviceName: exec.service?.name, durations: [] });
            map.get(exec.serviceId).durations.push(exec.durationMinutes || 0);
        }
        const result = [];
        for (const [, data] of map) {
            const avg = data.durations.reduce((a, b) => a + b, 0) / data.durations.length;
            result.push({ serviceId: data.serviceId, serviceName: data.serviceName, averageMinutes: Number(avg.toFixed(2)), averageHours: (avg / 60).toFixed(2), totalExecutions: data.durations.length, minMinutes: Math.min(...data.durations), maxMinutes: Math.max(...data.durations) });
        }
        return result;
    }
}
exports.GetAllServicesAverageUseCase = GetAllServicesAverageUseCase;
