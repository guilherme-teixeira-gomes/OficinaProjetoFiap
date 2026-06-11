import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Client } from "../../../domain/entities/Client";

export class DeleteClientUseCase {
  async execute(id: number) {
    const repo = AppDataSource.getRepository(Client);

    const client = await repo.findOne({ where: { id } });
    if (!client) throw new Error("Cliente não encontrado");

    // Soft delete — preserva o histórico de OS vinculadas
    await repo.softDelete(id);
    return { message: "Cliente removido com sucesso" };
  }
}