
import { ClientRepository } from "../repositories/ClientRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";

interface CreateVehicleDTO {
  plate: string;
  brand: string;
  model: string;
  year: number;
  clientDocument: string;
}

export class VehicleService {

  async execute(data: CreateVehicleDTO) {
    const client = await ClientRepository.findOne({ where: { document: data.clientDocument } });
    if (!client) throw new Error("Cliente não encontrado");

    const exists = await VehicleRepository.findOne({ where: { plate: data.plate } });
    if (exists) throw new Error("Veículo já cadastrado");

    const vehicle = VehicleRepository.create({ ...data, client });
    await VehicleRepository.save(vehicle);
    return vehicle;
  }

  async list() {
    return VehicleRepository.find({ relations: ["client"] });
  }

  async getById(id: number) {
    return VehicleRepository.findOne({ where: { id }, relations: ["client"] });
  }
}