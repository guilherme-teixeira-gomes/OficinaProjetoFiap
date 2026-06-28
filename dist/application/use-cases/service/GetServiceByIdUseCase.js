"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceByIdUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Service_1 = require("../../../domain/entities/Service");
class GetServiceByIdUseCase {
    async getById(id) {
        const repo = data_source_1.AppDataSource.getRepository(Service_1.Service);
        return repo.findOne({ where: { id } });
    }
}
exports.GetServiceByIdUseCase = GetServiceByIdUseCase;
