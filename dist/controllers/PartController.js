"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartController = void 0;
const PartService_1 = require("../services/PartService");
class PartController {
    async handle(req, res) {
        try {
            const service = new PartService_1.PartService();
            const part = await service.create(req.body);
            return res.status(201).json(part);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req, res) {
        const service = new PartService_1.PartService();
        const parts = await service.list();
        return res.json(parts);
    }
    async get(req, res) {
        const service = new PartService_1.PartService();
        const part = await service.getById(Number(req.params.id));
        if (!part)
            return res.status(404).json({ error: "Peça não encontrada" });
        return res.json(part);
    }
    async update(req, res) {
        try {
            const service = new PartService_1.PartService();
            const part = await service.update(Number(req.params.id), req.body);
            return res.json(part);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const service = new PartService_1.PartService();
            await service.delete(Number(req.params.id));
            return res.status(204).send();
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.PartController = PartController;
