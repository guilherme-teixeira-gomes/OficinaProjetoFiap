import { sendStatusEmail } from "../../../infrastructure/email/EmailService";
import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";


export class FinishServiceOrderUseCase {
  async execute(id: number) {
    const order = await ServiceOrderRepository.findOne({ 
      where: { id },
      relations: ["client"]
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (!order.approved) throw new Error("Não pode finalizar antes da aprovação");
    if (order.status !== "EM_EXECUCAO") {
      throw new Error("Ordem precisa estar em execução");
    }
    
    order.status = "FINALIZADA";
    order.finishedAt = new Date();
    const saved = await ServiceOrderRepository.save(order);
    
    if (saved.client?.email) {
      await sendStatusEmail(saved.client.email, saved.id, saved.status);
    }
    
    return saved;
  }
}