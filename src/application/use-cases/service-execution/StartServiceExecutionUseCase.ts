import { ServiceExecutionRepository } from "../../../infrastructure/repositories/ServiceExecutionRepository";

interface StartServiceDTO {
  serviceOrderId: number;
  serviceId: number;
}

export class StartServiceExecutionUseCase {
  async execute(data: StartServiceDTO) {
    let execution = await ServiceExecutionRepository.findOne({
      where: {
        serviceOrderId: data.serviceOrderId,
        serviceId: data.serviceId
      }
    });

    if (!execution) {
      execution = ServiceExecutionRepository.create({
        serviceOrderId: data.serviceOrderId,
        serviceId: data.serviceId,
        status: "EM_ANDAMENTO",
        startedAt: new Date()
      });
    } else {
      if (execution.status === "CONCLUIDO") {
        throw new Error("Este serviço já foi concluído");
      }
      execution.startedAt = new Date();
      execution.status = "EM_ANDAMENTO";
    }

    return await ServiceExecutionRepository.save(execution);
  }
}