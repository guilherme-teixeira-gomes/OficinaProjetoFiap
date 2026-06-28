import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Vehicle } from "../../../domain/entities/Vehicle";
import { Client } from "../../../domain/entities/Client";

interface CreateVehicleDTO {
  plate: string;
  brand: string;
  model: string;
  year: number;
  clientDocument: string;
}

export class CreateVehicleUseCase {
  async execute(data: CreateVehicleDTO) {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const clientRepo = AppDataSource.getRepository(Client);

    const client = await clientRepo.findOne({ where: { document: data.clientDocument } });
    if (!client) throw new Error("Cliente não encontrado");

    const exists = await vehicleRepo.findOne({ where: { plate: data.plate } });
    if (exists) throw new Error("Veículo já cadastrado");

    const vehicle = vehicleRepo.create({ ...data, client });
    await vehicleRepo.save(vehicle);
    return vehicle;
  }
}