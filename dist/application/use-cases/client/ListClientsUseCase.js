"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListClientsUseCase = void 0;
const ClientRepository_1 = require("../../../infrastructure/repositories/ClientRepository");
class ListClientsUseCase {
    async list() {
        return ClientRepository_1.ClientRepository.find({ relations: ["vehicles", "orders"] });
    }
}
exports.ListClientsUseCase = ListClientsUseCase;
