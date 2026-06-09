"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishDiagnosticUseCase = void 0;
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
const helpers_1 = require("../../../shared/helpers/helpers");
class FinishDiagnosticUseCase {
    async execute(orderId) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id: orderId },
            relations: [
                "diagnostics",
                "diagnostics.recommendedServices",
                "diagnostics.recommendedParts"
            ]
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (order.status !== "EM_DIAGNOSTICO") {
            throw new Error("Ordem de serviço não está em diagnóstico");
        }
        const budget = await (0, helpers_1.calculateBudgetFromDiagnostics)(order);
        order.status = "AGUARDANDO_APROVACAO";
        order.budget = budget;
        await ServiceOrderRepository_1.ServiceOrderRepository.save(order);
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
