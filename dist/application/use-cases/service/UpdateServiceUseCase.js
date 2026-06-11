"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceUseCase = void 0;
const ServiceRepository_1 = require("../../../infrastructure/repositories/ServiceRepository");
const GetServiceByIdUseCase_1 = require("./GetServiceByIdUseCase");
class UpdateServiceUseCase {
    constructor() {
        this.getServiceByIdUseCase = new GetServiceByIdUseCase_1.GetServiceByIdUseCase();
    }
    async update(id, data) {
        const service = await this.getServiceByIdUseCase.getById(id);
        if (!service)
            throw new Error("Serviço não encontrado");
        ServiceRepository_1.ServiceRepository.merge(service, data);
        return ServiceRepository_1.ServiceRepository.save(service);
    }
}
exports.UpdateServiceUseCase = UpdateServiceUseCase;
