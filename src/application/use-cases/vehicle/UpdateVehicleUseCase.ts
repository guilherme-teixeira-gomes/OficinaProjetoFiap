import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Vehicle } from "../../../domain/entities/Vehicle";
import { validatePlate } from "../../../shared/helpers/helpers";

export class UpdateVehicleUseCase {
  async execute(id: number, data: Partial<Pick<Vehicle, "plate" | "brand" | "model" | "year">>) {
    const repo = AppDataSource.getRepository(Vehicle);

    const vehicle = await repo.findOne({ where: { id } });
    if (!vehicle) throw new Error("Veículo não encontrado");

    if (data.plate) {
      data.plate = validatePlate(data.plate);

      const existing = await repo.findOne({ where: { plate: data.plate } });
      if (existing && existing.id !== id) {
        throw new Error("Placa já cadastrada para outro veículo");
      }
    }

    Object.assign(vehicle, data);
    return repo.save(vehicle);
  }
}