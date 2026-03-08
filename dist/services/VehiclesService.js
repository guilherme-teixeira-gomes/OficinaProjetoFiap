"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const ClientRepository_1 = require("../repositories/ClientRepository");
const VehicleRepository_1 = require("../repositories/VehicleRepository");
class VehicleService {
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
    async list() {
        return VehicleRepository_1.VehicleRepository.find({ relations: ["client"] });
    }
    async getById(id) {
        return VehicleRepository_1.VehicleRepository.findOne({ where: { id }, relations: ["client"] });
    }
}
exports.VehicleService = VehicleService;
