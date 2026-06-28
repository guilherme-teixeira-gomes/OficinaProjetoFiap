import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";
import { ServiceExecution } from "../../../domain/entities/ServiceExecution";

export class CreateExecutionsFromApprovedOrderUseCase {
  async execute(serviceOrderId: number) {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const orderRepo = AppDataSource.getRepository(ServiceOrder);
    const executionRepo = AppDataSource.getRepository(ServiceExecution);

    const order = await orderRepo.findOne({ where: { id: serviceOrderId }, relations: ["services"] });
    if (!order) throw new Error("Ordem não encontrada");

    const createdExecutions = [];
    for (const service of order.services) {
      const exists = await executionRepo.findOne({ where: { serviceOrderId: order.id, serviceId: service.id } });
      if (!exists) {
        const execution = await executionRepo.save({ serviceOrderId: order.id, serviceId: service.id, status: "PENDENTE" });
        createdExecutions.push(execution);
      }
    }
    return createdExecutions;
  }
}