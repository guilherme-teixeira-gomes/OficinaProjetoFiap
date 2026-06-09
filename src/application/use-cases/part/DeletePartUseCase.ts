import { PartRepository } from "../../../infrastructure/repositories/PartRepository";
import { GetPartByIdUseCase } from "./GetPartByIdUseCase";

export class DeletePartUseCase {
  private getPartByIdUseCase: GetPartByIdUseCase;

  constructor() {
    this.getPartByIdUseCase = new GetPartByIdUseCase();
  }

  async delete(id: number) {
    const part = await this.getPartByIdUseCase.getById(id);
    if (!part) throw new Error("Peça não encontrada");
    return PartRepository.remove(part);
  }
}