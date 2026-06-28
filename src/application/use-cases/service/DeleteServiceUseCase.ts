import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Service } from "../../../domain/entities/Service";

export class DeleteServiceUseCase {
  async delete(id: number) {
    const repo = AppDataSource.getRepository(Service);
    const service = await repo.findOne({ where: { id } });
    if (!service) throw new Error("Serviço não encontrado");
    return repo.remove(service);
  }
}