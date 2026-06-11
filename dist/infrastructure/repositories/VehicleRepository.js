"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = void 0;
const Vehicle_1 = require("../../domain/entities/Vehicle");
const data_source_1 = require("../database/data-source");
exports.VehicleRepository = data_source_1.AppDataSource.getRepository(Vehicle_1.Vehicle);
