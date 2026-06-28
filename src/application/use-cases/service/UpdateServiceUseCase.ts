import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Service } from "../../../domain/entities/Service";

interface UpdateServiceDTO {
  name?: string;
  description?: string;
  price?: number;
  active?: boolean;
}

export class UpdateServiceUseCase {
  async update(id: number, data: Partial<UpdateServiceDTO>) {
    const repo = AppDataSource.getRepository(Service);
    const service = await repo.findOne({ where: { id } });
    if (!service) throw new Error("Serviço não encontrado");
    repo.merge(service, data);
    return repo.save(service);
  }
}