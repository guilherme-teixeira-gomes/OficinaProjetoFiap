"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartServiceExecutionUseCase = void 0;
const ServiceExecutionRepository_1 = require("../../../infrastructure/repositories/ServiceExecutionRepository");
class StartServiceExecutionUseCase {
    async execute(data) {
        let execution = await ServiceExecutionRepository_1.ServiceExecutionRepository.findOne({
            where: {
                serviceOrderId: data.serviceOrderId,
                serviceId: data.serviceId
            }
        });
        if (!execution) {
            execution = ServiceExecutionRepository_1.ServiceExecutionRepository.create({
                serviceOrderId: data.serviceOrderId,
                serviceId: data.serviceId,
                status: "EM_ANDAMENTO",
                startedAt: new Date()
            });
        }
        else {
            if (execution.status === "CONCLUIDO") {
                throw new Error("Este serviço já foi concluído");
            }
            execution.startedAt = new Date();
            execution.status = "EM_ANDAMENTO";
        }
        return await ServiceExecutionRepository_1.ServiceExecutionRepository.save(execution);
    }
}
exports.StartServiceExecutionUseCase = StartServiceExecutionUseCase;
