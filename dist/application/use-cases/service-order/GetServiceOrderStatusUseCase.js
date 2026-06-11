"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceOrderStatusUseCase = void 0;
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class GetServiceOrderStatusUseCase {
    async execute(id) {
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id },
            // select: ["id", "status", "createdAt", "updatedAt"]
        });
        return order;
    }
}
exports.GetServiceOrderStatusUseCase = GetServiceOrderStatusUseCase;
