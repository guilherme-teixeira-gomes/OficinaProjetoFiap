import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Part } from "../../../domain/entities/Part";

interface UpdatePartDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  minimumStock?: number;
}

export class UpdatePartUseCase {
  async update(id: number, data: Partial<UpdatePartDTO>) {
    const repo = AppDataSource.getRepository(Part);
    const part = await repo.findOne({ where: { id } });
    if (!part) throw new Error("Peça não encontrada");
    repo.merge(part, data);
    return repo.save(part);
  }
}