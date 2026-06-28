import { AppDataSource } from "../../../infrastructure/database/data-source";
import { Client } from "../../../domain/entities/Client";

export class GetClientByDocumentUseCase {
  async getByDocument(document: string) {
    const repo = AppDataSource.getRepository(Client);
    return repo.findOne({ where: { document }, relations: ["vehicles", "orders"] });
  }
}