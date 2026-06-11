import { VehicleRepository } from "../../../infrastructure/repositories/VehicleRepository";

export class ListVehiclesUseCase {
  async list() {
    return VehicleRepository.find({ relations: ["client"] });
  }
}