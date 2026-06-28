"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceOrderTimelineUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceExecution_1 = require("../../../domain/entities/ServiceExecution");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
class GetServiceOrderTimelineUseCase {
    async execute(serviceOrderId) {
        const executionRepo = data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const executions = await executionRepo.find({ where: { serviceOrderId }, relations: ["service"], order: { startedAt: "ASC" } });
        const order = await orderRepo.findOne({ where: { id: serviceOrderId } });
        return {
            serviceOrder: { id: order?.id, status: order?.status, startedAt: order?.startedAt, finishedAt: order?.finishedAt, totalDuration: order?.startedAt && order?.finishedAt ? Math.round((order.finishedAt.getTime() - order.startedAt.getTime()) / 60000) : null },
            services: executions.map(e => ({ serviceId: e.serviceId, serviceName: e.service?.name, status: e.status, startedAt: e.startedAt, finishedAt: e.finishedAt, durationMinutes: e.durationMinutes, mechanicNote: e.mechanicNote }))
        };
    }
}
exports.GetServiceOrderTimelineUseCase = GetServiceOrderTimelineUseCase;
