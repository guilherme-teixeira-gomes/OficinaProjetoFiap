"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceOrderStatusUseCase = void 0;
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class UpdateServiceOrderStatusUseCase {
    async execute(id, status) {
        const validStatus = [
            "RECEBIDA", "EM_DIAGNOSTICO", "AGUARDANDO_APROVACAO",
            "EM_EXECUCAO", "FINALIZADA", "ENTREGUE"
        ];
        if (!validStatus.includes(status)) {
            throw new Error(`Status inválido. Use: ${validStatus.join(", ")}`);
        }
        const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({ where: { id } });
        if (!order)
            throw new Error("Ordem de serviço não encontrada");
        order.status = status;
        return ServiceOrderRepository_1.ServiceOrderRepository.save(order);
    }
}
exports.UpdateServiceOrderStatusUseCase = UpdateServiceOrderStatusUseCase;
