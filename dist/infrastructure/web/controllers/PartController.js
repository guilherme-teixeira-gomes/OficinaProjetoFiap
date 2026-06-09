"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartController = void 0;
const CreatePartUseCase_1 = require("../../../application/use-cases/part/CreatePartUseCase");
const ListPartsUseCase_1 = require("../../../application/use-cases/part/ListPartsUseCase");
const GetPartByIdUseCase_1 = require("../../../application/use-cases/part/GetPartByIdUseCase");
const UpdatePartUseCase_1 = require("../../../application/use-cases/part/UpdatePartUseCase");
const DeletePartUseCase_1 = require("../../../application/use-cases/part/DeletePartUseCase");
class PartController {
    async handle(req, res) {
        try {
            const service = new CreatePartUseCase_1.CreatePartUseCase();
            const part = await service.create(req.body);
            return res.status(201).json(part);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req, res) {
        const service = new ListPartsUseCase_1.ListPartsUseCase();
        const parts = await service.list();
        return res.json(parts);
    }
    async get(req, res) {
        const service = new GetPartByIdUseCase_1.GetPartByIdUseCase();
        const part = await service.getById(Number(req.params.id));
        if (!part)
            return res.status(404).json({ error: "Peça não encontrada" });
        return res.json(part);
    }
    async update(req, res) {
        try {
            const service = new UpdatePartUseCase_1.UpdatePartUseCase();
            const part = await service.update(Number(req.params.id), req.body);
            return res.json(part);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const service = new DeletePartUseCase_1.DeletePartUseCase();
            await service.delete(Number(req.params.id));
            return res.status(204).send();
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.PartController = PartController;
