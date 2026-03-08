"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const ServiceService_1 = require("../services/ServiceService");
class ServiceController {
    async handle(req, res) {
        try {
            const service = new ServiceService_1.ServiceService();
            const newService = await service.create(req.body);
            return res.status(201).json(newService);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req, res) {
        const service = new ServiceService_1.ServiceService();
        const services = await service.list();
        return res.json(services);
    }
    async get(req, res) {
        const service = new ServiceService_1.ServiceService();
        const s = await service.getById(Number(req.params.id));
        if (!s)
            return res.status(404).json({ error: "Serviço não encontrado" });
        return res.json(s);
    }
    async update(req, res) {
        try {
            const service = new ServiceService_1.ServiceService();
            const s = await service.update(Number(req.params.id), req.body);
            return res.json(s);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const service = new ServiceService_1.ServiceService();
            await service.delete(Number(req.params.id));
            return res.status(204).send();
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.ServiceController = ServiceController;
