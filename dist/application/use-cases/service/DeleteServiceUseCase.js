"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteServiceUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Service_1 = require("../../../domain/entities/Service");
class DeleteServiceUseCase {
    async delete(id) {
        const repo = data_source_1.AppDataSource.getRepository(Service_1.Service);
        const service = await repo.findOne({ where: { id } });
        if (!service)
            throw new Error("Serviço não encontrado");
        return repo.remove(service);
    }
}
exports.DeleteServiceUseCase = DeleteServiceUseCase;
