"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAverageTimeByServiceUseCase = void 0;
const typeorm_1 = require("typeorm");
const ServiceExecutionRepository_1 = require("../../../infrastructure/repositories/ServiceExecutionRepository");
class GetAverageTimeByServiceUseCase {
    async execute(serviceId) {
        const executions = await ServiceExecutionRepository_1.ServiceExecutionRepository.find({
            where: {
                serviceId,
                status: "CONCLUIDO",
                durationMinutes: (0, typeorm_1.Not)(null)
            }
        });
        if (!executions.length) {
            return {
                serviceId,
                averageMinutes: 0,
                averageHours: "0",
                totalExecutions: 0,
                minMinutes: 0,
                maxMinutes: 0
            };
        }
        const durations = executions.map(e => e.durationMinutes || 0);
        const total = durations.reduce((sum, d) => sum + d, 0);
        const avg = total / executions.length;
        return {
            serviceId,
            averageMinutes: Number(avg.toFixed(2)),
            averageHours: (avg / 60).toFixed(2),
            totalExecutions: executions.length,
            minMinutes: Math.min(...durations),
            maxMinutes: Math.max(...durations)
        };
    }
}
exports.GetAverageTimeByServiceUseCase = GetAverageTimeByServiceUseCase;
