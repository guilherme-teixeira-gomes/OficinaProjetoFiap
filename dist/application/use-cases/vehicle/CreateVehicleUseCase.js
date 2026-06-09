"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVehicleUseCase = void 0;
const ClientRepository_1 = require("../../../infrastructure/repositories/ClientRepository");
const VehicleRepository_1 = require("../../../infrastructure/repositories/VehicleRepository");
class CreateVehicleUseCase {
    async execute(data) {
        const client = await ClientRepository_1.ClientRepository.findOne({ where: { document: data.clientDocument } });
        if (!client)
            throw new Error("Cliente não encontrado");
        const exists = await VehicleRepository_1.VehicleRepository.findOne({ where: { plate: data.plate } });
        if (exists)
            throw new Error("Veículo já cadastrado");
        const vehicle = VehicleRepository_1.VehicleRepository.create({ ...data, client });
        await VehicleRepository_1.VehicleRepository.save(vehicle);
        return vehicle;
    }
}
exports.CreateVehicleUseCase = CreateVehicleUseCase;
