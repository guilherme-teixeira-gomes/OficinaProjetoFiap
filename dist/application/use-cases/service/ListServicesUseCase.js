"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServicesUseCase = void 0;
const ServiceRepository_1 = require("../../../infrastructure/repositories/ServiceRepository");
class ListServicesUseCase {
    async list() {
        return ServiceRepository_1.ServiceRepository.find();
    }
}
exports.ListServicesUseCase = ListServicesUseCase;
