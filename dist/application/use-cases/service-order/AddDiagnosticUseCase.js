"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDiagnosticUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
const Diagnostic_1 = require("../../../domain/entities/Diagnostic");
const Service_1 = require("../../../domain/entities/Service");
const Part_1 = require("../../../domain/entities/Part");
class AddDiagnosticUseCase {
    async execute(orderId, diagnosticData) {
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const diagnosticRepo = data_source_1.AppDataSource.getRepository(Diagnostic_1.Diagnostic);
        const serviceRepo = data_source_1.AppDataSource.getRepository(Service_1.Service);
        const partRepo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const order = await orderRepo.findOne({
            where: { id: orderId },
            relations: ["diagnostics"]
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (order.status !== "EM_DIAGNOSTICO") {
            throw new Error("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
        }
        const recommendedServices = diagnosticData.serviceIds?.length
            ? await serviceRepo.findByIds(diagnosticData.serviceIds)
            : [];
        const recommendedParts = diagnosticData.partIds?.length
            ? await partRepo.findByIds(diagnosticData.partIds)
            : [];
        const diagnostic = diagnosticRepo.create({
            title: diagnosticData.title,
            description: diagnosticData.description,
            includeInBudget: diagnosticData.includeInBudget,
            priority: diagnosticData.priority || "media",
            mechanicNote: diagnosticData.mechanicNote,
            recommendedServices,
            recommendedParts,
            serviceOrder: order
        });
        return await diagnosticRepo.save(diagnostic);
    }
}
exports.AddDiagnosticUseCase = AddDiagnosticUseCase;
