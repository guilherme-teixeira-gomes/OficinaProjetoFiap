import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";


export class AcceptOrderUseCase {
  async execute(orderId: number, mechanicId: number) {
    const mechanic = await UserRepository.findOne({ 
      where: { 
        id: mechanicId,
        role: "mecanico" 
      } 
    });
    
    if (!mechanic) {
      throw new Error("Mecânico não encontrado ou não autorizado");
    }

    const order = await ServiceOrderRepository.findOne({ 
      where: { id: orderId }
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    
    if (order.status !== "RECEBIDA") {
      throw new Error("Ordem de serviço precisa estar com status RECEBIDA");
    }
    
    if (order.mechanicId) {
      throw new Error("Esta OS já foi aceita por outro mecânico");
    }
    
    order.status = "EM_DIAGNOSTICO";
    order.mechanic = mechanic;
    order.mechanicId = mechanicId;
    order.startedAt = new Date();
    
    const savedOrder = await ServiceOrderRepository.save(order);
    
    return await ServiceOrderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["client", "vehicle", "services", "parts", "mechanic"]
    });
  }
}