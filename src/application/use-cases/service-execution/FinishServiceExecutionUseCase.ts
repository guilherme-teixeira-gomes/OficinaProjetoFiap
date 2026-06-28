import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceExecution } from "../../../domain/entities/ServiceExecution";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";

interface FinishServiceDTO {
  serviceOrderId: number;
  serviceId: number;
  mechanicNote?: string;
}

export class FinishServiceExecutionUseCase {
  async execute(data: FinishServiceDTO) {
    const executionRepo = AppDataSource.getRepository(ServiceExecution);
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const orderRepo = AppDataSource.getRepository(ServiceOrder);

    const execution = await executionRepo.findOne({
      where: { serviceOrderId: data.serviceOrderId, serviceId: data.serviceId },
      relations: ["service"]
    });
    if (!execution) throw new Error("Execução não encontrada");
    if (execution.status === "CONCLUIDO") throw new Error("Serviço já foi concluído");

    execution.finishedAt = new Date();
    execution.status = "CONCLUIDO";
    execution.mechanicNote = data.mechanicNote;
    if (execution.startedAt) {
      const durationMs = execution.finishedAt.getTime() - execution.startedAt.getTime();
      execution.durationMinutes = Math.round(durationMs / 60000);
    }
    await executionRepo.save(execution);

    const executions = await executionRepo.find({ where: { serviceOrderId: data.serviceOrderId } });
    const total = executions.length;
    const concluded = executions.filter(e => e.status === "CONCLUIDO").length;
    if (total > 0 && total === concluded) {
      const order = await orderRepo.findOne({ where: { id: data.serviceOrderId } });
      if (order && order.status === "EM_EXECUCAO") {
        order.status = "FINALIZADA";
        order.finishedAt = new Date();
        await orderRepo.save(order);
      }
    }
    return execution;
  }
}