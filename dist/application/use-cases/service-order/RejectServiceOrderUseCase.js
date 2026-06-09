"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectOrderUseCase = void 0;
const EmailService_1 = require("../../../infrastructure/email/EmailService");
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class RejectOrderUseCase {
    async execute(id) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id },
            relations: ["client"]
        });
        if (!order)
            throw new Error("OS não encontrada");
        if (order.status !== "AGUARDANDO_APROVACAO") {
            throw new Error("OS não está aguardando aprovação");
        }
        order.status = "CANCELADA";
        order.observation = "Orçamento recusado pelo cliente";
        const saved = await ServiceOrderRepository_1.ServiceOrderRepository.save(order);
        if (saved.client?.email) {
            await (0, EmailService_1.sendStatusEmail)(saved.client.email, saved.id, saved.status);
        }
        return { message: "Orçamento recusado", order: saved };
    }
}
exports.RejectOrderUseCase = RejectOrderUseCase;
