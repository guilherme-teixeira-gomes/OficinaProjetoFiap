import { PartRepository } from "../../../infrastructure/repositories/PartRepository";

export class ListPartsUseCase {

  async list() {
    return PartRepository.find();
  }
}