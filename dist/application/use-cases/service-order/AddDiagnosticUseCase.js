"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDiagnosticUseCase = void 0;
const DiagnosticRepository_1 = require("../../../infrastructure/repositories/DiagnosticRepository");
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
const ServiceRepository_1 = require("../../../infrastructure/repositories/ServiceRepository");
class AddDiagnosticUseCase {
    async execute(orderId, diagnosticData) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id: orderId },
            relations: ["diagnostics"]
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (order.status !== "EM_DIAGNOSTICO") {
            throw new Error("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
        }
        const recommendedServices = diagnosticData.serviceIds?.length
            ? await ServiceRepository_1.ServiceRepository.findByIds(diagnosticData.serviceIds)
            : [];
        const recommendedParts = diagnosticData.partIds?.length
            ? await PartRepository_1.PartRepository.findByIds(diagnosticData.partIds)
            : [];
        const diagnostic = DiagnosticRepository_1.DiagnosticRepository.create({
            title: diagnosticData.title,
            description: diagnosticData.description,
            includeInBudget: diagnosticData.includeInBudget,
            priority: diagnosticData.priority || "media",
            mechanicNote: diagnosticData.mechanicNote,
            recommendedServices,
            recommendedParts,
            serviceOrder: order
        });
        return await DiagnosticRepository_1.DiagnosticRepository.save(diagnostic);
    }
}
exports.AddDiagnosticUseCase = AddDiagnosticUseCase;
