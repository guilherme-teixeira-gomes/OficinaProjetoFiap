import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";

export class GetServiceOrderStatusUseCase {
  async execute(id: number) {
    const orderRepo = AppDataSource.getRepository(ServiceOrder);
    return await orderRepo.findOne({ where: { id } });
  }
}