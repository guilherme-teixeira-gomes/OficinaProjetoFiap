"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const CreateVehicleUseCase_1 = require("../../../application/use-cases/vehicle/CreateVehicleUseCase");
const ListVehiclesUseCase_1 = require("../../../application/use-cases/vehicle/ListVehiclesUseCase");
const GetVehicleByIdUseCase_1 = require("../../../application/use-cases/vehicle/GetVehicleByIdUseCase");
class VehicleController {
    async handle(req, res) {
        try {
            const service = new CreateVehicleUseCase_1.CreateVehicleUseCase();
            const { plate, brand, model, year, clientDocument } = req.body;
            const vehicle = await service.execute({
                plate,
                brand,
                model,
                year,
                clientDocument
            });
            return res.status(201).json(vehicle);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req, res) {
        const service = new ListVehiclesUseCase_1.ListVehiclesUseCase();
        const vehicles = await service.list();
        return res.json(vehicles);
    }
    async get(req, res) {
        const service = new GetVehicleByIdUseCase_1.GetVehicleByIdUseCase();
        const vehicle = await service.getById(Number(req.params.id));
        if (!vehicle)
            return res.status(404).json({ error: "Veículo não encontrado" });
        return res.json(vehicle);
    }
}
exports.VehicleController = VehicleController;
