"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishServiceExecutionUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceExecution_1 = require("../../../domain/entities/ServiceExecution");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
class FinishServiceExecutionUseCase {
    async execute(data) {
        const executionRepo = data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        const execution = await executionRepo.findOne({
            where: { serviceOrderId: data.serviceOrderId, serviceId: data.serviceId },
            relations: ["service"]
        });
        if (!execution)
            throw new Error("Execução não encontrada");
        if (execution.status === "CONCLUIDO")
            throw new Error("Serviço já foi concluído");
        execution.finishedAt = new Date();
        execution.status = "CONCLUIDO";
        execution.mechanicNote = data.mechanicNote;
        if (execution.startedAt) {
            const durationMs = execution.finishedAt.getTime() - execution.startedAt.getTime();
            execution.durationMinutes = Math.round(durationMs / 60000);
        }
        await executionRepo.save(execution);
        const executions = await executionRepo.find({ where: { serviceOrderId: data.serviceOrderId } });
        const total = executions.length;
        const concluded = executions.filter(e => e.status === "CONCLUIDO").length;
        if (total > 0 && total === concluded) {
            const order = await orderRepo.findOne({ where: { id: data.serviceOrderId } });
            if (order && order.status === "EM_EXECUCAO") {
                order.status = "FINALIZADA";
                order.finishedAt = new Date();
                await orderRepo.save(order);
            }
        }
        return execution;
    }
}
exports.FinishServiceExecutionUseCase = FinishServiceExecutionUseCase;
