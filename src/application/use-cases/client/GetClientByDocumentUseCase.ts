import { ClientRepository } from "../../../infrastructure/repositories/ClientRepository";

export class GetClientByDocumentUseCase {
 
  async getByDocument(document: string) {
    return ClientRepository.findOne({ where: { document }, relations: ["vehicles", "orders"] });
  }
}