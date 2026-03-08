"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const ClientRepository_1 = require("../repositories/ClientRepository");
class ClientService {
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
    async list() {
        return ClientRepository_1.ClientRepository.find({ relations: ["vehicles", "orders"] });
    }
    async getById(id) {
        return ClientRepository_1.ClientRepository.findOne({ where: { id }, relations: ["vehicles", "orders"] });
    }
    async getByDocument(document) {
        return ClientRepository_1.ClientRepository.findOne({ where: { document }, relations: ["vehicles", "orders"] });
    }
}
exports.ClientService = ClientService;
