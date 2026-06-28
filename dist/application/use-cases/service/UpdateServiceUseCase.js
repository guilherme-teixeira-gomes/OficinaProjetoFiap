"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Service_1 = require("../../../domain/entities/Service");
class UpdateServiceUseCase {
    async update(id, data) {
        const repo = data_source_1.AppDataSource.getRepository(Service_1.Service);
        const service = await repo.findOne({ where: { id } });
        if (!service)
            throw new Error("Serviço não encontrado");
        repo.merge(service, data);
        return repo.save(service);
    }
}
exports.UpdateServiceUseCase = UpdateServiceUseCase;
