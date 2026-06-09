"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceByIdUseCase = void 0;
const ServiceRepository_1 = require("../../../infrastructure/repositories/ServiceRepository");
class GetServiceByIdUseCase {
    async getById(id) {
        return ServiceRepository_1.ServiceRepository.findOne({ where: { id } });
    }
}
exports.GetServiceByIdUseCase = GetServiceByIdUseCase;
