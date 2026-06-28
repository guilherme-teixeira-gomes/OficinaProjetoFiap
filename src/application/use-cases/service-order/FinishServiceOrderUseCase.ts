import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";
import { sendEmail, emailStatusAtualizado } from "../../../infrastructure/email/EmailService";

export class FinishServiceOrderUseCase {
  async execute(id: number) {
    const orderRepo = AppDataSource.getRepository(ServiceOrder);

    const order = await orderRepo.findOne({ 
      where: { id },
      relations: ["client"]
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (!order.approved) throw new Error("Não pode finalizar antes da aprovação");
    if (order.status !== "EM_EXECUCAO") throw new Error("Ordem precisa estar em execução");
    
    order.status = "FINALIZADA";
    order.finishedAt = new Date();
    const saved = await orderRepo.save(order);
    
    if (saved.client?.email) {
      const { subject, html } = emailStatusAtualizado(saved.client.name, saved.id, saved.status);
      await sendEmail({ to: saved.client.email, subject, html }).catch(err => 
        console.error("Falha ao enviar email:", err.message)
      );
    }
    
    return saved;
  }
}