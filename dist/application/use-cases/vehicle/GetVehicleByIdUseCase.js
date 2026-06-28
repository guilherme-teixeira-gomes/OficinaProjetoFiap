"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVehicleByIdUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Vehicle_1 = require("../../../domain/entities/Vehicle");
class GetVehicleByIdUseCase {
    async getById(id) {
        const repo = data_source_1.AppDataSource.getRepository(Vehicle_1.Vehicle);
        return repo.findOne({ where: { id }, relations: ["client"] });
    }
}
exports.GetVehicleByIdUseCase = GetVehicleByIdUseCase;
