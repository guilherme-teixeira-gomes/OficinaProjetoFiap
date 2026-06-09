"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExecutionsFromApprovedOrderUseCase = void 0;
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
const ServiceExecutionRepository_1 = require("../../../infrastructure/repositories/ServiceExecutionRepository");
class CreateExecutionsFromApprovedOrderUseCase {
    async execute(serviceOrderId) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id: serviceOrderId },
            relations: ["services"]
        });
        if (!order)
            throw new Error("Ordem não encontrada");
        const createdExecutions = [];
        for (const service of order.services) {
            const exists = await ServiceExecutionRepository_1.ServiceExecutionRepository.findOne({
                where: {
                    serviceOrderId: order.id,
                    serviceId: service.id
                }
            });
            if (!exists) {
                const execution = await ServiceExecutionRepository_1.ServiceExecutionRepository.save({
                    serviceOrderId: order.id,
                    serviceId: service.id,
                    status: "PENDENTE"
                });
                createdExecutions.push(execution);
            }
        }
        return createdExecutions;
    }
}
exports.CreateExecutionsFromApprovedOrderUseCase = CreateExecutionsFromApprovedOrderUseCase;
