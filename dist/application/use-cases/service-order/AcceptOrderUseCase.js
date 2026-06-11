"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptOrderUseCase = void 0;
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
const UserRepository_1 = require("../../../infrastructure/repositories/UserRepository");
class AcceptOrderUseCase {
    async execute(orderId, mechanicId) {
        const mechanic = await UserRepository_1.UserRepository.findOne({
            where: {
                id: mechanicId,
                role: "mecanico"
            }
        });
        if (!mechanic) {
            throw new Error("Mecânico não encontrado ou não autorizado");
        }
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id: orderId }
        });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (order.status !== "RECEBIDA") {
            throw new Error("Ordem de serviço precisa estar com status RECEBIDA");
        }
        if (order.mechanicId) {
            throw new Error("Esta OS já foi aceita por outro mecânico");
        }
        order.status = "EM_DIAGNOSTICO";
        order.mechanic = mechanic;
        order.mechanicId = mechanicId;
        order.startedAt = new Date();
        const savedOrder = await ServiceOrderRepository_1.ServiceOrderRepository.save(order);
        return await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ["client", "vehicle", "services", "parts", "mechanic"]
        });
    }
}
exports.AcceptOrderUseCase = AcceptOrderUseCase;
