"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListVehiclesUseCase = void 0;
const VehicleRepository_1 = require("../../../infrastructure/repositories/VehicleRepository");
class ListVehiclesUseCase {
    async list() {
        return VehicleRepository_1.VehicleRepository.find({ relations: ["client"] });
    }
}
exports.ListVehiclesUseCase = ListVehiclesUseCase;
