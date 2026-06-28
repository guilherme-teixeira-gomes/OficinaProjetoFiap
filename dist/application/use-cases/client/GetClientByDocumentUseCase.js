"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientByDocumentUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Client_1 = require("../../../domain/entities/Client");
class GetClientByDocumentUseCase {
    async getByDocument(document) {
        const repo = data_source_1.AppDataSource.getRepository(Client_1.Client);
        return repo.findOne({ where: { document }, relations: ["vehicles", "orders"] });
    }
}
exports.GetClientByDocumentUseCase = GetClientByDocumentUseCase;
