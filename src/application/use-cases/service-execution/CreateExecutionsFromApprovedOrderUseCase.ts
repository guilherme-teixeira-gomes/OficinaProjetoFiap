import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";
import { ServiceExecutionRepository } from "../../../infrastructure/repositories/ServiceExecutionRepository";

export class CreateExecutionsFromApprovedOrderUseCase {
  async execute(serviceOrderId: number) {
    const order = await ServiceOrderRepository.findOne({
      where: { id: serviceOrderId },
      relations: ["services"]
    });

    if (!order) throw new Error("Ordem não encontrada");

    const createdExecutions = [];

    for (const service of order.services) {
      const exists = await ServiceExecutionRepository.findOne({
        where: {
          serviceOrderId: order.id,
          serviceId: service.id
        }
      });

      if (!exists) {
        const execution = await ServiceExecutionRepository.save({
          serviceOrderId: order.id,
          serviceId: service.id,
          status: "PENDENTE"
        });
        createdExecutions.push(execution);
      }
    }

    return createdExecutions;
  }
}