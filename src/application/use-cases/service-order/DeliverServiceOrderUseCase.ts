import { sendStatusEmail } from "../../../infrastructure/email/EmailService";
import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";


export class DeliverServiceOrderUseCase {
  async execute(id: number) {
    const order = await ServiceOrderRepository.findOne({ 
      where: { id },
      relations: ["client"]
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.status !== "FINALIZADA") {
      throw new Error("Só é possível entregar OS finalizada");
    }
    
    order.status = "ENTREGUE";
    const saved = await ServiceOrderRepository.save(order);
    
    if (saved.client?.email) {
      await sendStatusEmail(saved.client.email, saved.id, saved.status);
    }
    
    return saved;
  }
}