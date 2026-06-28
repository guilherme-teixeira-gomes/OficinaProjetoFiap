"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceOrderStatusUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
class UpdateServiceOrderStatusUseCase {
    async execute(id, status) {
        const validStatus = [
            "RECEBIDA", "EM_DIAGNOSTICO", "AGUARDANDO_APROVACAO",
            "EM_EXECUCAO", "FINALIZADA", "ENTREGUE"
        ];
        if (!validStatus.includes(status)) {
            throw new Error(`Status inválido. Use: ${validStatus.join(", ")}`);
        }
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const order = await orderRepo.findOne({ where: { id } });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        order.status = status;
        return orderRepo.save(order);
    }
}
exports.UpdateServiceOrderStatusUseCase = UpdateServiceOrderStatusUseCase;
