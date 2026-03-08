"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const ClientService_1 = require("../services/ClientService");
class ClientController {
    async handle(req, res) {
        try {
            const service = new ClientService_1.ClientService();
            const { name, document, email, phone } = req.body;
            const client = await service.execute({
                name,
                document,
                email,
                phone
            });
            return res.status(201).json(client);
        }
        catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
    async list(req, res) {
        const service = new ClientService_1.ClientService();
        const clients = await service.list();
        return res.json(clients);
    }
    async get(req, res) {
        const service = new ClientService_1.ClientService();
        const client = await service.getById(Number(req.params.id));
        if (!client)
            return res.status(404).json({ error: "Cliente não encontrado" });
        return res.json(client);
    }
    async getDocument(req, res) {
        const service = new ClientService_1.ClientService();
        const documentNumber = Number(req.params.document);
        const client = await service.getByDocument(documentNumber.toString()); // Converte para string
        if (!client)
            return res.status(404).json({ error: "Cliente não encontrado" });
        return res.json(client);
    }
}
exports.ClientController = ClientController;
