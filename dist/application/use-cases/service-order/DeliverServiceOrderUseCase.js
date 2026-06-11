"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverServiceOrderUseCase = void 0;
const EmailService_1 = require("../../../infrastructure/email/EmailService");
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class DeliverServiceOrderUseCase {
    async execute(id) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id },
            relations: ["client"]
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (order.status !== "FINALIZADA") {
            throw new Error("Só é possível entregar OS finalizada");
        }
        order.status = "ENTREGUE";
        const saved = await ServiceOrderRepository_1.ServiceOrderRepository.save(order);
        if (saved.client?.email) {
            await (0, EmailService_1.sendStatusEmail)(saved.client.email, saved.id, saved.status);
        }
        return saved;
    }
}
exports.DeliverServiceOrderUseCase = DeliverServiceOrderUseCase;
