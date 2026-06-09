import { PartRepository } from "../../../infrastructure/repositories/PartRepository";
import { GetPartByIdUseCase } from "./GetPartByIdUseCase";

interface UpdatePartDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  minimumStock?: number;
}

export class UpdatePartUseCase {

  private getPartByIdUseCase: GetPartByIdUseCase;

  constructor() {
    this.getPartByIdUseCase = new GetPartByIdUseCase();
  }

  async update(id: number, data: Partial<UpdatePartDTO>) {
    const part = await this.getPartByIdUseCase.getById(id);

    if (!part) throw new Error("Peça não encontrada");

    PartRepository.merge(part, data);
    return PartRepository.save(part);
  }

}