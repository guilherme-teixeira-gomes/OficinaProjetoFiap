import { LessThan } from "typeorm";
import { PartRepository } from "../../../infrastructure/repositories/PartRepository";

export class GetLowStockUseCase {
  async execute() {
    return PartRepository.find({
      where: { stock: LessThan(5) },
      order: { stock: "ASC" }
    });
  }
}