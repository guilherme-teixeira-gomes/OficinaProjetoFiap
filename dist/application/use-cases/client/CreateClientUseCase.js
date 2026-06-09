"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientUseCase = void 0;
const ClientRepository_1 = require("../../../infrastructure/repositories/ClientRepository");
class CreateClientUseCase {
    async execute(data) {
        const exists = await ClientRepository_1.ClientRepository.findOne({
            where: { document: data.document }
        });
        if (exists) {
            throw new Error("Cliente já cadastrado");
        }
        const client = ClientRepository_1.ClientRepository.create(data);
        await ClientRepository_1.ClientRepository.save(client);
        return client;
    }
}
exports.CreateClientUseCase = CreateClientUseCase;
