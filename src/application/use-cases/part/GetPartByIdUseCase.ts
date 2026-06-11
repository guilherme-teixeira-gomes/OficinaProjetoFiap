import { PartRepository } from "../../../infrastructure/repositories/PartRepository";

export class GetPartByIdUseCase {

  async getById(id: number) {
    return PartRepository.findOne({ where: { id } });
  }

}