import { Not } from "typeorm";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceExecution } from "../../../domain/entities/ServiceExecution";

export class GetAverageTimeByServiceUseCase {
  async execute(serviceId: number) {
    const repo = AppDataSource.getRepository(ServiceExecution);
    const executions = await repo.find({ where: { serviceId, status: "CONCLUIDO", durationMinutes: Not(null) } });
    if (!executions.length) return { serviceId, averageMinutes: 0, averageHours: "0", totalExecutions: 0, minMinutes: 0, maxMinutes: 0 };

    const durations = executions.map(e => e.durationMinutes || 0);
    const avg = durations.reduce((s, d) => s + d, 0) / executions.length;
    return { serviceId, averageMinutes: Number(avg.toFixed(2)), averageHours: (avg / 60).toFixed(2), totalExecutions: executions.length, minMinutes: Math.min(...durations), maxMinutes: Math.max(...durations) };
  }
}