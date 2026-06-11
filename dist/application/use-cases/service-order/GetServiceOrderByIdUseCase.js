"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceOrderByIdUseCase = void 0;
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class GetServiceOrderByIdUseCase {
    async execute(id) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id },
            relations: [
                "client",
                "vehicle",
                "services",
                "parts",
                "mechanic",
                "diagnostics",
                "diagnostics.recommendedServices",
                "diagnostics.recommendedParts",
                "executions",
                "executions.service"
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
