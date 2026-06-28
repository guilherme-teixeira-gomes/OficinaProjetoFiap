"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceOrderStatusUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const ServiceOrder_1 = require("../../../domain/entities/ServiceOrder");
class GetServiceOrderStatusUseCase {
    async execute(id) {
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        const orderRepo = data_source_1.AppDataSource.getRepository(ServiceOrder_1.ServiceOrder);
        return await orderRepo.findOne({ where: { id } });
    }
}
exports.GetServiceOrderStatusUseCase = GetServiceOrderStatusUseCase;
