import { ServiceExecutionRepository } from "../../../infrastructure/repositories/ServiceExecutionRepository";
import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";

interface FinishServiceDTO {
  serviceOrderId: number;
  serviceId: number;
  mechanicNote?: string;
}

export class FinishServiceExecutionUseCase {
  async execute(data: FinishServiceDTO) {
    const execution = await ServiceExecutionRepository.findOne({
      where: {
        serviceOrderId: data.serviceOrderId,
        serviceId: data.serviceId
      },
      relations: ["service"]
    });

    if (!execution) {
      throw new Error("Execução não encontrada");
    }

    if (execution.status === "CONCLUIDO") {
      throw new Error("Serviço já foi concluído");
    }

    execution.finishedAt = new Date();
    execution.status = "CONCLUIDO";
    execution.mechanicNote = data.mechanicNote;

    if (execution.startedAt) {
      const durationMs = execution.finishedAt.getTime() - execution.startedAt.getTime();
      execution.durationMinutes = Math.round(durationMs / 60000);
    }

    await ServiceExecutionRepository.save(execution);
    
    // Verifica se todos os serviços da OS foram concluídos
    await this.checkAndFinishOrder(data.serviceOrderId);

    return execution;
  }

  private async checkAndFinishOrder(serviceOrderId: number) {
    const executions = await ServiceExecutionRepository.find({
      where: { serviceOrderId }
    });

    const total = executions.length;
    const concluded = executions.filter(e => e.status === "CONCLUIDO").length;

    if (total > 0 && total === concluded) {
      const order = await ServiceOrderRepository.findOne({
        where: { id: serviceOrderId }
      });

      if (order && order.status === "EM_EXECUCAO") {
        order.status = "FINALIZADA";
        order.finishedAt = new Date();
        await ServiceOrderRepository.save(order);
      }
    }
  }
}