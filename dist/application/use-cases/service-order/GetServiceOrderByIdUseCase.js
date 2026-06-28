"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceOrderByIdUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
class GetServiceOrderByIdUseCase {
    async execute(id) {
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const order = await orderRepo.findOne({
            where: { id },
            relations: [
                "client", "vehicle", "services", "parts", "mechanic",
                "diagnostics", "diagnostics.recommendedServices", "diagnostics.recommendedParts",
                "executions", "executions.service"
            ]
        });
        if (!order)
            return null;
        return {
            ...order,
            services: order.services?.map(s => ({ ...s, price: Number(s.price) })),
            parts: order.parts?.map(p => ({ ...p, price: Number(p.price) })),
            executions: order.executions?.map(e => ({
                ...e,
                service: e.service,
                durationMinutes: e.durationMinutes
            }))
        };
    }
}
exports.GetServiceOrderByIdUseCase = GetServiceOrderByIdUseCase;
