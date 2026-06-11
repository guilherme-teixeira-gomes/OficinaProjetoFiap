import { ServiceRepository } from "../../../infrastructure/repositories/ServiceRepository";


export class GetServiceByIdUseCase {

  async getById(id: number) {
    return ServiceRepository.findOne({ where: { id } });
  }

}