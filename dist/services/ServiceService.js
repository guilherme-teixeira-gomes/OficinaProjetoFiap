"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
// services/ServiceService.ts
const ServiceRepository_1 = require("../repositories/ServiceRepository");
class ServiceService {
    async create(data) {
        const service = ServiceRepository_1.ServiceRepository.create(data);
        return ServiceRepository_1.ServiceRepository.save(service);
    }
    async list() {
        return ServiceRepository_1.ServiceRepository.find();
    }
    async getById(id) {
        return ServiceRepository_1.ServiceRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        const service = await this.getById(id);
        if (!service)
            throw new Error("Serviço não encontrado");
        ServiceRepository_1.ServiceRepository.merge(service, data);
        return ServiceRepository_1.ServiceRepository.save(service);
    }
    async delete(id) {
        const service = await this.getById(id);
        if (!service)
            throw new Error("Serviço não encontrado");
        return ServiceRepository_1.ServiceRepository.remove(service);
    }
}
exports.ServiceService = ServiceService;
