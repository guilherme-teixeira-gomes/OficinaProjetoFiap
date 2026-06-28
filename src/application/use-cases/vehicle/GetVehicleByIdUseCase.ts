import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class GetVehicleByIdUseCase {
  async getById(id: number) {
    const repo = AppDataSource.getRepository(Vehicle);
    return repo.findOne({ where: { id }, relations: ["client"] });
  }
}