"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceOrdersUseCase = void 0;
const typeorm_1 = require("typeorm");
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class ListServiceOrdersUseCase {
    async execute(excludeFinished = true) {
        let where = {};
        if (excludeFinished) {
            where.status = (0, typeorm_1.Not)((0, typeorm_1.In)(["FINALIZADA", "ENTREGUE"]));
        }
        const orders = await ServiceOrderRepository_1.ServiceOrderRepository.find({
            where,
            relations: [
                "client", "vehicle", "services", "parts", "mechanic",
                "diagnostics", "diagnostics.recommendedServices", "diagnostics.recommendedParts"
            ],
            order: { createdAt: "ASC" }
        });
        const statusOrder = {
            "EM_EXECUCAO": 1,
            "AGUARDANDO_APROVACAO": 2,
            "EM_DIAGNOSTICO": 3,
            "RECEBIDA": 4
        };
        orders.sort((a, b) => {
            const orderA = statusOrder[a.status] || 99;
            const orderB = statusOrder[b.status] || 99;
            if (orderA !== orderB)
                return orderA - orderB;
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
        return orders.map(order => ({
            ...order,
            services: order.services?.map(s => ({ ...s, price: Number(s.price) })),
            parts: order.parts?.map(p => ({ ...p, price: Number(p.price) }))
        }));
    }
}
exports.ListServiceOrdersUseCase = ListServiceOrdersUseCase;
