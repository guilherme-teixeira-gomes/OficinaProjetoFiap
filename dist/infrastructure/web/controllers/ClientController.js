"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const CreateClientUseCase_1 = require("../../../application/use-cases/client/CreateClientUseCase");
const ListClientsUseCase_1 = require("../../../application/use-cases/client/ListClientsUseCase");
const GetClientByIdUseCase_1 = require("../../../application/use-cases/client/GetClientByIdUseCase");
const GetClientByDocumentUseCase_1 = require("../../../application/use-cases/client/GetClientByDocumentUseCase");
class ClientController {
    async handle(req, res) {
        try {
            const service = new CreateClientUseCase_1.CreateClientUseCase();
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
        const service = new ListClientsUseCase_1.ListClientsUseCase();
        const clients = await service.list();
        return res.json(clients);
    }
    async get(req, res) {
        const service = new GetClientByIdUseCase_1.GetClientByIdUseCase();
        const client = await service.getById(Number(req.params.id));
        if (!client)
            return res.status(404).json({ error: "Cliente não encontrado" });
        return res.json(client);
    }
    async getDocument(req, res) {
        const service = new GetClientByDocumentUseCase_1.GetClientByDocumentUseCase();
        const documentNumber = Array.isArray(req.params.document)
            ? req.params.document[0]
            : req.params.document;
        const client = await service.getByDocument(documentNumber);
        if (!client) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }
        return res.json(client);
    }
}
exports.ClientController = ClientController;
