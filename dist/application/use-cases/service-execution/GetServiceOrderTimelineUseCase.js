"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceOrderTimelineUseCase = void 0;
const ServiceExecutionRepository_1 = require("../../../infrastructure/repositories/ServiceExecutionRepository");
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class GetServiceOrderTimelineUseCase {
    async execute(serviceOrderId) {
        const executions = await ServiceExecutionRepository_1.ServiceExecutionRepository.find({
            where: { serviceOrderId },
            relations: ["service"],
            order: { startedAt: "ASC" }
        });
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id: serviceOrderId }
        });
        return {
            serviceOrder: {
                id: order?.id,
                status: order?.status,
                startedAt: order?.startedAt,
                finishedAt: order?.finishedAt,
                totalDuration: order?.startedAt && order?.finishedAt
                    ? Math.round((order.finishedAt.getTime() - order.startedAt.getTime()) / 60000)
                    : null
            },
            services: executions.map(e => ({
                serviceId: e.serviceId,
                serviceName: e.service?.name,
                status: e.status,
                startedAt: e.startedAt,
                finishedAt: e.finishedAt,
                durationMinutes: e.durationMinutes,
                mechanicNote: e.mechanicNote
            }))
        };
    }
}
exports.GetServiceOrderTimelineUseCase = GetServiceOrderTimelineUseCase;
