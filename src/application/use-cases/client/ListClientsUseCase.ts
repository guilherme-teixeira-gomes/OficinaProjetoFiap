import { ClientRepository } from "../../../infrastructure/repositories/ClientRepository";

export class ListClientsUseCase {

  async list() {
    return ClientRepository.find({ relations: ["vehicles", "orders"] });
  }

}