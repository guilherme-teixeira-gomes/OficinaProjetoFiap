import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Client } from "../../../domain/entities/Client";

interface CreateClientDTO {
  name: string;
  document: string;
  email: string;
  phone: string;
}

export class CreateClientUseCase {
  async execute(data: CreateClientDTO) {
    const repo = AppDataSource.getRepository(Client);

    const exists = await repo.findOne({ where: { document: data.document } });
    if (exists) throw new Error("Cliente já cadastrado");

    const client = repo.create(data);
    await repo.save(client);
    return client;
  }
}