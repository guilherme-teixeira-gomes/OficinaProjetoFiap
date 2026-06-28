"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientByIdUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Client_1 = require("../../../domain/entities/Client");
class GetClientByIdUseCase {
    async getById(id) {
        const repo = data_source_1.AppDataSource.getRepository(Client_1.Client);
        return repo.findOne({ where: { id }, relations: ["vehicles", "orders"] });
    }
}
exports.GetClientByIdUseCase = GetClientByIdUseCase;
