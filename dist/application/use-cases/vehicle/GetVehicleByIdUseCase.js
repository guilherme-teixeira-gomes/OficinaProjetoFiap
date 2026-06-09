"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVehicleByIdUseCase = void 0;
const VehicleRepository_1 = require("../../../infrastructure/repositories/VehicleRepository");
class GetVehicleByIdUseCase {
    async getById(id) {
        return VehicleRepository_1.VehicleRepository.findOne({ where: { id }, relations: ["client"] });
    }
}
exports.GetVehicleByIdUseCase = GetVehicleByIdUseCase;
