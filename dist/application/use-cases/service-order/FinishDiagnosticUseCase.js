"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishDiagnosticUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
const EmailService_1 = require("../../../infrastructure/email/EmailService");
const helpers_1 = require("../../../shared/helpers/helpers");
class FinishDiagnosticUseCase {
    async execute(orderId) {
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const order = await orderRepo.findOne({
            where: { id: orderId },
            relations: [
                "client",
                "diagnostics",
                "diagnostics.recommendedServices",
                "diagnostics.recommendedParts"
            ]
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (order.status !== "EM_DIAGNOSTICO")
            throw new Error("Ordem de serviço não está em diagnóstico");
        const budget = await (0, helpers_1.calculateBudgetFromDiagnostics)(order);
        order.status = "AGUARDANDO_APROVACAO";
        order.budget = budget;
        await orderRepo.save(order);
        if (order.client?.email) {
            const appUrl = process.env.APP_URL ?? "http://localhost:3000";
            const { subject, html } = (0, EmailService_1.emailOrcamentoDisponivel)(order.client.name, order.id, order.budget, appUrl);
            await (0, EmailService_1.sendEmail)({ to: order.client.email, subject, html }).catch((err) => {
                console.error("Falha ao enviar email de orçamento:", err.message);
            });
        }
        const budgetItems = order.diagnostics
            ?.filter(d => d.includeInBudget)
            .map(d => ({
            diagnosticId: d.id,
            title: d.title,
            description: d.description,
            priority: d.priority,
            mechanicNote: d.mechanicNote,
            services: d.recommendedServices,
            parts: d.recommendedParts,
            total: (0, helpers_1.calculateDiagnosticTotal)(d)
        })) || [];
        const optionalItems = order.diagnostics
            ?.filter(d => !d.includeInBudget)
            .map(d => ({
            diagnosticId: d.id,
            title: d.title,
            description: d.description,
            priority: d.priority,
            mechanicNote: d.mechanicNote,
            services: d.recommendedServices,
            parts: d.recommendedParts,
            total: (0, helpers_1.calculateDiagnosticTotal)(d)
        })) || [];
        return {
            orderId: order.id,
            status: order.status,
            budget: budget,
            observation: order.observation,
            items: budgetItems,
            optional: optionalItems,
            message: "Orçamento gerado. Aguardando aprovação do cliente."
        };
    }
}
exports.FinishDiagnosticUseCase = FinishDiagnosticUseCase;
