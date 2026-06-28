import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";

export class UpdateServiceOrderStatusUseCase {
  async execute(id: number, status: string) {
    const validStatus = [
      "RECEBIDA", "EM_DIAGNOSTICO", "AGUARDANDO_APROVACAO",
      "EM_EXECUCAO", "FINALIZADA", "ENTREGUE"
    ];

    if (!validStatus.includes(status)) {
      throw new Error(`Status inválido. Use: ${validStatus.join(", ")}`);
    }

    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const orderRepo = AppDataSource.getRepository(ServiceOrder);
    const order = await orderRepo.findOne({ where: { id } });
    if (!order) throw new Error("Ordem de serviço não encontrada");

    order.status = status;
    return orderRepo.save(order);
  }
}