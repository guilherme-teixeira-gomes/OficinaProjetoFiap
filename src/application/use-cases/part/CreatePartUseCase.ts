import { PartRepository } from "../../../infrastructure/repositories/PartRepository";


interface CreatePartDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  minimumStock?: number;
}

export class CreatePartUseCase {
  async create(data: CreatePartDTO) {
    const part = PartRepository.create(data);
    return PartRepository.save(part);
  }
}