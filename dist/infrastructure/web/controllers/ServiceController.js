"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const CreateServiceUseCase_1 = require("../../../application/use-cases/service/CreateServiceUseCase");
const ListServicesUseCase_1 = require("../../../application/use-cases/service/ListServicesUseCase");
const GetServiceByIdUseCase_1 = require("../../../application/use-cases/service/GetServiceByIdUseCase");
const UpdateServiceUseCase_1 = require("../../../application/use-cases/service/UpdateServiceUseCase");
const DeleteServiceUseCase_1 = require("../../../application/use-cases/service/DeleteServiceUseCase");
class ServiceController {
    async handle(req, res) {
        try {
            const service = new CreateServiceUseCase_1.CreateServiceUseCase();
            const newService = await service.create(req.body);
            return res.status(201).json(newService);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req, res) {
        const service = new ListServicesUseCase_1.ListServicesUseCase();
        const services = await service.list();
        return res.json(services);
    }
    async get(req, res) {
        const service = new GetServiceByIdUseCase_1.GetServiceByIdUseCase();
        const s = await service.getById(Number(req.params.id));
        if (!s)
            return res.status(404).json({ error: "Serviço não encontrado" });
        return res.json(s);
    }
    async update(req, res) {
        try {
            const service = new UpdateServiceUseCase_1.UpdateServiceUseCase();
            const s = await service.update(Number(req.params.id), req.body);
            return res.json(s);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const service = new DeleteServiceUseCase_1.DeleteServiceUseCase();
            await service.delete(Number(req.params.id));
            return res.status(204).send();
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.ServiceController = ServiceController;
