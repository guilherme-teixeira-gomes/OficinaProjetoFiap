import { VehicleRepository } from "../../../infrastructure/repositories/VehicleRepository";

export class GetVehicleByIdUseCase {

  async getById(id: number) {
    return VehicleRepository.findOne({ where: { id }, relations: ["client"] });
  }
}