import { ServiceRepository } from "../../../infrastructure/repositories/ServiceRepository";
import { GetServiceByIdUseCase } from "./GetServiceByIdUseCase";

interface UpdateServiceDTO {
  name: string;
  description?: string;
  price: number;
  active?: boolean;
}

export class UpdateServiceUseCase {

  private getServiceByIdUseCase: GetServiceByIdUseCase;

  constructor() {
    this.getServiceByIdUseCase = new GetServiceByIdUseCase();
  }
  async update(id: number, data: Partial<UpdateServiceDTO>) {
    const service = await this.getServiceByIdUseCase.getById(id);
    if (!service) throw new Error("Serviço não encontrado");
    ServiceRepository.merge(service, data);
    return ServiceRepository.save(service);
  }


}