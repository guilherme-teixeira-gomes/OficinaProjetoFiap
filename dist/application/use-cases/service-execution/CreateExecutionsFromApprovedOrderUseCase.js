"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExecutionsFromApprovedOrderUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
const ServiceExecution_1 = require("../../../domain/entities/ServiceExecution");
class CreateExecutionsFromApprovedOrderUseCase {
    async execute(serviceOrderId) {
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const executionRepo = data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
        const order = await orderRepo.findOne({ where: { id: serviceOrderId }, relations: ["services"] });
        if (!order)
            throw new Error("Ordem não encontrada");
        const createdExecutions = [];
        for (const service of order.services) {
            const exists = await executionRepo.findOne({ where: { serviceOrderId: order.id, serviceId: service.id } });
            if (!exists) {
                const execution = await executionRepo.save({ serviceOrderId: order.id, serviceId: service.id, status: "PENDENTE" });
                createdExecutions.push(execution);
            }
        }
        return createdExecutions;
    }
}
exports.CreateExecutionsFromApprovedOrderUseCase = CreateExecutionsFromApprovedOrderUseCase;
