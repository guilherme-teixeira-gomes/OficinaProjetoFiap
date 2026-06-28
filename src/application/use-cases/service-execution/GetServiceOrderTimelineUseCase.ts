import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceExecution } from "../../../domain/entities/ServiceExecution";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";

export class GetServiceOrderTimelineUseCase {
  async execute(serviceOrderId: number) {
    const executionRepo = AppDataSource.getRepository(ServiceExecution);
    const orderRepo = AppDataSource.getRepository(ServiceOrder);

    const executions = await executionRepo.find({ where: { serviceOrderId }, relations: ["service"], order: { startedAt: "ASC" } });
    const order = await orderRepo.findOne({ where: { id: serviceOrderId } });

    return {
      serviceOrder: { id: order?.id, status: order?.status, startedAt: order?.startedAt, finishedAt: order?.finishedAt, totalDuration: order?.startedAt && order?.finishedAt ? Math.round((order.finishedAt.getTime() - order.startedAt.getTime()) / 60000) : null },
      services: executions.map(e => ({ serviceId: e.serviceId, serviceName: e.service?.name, status: e.status, startedAt: e.startedAt, finishedAt: e.finishedAt, durationMinutes: e.durationMinutes, mechanicNote: e.mechanicNote }))
    };
  }
}