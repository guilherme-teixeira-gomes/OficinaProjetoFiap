import { AppDataSource } from "../../../infrastructure/database/data-source";
import { StockMovement } from "../../../domain/entities/StockMovement";

interface Filters {
  partId?: number;
  serviceOrderId?: number;
  startDate?: Date;
  endDate?: Date;
  type?: "IN" | "OUT";
}

export class GetStockMovementsUseCase {
  async execute(filters?: Filters) {
    const repo = AppDataSource.getRepository(StockMovement);
    const query = repo.createQueryBuilder("movement").leftJoinAndSelect("movement.part", "part").leftJoinAndSelect("movement.serviceOrder", "serviceOrder").orderBy("movement.createdAt", "DESC");

    if (filters?.partId) query.andWhere("movement.partId = :partId", { partId: filters.partId });
    if (filters?.serviceOrderId) query.andWhere("movement.serviceOrderId = :serviceOrderId", { serviceOrderId: filters.serviceOrderId });
    if (filters?.startDate) query.andWhere("movement.createdAt >= :startDate", { startDate: filters.startDate });
    if (filters?.endDate) query.andWhere("movement.createdAt <= :endDate", { endDate: filters.endDate });
    if (filters?.type) query.andWhere("movement.type = :type", { type: filters.type });

    return query.getMany();
  }
}