"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListVehiclesUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Vehicle_1 = require("../../../domain/entities/Vehicle");
class ListVehiclesUseCase {
    async list() {
        const repo = data_source_1.AppDataSource.getRepository(Vehicle_1.Vehicle);
        return repo.find({ relations: ["client"] });
    }
}
exports.ListVehiclesUseCase = ListVehiclesUseCase;
