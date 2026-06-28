"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptOrderUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
const User_1 = require("../../../domain/entities/User");
class AcceptOrderUseCase {
    async execute(orderId, mechanicId) {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const mechanic = await userRepo.findOne({
            where: { id: mechanicId, role: "mecanico" }
        });
        if (!mechanic)
            throw new Error("Mecânico não encontrado ou não autorizado");
        const order = await orderRepo.findOne({ where: { id: orderId } });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        if (order.status !== "RECEBIDA")
            throw new Error("Ordem de serviço precisa estar com status RECEBIDA");
        if (order.mechanicId)
            throw new Error("Esta OS já foi aceita por outro mecânico");
        order.status = "EM_DIAGNOSTICO";
        order.mechanic = mechanic;
        order.mechanicId = mechanicId;
        order.startedAt = new Date();
        const savedOrder = await orderRepo.save(order);
        return await orderRepo.findOne({
            where: { id: savedOrder.id },
            relations: ["client", "vehicle", "services", "parts", "mechanic"]
        });
    }
}
exports.AcceptOrderUseCase = AcceptOrderUseCase;
