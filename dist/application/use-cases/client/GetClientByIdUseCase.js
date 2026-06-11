"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientByIdUseCase = void 0;
const ClientRepository_1 = require("../../../infrastructure/repositories/ClientRepository");
class GetClientByIdUseCase {
    async getById(id) {
        return ClientRepository_1.ClientRepository.findOne({ where: { id }, relations: ["vehicles", "orders"] });
    }
}
exports.GetClientByIdUseCase = GetClientByIdUseCase;
