"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishServiceExecutionUseCase = void 0;
const ServiceExecutionRepository_1 = require("../../../infrastructure/repositories/ServiceExecutionRepository");
const ServiceOrderRepository_1 = require("../../../infrastructure/repositories/ServiceOrderRepository");
class FinishServiceExecutionUseCase {
    async execute(data) {
        const execution = await ServiceExecutionRepository_1.ServiceExecutionRepository.findOne({
            where: {
                serviceOrderId: data.serviceOrderId,
                serviceId: data.serviceId
            },
            relations: ["service"]
        });
        if (!execution) {
            throw new Error("Execução não encontrada");
        }
        if (execution.status === "CONCLUIDO") {
            throw new Error("Serviço já foi concluído");
        }
        execution.finishedAt = new Date();
        execution.status = "CONCLUIDO";
        execution.mechanicNote = data.mechanicNote;
        if (execution.startedAt) {
            const durationMs = execution.finishedAt.getTime() - execution.startedAt.getTime();
            execution.durationMinutes = Math.round(durationMs / 60000);
        }
        await ServiceExecutionRepository_1.ServiceExecutionRepository.save(execution);
        // Verifica se todos os serviços da OS foram concluídos
        await this.checkAndFinishOrder(data.serviceOrderId);
        return execution;
    }
    async checkAndFinishOrder(serviceOrderId) {
        const executions = await ServiceExecutionRepository_1.ServiceExecutionRepository.find({
            where: { serviceOrderId }
        });
        const total = executions.length;
        const concluded = executions.filter(e => e.status === "CONCLUIDO").length;
        if (total > 0 && total === concluded) {
            const order = await ServiceOrderRepository_1.ServiceOrderRepository.findOne({
                where: { id: serviceOrderId }
            });
            if (order && order.status === "EM_EXECUCAO") {
                order.status = "FINALIZADA";
                order.finishedAt = new Date();
                await ServiceOrderRepository_1.ServiceOrderRepository.save(order);
            }
        }
    }
}
exports.FinishServiceExecutionUseCase = FinishServiceExecutionUseCase;
