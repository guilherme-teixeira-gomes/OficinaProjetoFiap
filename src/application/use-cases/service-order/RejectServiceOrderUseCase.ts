import { sendStatusEmail } from "../../../infrastructure/email/EmailService";
import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";


export class RejectOrderUseCase {
  async execute(id: number) {
    const order = await ServiceOrderRepository.findOne({
      where: { id },
      relations: ["client"]
    });
    
    if (!order) throw new Error("OS não encontrada");
    if (order.status !== "AGUARDANDO_APROVACAO") {
      throw new Error("OS não está aguardando aprovação");
    }
    
    order.status = "CANCELADA";
    order.observation = "Orçamento recusado pelo cliente";
    const saved = await ServiceOrderRepository.save(order);
    
    if (saved.client?.email) {
      await sendStatusEmail(saved.client.email, saved.id, saved.status);
    }
    
    return { message: "Orçamento recusado", order: saved };
  }
}