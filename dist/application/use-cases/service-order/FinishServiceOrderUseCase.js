"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishServiceOrderUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
const EmailService_1 = require("../../../infrastructure/email/EmailService");
class FinishServiceOrderUseCase {
    async execute(id) {
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const order = await orderRepo.findOne({
            where: { id },
            relations: ["client"]
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (!order.approved)
            throw new Error("Não pode finalizar antes da aprovação");
        if (order.status !== "EM_EXECUCAO")
            throw new Error("Ordem precisa estar em execução");
        order.status = "FINALIZADA";
        order.finishedAt = new Date();
        const saved = await orderRepo.save(order);
        if (saved.client?.email) {
            const { subject, html } = (0, EmailService_1.emailStatusAtualizado)(saved.client.name, saved.id, saved.status);
            await (0, EmailService_1.sendEmail)({ to: saved.client.email, subject, html }).catch(err => console.error("Falha ao enviar email:", err.message));
        }
        return saved;
    }
}
exports.FinishServiceOrderUseCase = FinishServiceOrderUseCase;
