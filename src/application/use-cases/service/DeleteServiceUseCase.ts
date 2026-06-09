import { ServiceRepository } from "../../../infrastructure/repositories/ServiceRepository";
import { GetServiceByIdUseCase } from "./GetServiceByIdUseCase";


export class DeleteServiceUseCase {
  private getServiceByIdUseCase: GetServiceByIdUseCase;

  constructor() {
    this.getServiceByIdUseCase = new GetServiceByIdUseCase();
  }

  async delete(id: number) {
    const service = await this.getServiceByIdUseCase.getById(id);
    if (!service) throw new Error("Serviço não encontrado");
    return ServiceRepository.remove(service);
  }
}