"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = exports.getVehicleRepository = void 0;
const Vehicle_1 = require("../../domain/entities/Vehicle");
const data_source_1 = require("../database/data-source");
const getVehicleRepository = () => data_source_1.AppDataSource.getRepository(Vehicle_1.Vehicle);
exports.getVehicleRepository = getVehicleRepository;
exports.VehicleRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getVehicleRepository)()[prop];
    }
});
