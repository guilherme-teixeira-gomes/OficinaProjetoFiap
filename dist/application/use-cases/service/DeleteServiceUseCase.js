"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteServiceUseCase = void 0;
const ServiceRepository_1 = require("../../../infrastructure/repositories/ServiceRepository");
const GetServiceByIdUseCase_1 = require("./GetServiceByIdUseCase");
class DeleteServiceUseCase {
    constructor() {
        this.getServiceByIdUseCase = new GetServiceByIdUseCase_1.GetServiceByIdUseCase();
    }
    async delete(id) {
        const service = await this.getServiceByIdUseCase.getById(id);
        if (!service)
            throw new Error("Serviço não encontrado");
        return ServiceRepository_1.ServiceRepository.remove(service);
    }
}
exports.DeleteServiceUseCase = DeleteServiceUseCase;
