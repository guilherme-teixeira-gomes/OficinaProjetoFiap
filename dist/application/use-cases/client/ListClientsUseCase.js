"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListClientsUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Client_1 = require("../../../domain/entities/Client");
class ListClientsUseCase {
    async list() {
        const repo = data_source_1.AppDataSource.getRepository(Client_1.Client);
        return repo.find({ relations: ["vehicles", "orders"] });
    }
}
exports.ListClientsUseCase = ListClientsUseCase;
