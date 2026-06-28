"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVehicleUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Vehicle_1 = require("../../../domain/entities/Vehicle");
const Client_1 = require("../../../domain/entities/Client");
class CreateVehicleUseCase {
    async execute(data) {
        const vehicleRepo = data_source_1.AppDataSource.getRepository(Vehicle_1.Vehicle);
        const clientRepo = data_source_1.AppDataSource.getRepository(Client_1.Client);
        const client = await clientRepo.findOne({ where: { document: data.clientDocument } });
        if (!client)
            throw new Error("Cliente não encontrado");
        const exists = await vehicleRepo.findOne({ where: { plate: data.plate } });
        if (exists)
            throw new Error("Veículo já cadastrado");
        const vehicle = vehicleRepo.create({ ...data, client });
        await vehicleRepo.save(vehicle);
        return vehicle;
    }
}
exports.CreateVehicleUseCase = CreateVehicleUseCase;
