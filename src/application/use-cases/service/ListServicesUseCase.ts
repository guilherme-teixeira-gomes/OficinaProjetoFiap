import { ServiceRepository } from "../../../infrastructure/repositories/ServiceRepository";

export class ListServicesUseCase {
  async list() {
    return ServiceRepository.find();
  }

}