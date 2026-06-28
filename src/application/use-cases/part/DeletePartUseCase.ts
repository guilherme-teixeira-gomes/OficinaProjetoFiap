import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

export class DeletePartUseCase {
  async delete(id: number) {
    const repo = AppDataSource.getRepository(Part);
    const part = await repo.findOne({ where: { id } });
    if (!part) throw new Error("Peça não encontrada");
    return repo.remove(part);
  }
}