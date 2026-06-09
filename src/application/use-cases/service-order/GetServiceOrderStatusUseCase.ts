import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";


export class GetServiceOrderStatusUseCase {
  async execute(id: number) {
    const order = await ServiceOrderRepository.findOne({
      where: { id },
      // select: ["id", "status", "createdAt", "updatedAt"]
    });
    return order;
  }
}