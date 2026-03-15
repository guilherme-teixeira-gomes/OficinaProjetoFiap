
import { PartRepository } from "../repositories/PartRepository";

interface CreatePartDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  minimumStock?: number;
}

export class PartService {
  async create(data: CreatePartDTO) {
    const part = PartRepository.create(data);
    return PartRepository.save(part);
  }

  async list() {
    return PartRepository.find();
  }

  async getById(id: number) {
    return PartRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<CreatePartDTO>) {
    const part = await this.getById(id);
    if (!part) throw new Error("Peça não encontrada");
    PartRepository.merge(part, data);
    return PartRepository.save(part);
  }

  async delete(id: number) {
    const part = await this.getById(id);
    if (!part) throw new Error("Peça não encontrada");
    return PartRepository.remove(part);
  }
}