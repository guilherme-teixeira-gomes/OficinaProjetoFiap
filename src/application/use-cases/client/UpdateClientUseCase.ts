import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Client } from "../../../domain/entities/Client";

export class UpdateClientUseCase {
  async execute(id: number, data: Partial<Pick<Client, "name" | "email" | "phone">>) {
    const repo = AppDataSource.getRepository(Client);

    const client = await repo.findOne({ where: { id } });
    if (!client) throw new Error("Cliente não encontrado");

    Object.assign(client, data);
    return repo.save(client);
  }
}