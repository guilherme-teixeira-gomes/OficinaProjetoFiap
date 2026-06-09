import { PartRepository } from "../../../infrastructure/repositories/PartRepository";

export class GetCriticalStockUseCase {
  async execute() {
    return PartRepository
      .createQueryBuilder("part")
      .where("part.stock <= part.minimumStock")
      .orderBy("part.stock", "ASC")
      .getMany();
  }
}