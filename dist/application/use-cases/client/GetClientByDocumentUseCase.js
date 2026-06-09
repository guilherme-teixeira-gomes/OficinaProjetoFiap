"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientByDocumentUseCase = void 0;
const ClientRepository_1 = require("../../../infrastructure/repositories/ClientRepository");
class GetClientByDocumentUseCase {
    async getByDocument(document) {
        return ClientRepository_1.ClientRepository.findOne({ where: { document }, relations: ["vehicles", "orders"] });
    }
}
exports.GetClientByDocumentUseCase = GetClientByDocumentUseCase;
