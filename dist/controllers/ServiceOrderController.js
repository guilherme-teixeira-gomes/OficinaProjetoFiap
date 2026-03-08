"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderController = void 0;
const ServiceOrderService_1 = require("../services/ServiceOrderService");
class ServiceOrderController {
    async handle(req, res) {
        try {
            const service = new ServiceOrderService_1.ServiceOrderService();
            const { clientDocument, vehicle, services, parts } = req.body;
            const order = await service.execute({ clientDocument, vehicle, services, parts });
            return res.status(201).json(order);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req, res) {
        const service = new ServiceOrderService_1.ServiceOrderService();
        const orders = await service.list();
        return res.json(orders);
    }
    async get(req, res) {
        const service = new ServiceOrderService_1.ServiceOrderService();
        const order = await service.getById(Number(req.params.id));
        if (!order)
            return res.status(404).json({ error: "Ordem de serviço não encontrada" });
        return res.json(order);
    }
    async updateStatus(req, res) {
        try {
            const service = new ServiceOrderService_1.ServiceOrderService();
            const updated = await service.updateStatus(Number(req.params.id), req.body.status);
            return res.json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.ServiceOrderController = ServiceOrderController;
