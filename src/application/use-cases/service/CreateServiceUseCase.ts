import { ServiceRepository } from "../../../infrastructure/repositories/ServiceRepository";


interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  active?: boolean;
}

export class CreateServiceUseCase {
  async create(data: CreateServiceDTO) {
    const service = ServiceRepository.create(data);
    return ServiceRepository.save(service);
  }

}