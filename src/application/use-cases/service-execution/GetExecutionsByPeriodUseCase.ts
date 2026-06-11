
import { Between } from "typeorm";
import { ServiceExecutionRepository } from "../../../infrastructure/repositories/ServiceExecutionRepository";

export class GetExecutionsByPeriodUseCase {
  async execute(startDate: Date, endDate: Date) {
    return ServiceExecutionRepository.find({
      where: {
        startedAt: Between(startDate, endDate),
        status: "CONCLUIDO"
      },
      relations: ["service", "serviceOrder", "serviceOrder.mechanic"]
    });
  }
}