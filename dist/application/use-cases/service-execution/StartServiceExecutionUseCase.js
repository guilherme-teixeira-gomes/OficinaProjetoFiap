"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartServiceExecutionUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceExecution_1 = require("../../../domain/entities/ServiceExecution");
class StartServiceExecutionUseCase {
    async execute(data) {
        const repo = data_source_1.AppDataSource.getRepository(ServiceExecution_1.ServiceExecution);
        let execution = await repo.findOne({ where: { serviceOrderId: data.serviceOrderId, serviceId: data.serviceId } });
        if (!execution) {
            execution = repo.create({ serviceOrderId: data.serviceOrderId, serviceId: data.serviceId, status: "EM_ANDAMENTO", startedAt: new Date() });
        }
        else {
            if (execution.status === "CONCLUIDO")
                throw new Error("Este serviço já foi concluído");
            execution.startedAt = new Date();
            execution.status = "EM_ANDAMENTO";
        }
        return await repo.save(execution);
    }
}
exports.StartServiceExecutionUseCase = StartServiceExecutionUseCase;
