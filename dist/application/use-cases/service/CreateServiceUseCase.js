"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceUseCase = void 0;
const ServiceRepository_1 = require("../../../infrastructure/repositories/ServiceRepository");
class CreateServiceUseCase {
    async create(data) {
        const service = ServiceRepository_1.ServiceRepository.create(data);
        return ServiceRepository_1.ServiceRepository.save(service);
    }
}
exports.CreateServiceUseCase = CreateServiceUseCase;
