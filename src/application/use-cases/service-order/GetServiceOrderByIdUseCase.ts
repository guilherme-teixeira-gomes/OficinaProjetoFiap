import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";


export class GetServiceOrderByIdUseCase {
  async execute(id: number) {
    const order = await ServiceOrderRepository.findOne({
      where: { id },
      relations: [
        "client",
        "vehicle",
        "services",
        "parts",
        "mechanic",
        "diagnostics",
        "diagnostics.recommendedServices",
        "diagnostics.recommendedParts",
        "executions",
        "executions.service"
      ]
    });
  
    if (!order) return null;
  
    return {
      ...order,
      services: order.services?.map(s => ({ ...s, price: Number(s.price) })),
      parts: order.parts?.map(p => ({ ...p, price: Number(p.price) })),
      executions: order.executions?.map(e => ({
        ...e,
        service: e.service,
        durationMinutes: e.durationMinutes
      }))
    };
  }
}