// services/ServiceService.ts
import { ServiceRepository } from "../repositories/ServiceRepository";

interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  active?: boolean;
}

export class ServiceService {
  async create(data: CreateServiceDTO) {
    const service = ServiceRepository.create(data);
    return ServiceRepository.save(service);
  }

  async list() {
    return ServiceRepository.find();
  }

  async getById(id: number) {
    return ServiceRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<CreateServiceDTO>) {
    const service = await this.getById(id);
    if (!service) throw new Error("Serviço não encontrado");
    ServiceRepository.merge(service, data);
    return ServiceRepository.save(service);
  }

  async delete(id: number) {
    const service = await this.getById(id);
    if (!service) throw new Error("Serviço não encontrado");
    return ServiceRepository.remove(service);
  }
}