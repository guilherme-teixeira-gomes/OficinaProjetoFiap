import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";


export class UpdateServiceOrderStatusUseCase {
  async execute(id: number, status: string) {
    const validStatus = [
      "RECEBIDA", "EM_DIAGNOSTICO", "AGUARDANDO_APROVACAO",
      "EM_EXECUCAO", "FINALIZADA", "ENTREGUE"
    ];
    
    if (!validStatus.includes(status)) {
      throw new Error(`Status inválido. Use: ${validStatus.join(", ")}`);
    }
    
    const order = await ServiceOrderRepository.findOne({ where: { id } });
    if (!order) throw new Error("Ordem de serviço não encontrada");
    
    order.status = status;
    return ServiceOrderRepository.save(order);
  }
}