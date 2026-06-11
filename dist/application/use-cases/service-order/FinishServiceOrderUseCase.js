"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishServiceOrderUseCase = void 0;
const EmailService_1 = require("../../../infrastructure/email/EmailService");
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class FinishServiceOrderUseCase {
    async execute(id) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id },
            relations: ["client"]
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (!order.approved)
            throw new Error("Não pode finalizar antes da aprovação");
        if (order.status !== "EM_EXECUCAO") {
            throw new Error("Ordem precisa estar em execução");
        }
        order.status = "FINALIZADA";
        order.finishedAt = new Date();
        const saved = await ServiceOrderRepository_1.ServiceOrderRepository.save(order);
        if (saved.client?.email) {
            await (0, EmailService_1.sendStatusEmail)(saved.client.email, saved.id, saved.status);
        }
        return saved;
    }
}
exports.FinishServiceOrderUseCase = FinishServiceOrderUseCase;
