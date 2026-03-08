import { ClientRepository } from "../repositories/ClientRepository";
import { ServiceOrderRepository } from "../repositories/ServiceOrderRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { PartRepository } from "../repositories/PartRepository";

interface CreateServiceOrderDTO {
  clientDocument: string;
  vehicle: { plate: string; brand: string; model: string; year: number };
  services: number[];
  parts: number[];
}

export class ServiceOrderService {

  async execute(data: CreateServiceOrderDTO) {
    const client = await ClientRepository.findOne({ where: { document: data.clientDocument } });
    if (!client) throw new Error("Cliente não encontrado");

    let vehicle = await VehicleRepository.findOne({ where: { plate: data.vehicle.plate } });
    if (!vehicle) {
      vehicle = VehicleRepository.create({ ...data.vehicle, client });
      vehicle = await VehicleRepository.save(vehicle);
    }

    const services = await ServiceRepository.findByIds(data.services);
    const parts = await PartRepository.findByIds(data.parts);

    // CORREÇÃO: Usar "RECEBIDA" em maiúsculo para bater com o ENUM
    const order = ServiceOrderRepository.create({
      client,
      vehicle,
      services: services,
      parts: parts,
      status: "RECEBIDA"  // ← AGORA ESTÁ CORRETO!
    });

    return await ServiceOrderRepository.save(order);
  }

  async list() {
    return ServiceOrderRepository.find({ relations: ["client", "vehicle", "services", "parts"] });
  }

  async getById(id: number) {
    return ServiceOrderRepository.findOne({ where: { id }, relations: ["client", "vehicle", "services", "parts"] });
  }

  async updateStatus(id: number, status: string) {
    // Validar se o status existe no ENUM
    const validStatus = ["RECEBIDA", "EM_DIAGNOSTICO", "AGUARDANDO_APROVACAO", "EM_EXECUCAO", "FINALIZADA", "ENTREGUE"];
    
    if (!validStatus.includes(status)) {
      throw new Error(`Status inválido. Use um dos: ${validStatus.join(", ")}`);
    }

    const order = await ServiceOrderRepository.findOne({ where: { id } });
    if (!order) throw new Error("Ordem de serviço não encontrada");
    
    order.status = status;
    return ServiceOrderRepository.save(order);
  }
}