"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Client_1 = require("../../../domain/entities/Client");
class CreateClientUseCase {
    async execute(data) {
        const repo = data_source_1.AppDataSource.getRepository(Client_1.Client);
        const exists = await repo.findOne({ where: { document: data.document } });
        if (exists)
            throw new Error("Cliente já cadastrado");
        const client = repo.create(data);
        await repo.save(client);
        return client;
    }
}
exports.CreateClientUseCase = CreateClientUseCase;
