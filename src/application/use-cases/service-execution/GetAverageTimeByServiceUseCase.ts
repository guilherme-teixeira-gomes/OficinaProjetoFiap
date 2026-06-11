
import { Not } from "typeorm";
import { ServiceExecutionRepository } from "../../../infrastructure/repositories/ServiceExecutionRepository";

export class GetAverageTimeByServiceUseCase {
  async execute(serviceId: number) {
    const executions = await ServiceExecutionRepository.find({
      where: {
        serviceId,
        status: "CONCLUIDO",
        durationMinutes: Not(null)
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