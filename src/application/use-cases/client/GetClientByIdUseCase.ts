import { ClientRepository } from "../../../infrastructure/repositories/ClientRepository";


export class GetClientByIdUseCase {

  async getById(id: number) {
    return ClientRepository.findOne({ where: { id }, relations: ["vehicles", "orders"] });
  }

}