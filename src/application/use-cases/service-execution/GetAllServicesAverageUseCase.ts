import { Not } from "typeorm";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceExecution } from "../../../domain/entities/ServiceExecution";

export class GetAllServicesAverageUseCase {
  async execute() {
    const repo = AppDataSource.getRepository(ServiceExecution);
    const executions = await repo.find({ where: { status: "CONCLUIDO", durationMinutes: Not(null) }, relations: ["service"] });

    const map = new Map();
    for (const exec of executions) {
      if (!map.has(exec.serviceId)) map.set(exec.serviceId, { serviceId: exec.serviceId, serviceName: exec.service?.name, durations: [] });
      map.get(exec.serviceId).durations.push(exec.durationMinutes || 0);
    }

    const result = [];
    for (const [, data] of map) {
      const avg = data.durations.reduce((a: number, b: number) => a + b, 0) / data.durations.length;
      result.push({ serviceId: data.serviceId, serviceName: data.serviceName, averageMinutes: Number(avg.toFixed(2)), averageHours: (avg / 60).toFixed(2), totalExecutions: data.durations.length, minMinutes: Math.min(...data.durations), maxMinutes: Math.max(...data.durations) });
    }
    return result;
  }
}