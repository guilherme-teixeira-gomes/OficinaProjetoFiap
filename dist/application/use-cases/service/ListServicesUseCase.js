"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServicesUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Service_1 = require("../../../domain/entities/Service");
class ListServicesUseCase {
    async list() {
        const repo = data_source_1.AppDataSource.getRepository(Service_1.Service);
        return repo.find();
    }
}
exports.ListServicesUseCase = ListServicesUseCase;
