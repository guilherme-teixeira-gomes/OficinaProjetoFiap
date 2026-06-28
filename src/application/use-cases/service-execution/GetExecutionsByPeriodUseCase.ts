import { Between } from "typeorm";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceExecution } from "../../../domain/entities/ServiceExecution";

export class GetExecutionsByPeriodUseCase {
  async execute(startDate: Date, endDate: Date) {
    const repo = AppDataSource.getRepository(ServiceExecution);
    return repo.find({ where: { startedAt: Between(startDate, endDate), status: "CONCLUIDO" }, relations: ["service", "serviceOrder", "serviceOrder.mechanic"] });
  }
}