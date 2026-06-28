import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";
import { User } from "../../../domain/entities/User";

export class AcceptOrderUseCase {
  async execute(orderId: number, mechanicId: number) {
    const userRepo = AppDataSource.getRepository(User);
    const orderRepo = AppDataSource.getRepository(ServiceOrder);

    const mechanic = await userRepo.findOne({ 
      where: { id: mechanicId, role: "mecanico" } 
    });
    
    if (!mechanic) throw new Error("Mecânico não encontrado ou não autorizado");

    const order = await orderRepo.findOne({ where: { id: orderId } });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.status !== "RECEBIDA") throw new Error("Ordem de serviço precisa estar com status RECEBIDA");
    if (order.mechanicId) throw new Error("Esta OS já foi aceita por outro mecânico");
    
    order.status = "EM_DIAGNOSTICO";
    order.mechanic = mechanic;
    order.mechanicId = mechanicId;
    order.startedAt = new Date();
    
    const savedOrder = await orderRepo.save(order);
    
    return await orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ["client", "vehicle", "services", "parts", "mechanic"]
    });
  }
}