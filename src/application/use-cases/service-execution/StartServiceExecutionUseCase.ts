import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceExecution } from "../../../domain/entities/ServiceExecution";

interface StartServiceDTO {
  serviceOrderId: number;
  serviceId: number;
}

export class StartServiceExecutionUseCase {
  async execute(data: StartServiceDTO) {
    const repo = AppDataSource.getRepository(ServiceExecution);

    let execution = await repo.findOne({ where: { serviceOrderId: data.serviceOrderId, serviceId: data.serviceId } });
    if (!execution) {
      execution = repo.create({ serviceOrderId: data.serviceOrderId, serviceId: data.serviceId, status: "EM_ANDAMENTO", startedAt: new Date() });
    } else {
      if (execution.status === "CONCLUIDO") throw new Error("Este serviço já foi concluído");
      execution.startedAt = new Date();
      execution.status = "EM_ANDAMENTO";
    }
    return await repo.save(execution);
  }
}