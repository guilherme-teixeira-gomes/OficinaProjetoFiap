import { GetExecutionsByPeriodUseCase } from "./GetExecutionsByPeriodUseCase";

export class GetProductivityReportUseCase {

  private executionsUseCase = new GetExecutionsByPeriodUseCase();

  async execute(startDate: Date, endDate: Date) {
    const executions = await this.executionsUseCase.execute(startDate, endDate);

    const map = new Map();

    for (const exec of executions) {
      const mechanicId = exec.serviceOrder?.mechanicId;
      if (!mechanicId) continue;

      if (!map.has(mechanicId)) {
        map.set(mechanicId, {
          mechanicId,
          totalServices: 0,
          totalDuration: 0,
          services: []
        });
      }

      const data = map.get(mechanicId);
      data.totalServices++;
      data.totalDuration += exec.durationMinutes || 0;
      data.services.push({
        serviceId: exec.serviceId,
        serviceName: exec.service?.name,
        duration: exec.durationMinutes
      });
    }

    const result = [];

    for (const [, data] of map) {
      result.push({
        mechanicId: data.mechanicId,
        totalServices: data.totalServices,
        totalHours: (data.totalDuration / 60).toFixed(2),
        averagePerService: (data.totalDuration / data.totalServices).toFixed(2),
        services: data.services
      });
    }

    return result;
  }
}