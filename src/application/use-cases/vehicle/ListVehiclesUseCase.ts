import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class ListVehiclesUseCase {
  async list() {
    const repo = AppDataSource.getRepository(Vehicle);
    return repo.find({ relations: ["client"] });
  }
}