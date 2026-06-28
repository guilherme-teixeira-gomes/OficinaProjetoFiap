"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Service_1 = require("../../../domain/entities/Service");
class CreateServiceUseCase {
    async create(data) {
        const repo = data_source_1.AppDataSource.getRepository(Service_1.Service);
        const service = repo.create(data);
        return repo.save(service);
    }
}
exports.CreateServiceUseCase = CreateServiceUseCase;
