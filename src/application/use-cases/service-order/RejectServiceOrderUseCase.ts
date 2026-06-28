import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";
import { sendEmail, emailStatusAtualizado } from "../../../infrastructure/email/EmailService";

export class RejectOrderUseCase {
  async execute(id: number) {
    const orderRepo = AppDataSource.getRepository(ServiceOrder);

    const order = await orderRepo.findOne({ where: { id }, relations: ["client"] });
    if (!order) throw new Error("OS não encontrada");
    if (order.status !== "AGUARDANDO_APROVACAO") throw new Error("OS não está aguardando aprovação");

    order.status = "CANCELADA";
    order.observation = "Orçamento recusado pelo cliente";
    const saved = await orderRepo.save(order);

    if (saved.client?.email) {
      const { subject, html } = emailStatusAtualizado(saved.client.name, saved.id, saved.status);
      await sendEmail({ to: saved.client.email, subject, html }).catch(err =>
        console.error("Falha ao enviar email:", err.message)
      );
    }

    return { message: "Orçamento recusado", order: saved };
  }
}