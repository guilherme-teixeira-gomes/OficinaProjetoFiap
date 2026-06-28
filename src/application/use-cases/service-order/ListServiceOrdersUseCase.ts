import { Not, In } from "typeorm";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";

export class ListServiceOrdersUseCase {
  async execute(excludeFinished: boolean = true) {
    const orderRepo = AppDataSource.getRepository(ServiceOrder);

    let where: any = {};
    if (excludeFinished) {
      where.status = Not(In(["FINALIZADA", "ENTREGUE"]));
    }
    
    const orders = await orderRepo.find({
      where,
      relations: [
        "client", "vehicle", "services", "parts", "mechanic",
        "diagnostics", "diagnostics.recommendedServices", "diagnostics.recommendedParts"
      ],
      order: { createdAt: "ASC" }
    });
  
    const statusOrder: Record<string, number> = {
      "EM_EXECUCAO": 1,
      "AGUARDANDO_APROVACAO": 2,
      "EM_DIAGNOSTICO": 3,
      "RECEBIDA": 4
    };
    
    orders.sort((a, b) => {
      const orderA = statusOrder[a.status] || 99;
      const orderB = statusOrder[b.status] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return (a.createdAt ? new Date(a.createdAt).getTime() : 0) - 
       (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    });
  
    return orders.map(order => ({
      ...order,
      services: order.services?.map(s => ({ ...s, price: Number(s.price) })),
      parts: order.parts?.map(p => ({ ...p, price: Number(p.price) }))
    }));
  }
}