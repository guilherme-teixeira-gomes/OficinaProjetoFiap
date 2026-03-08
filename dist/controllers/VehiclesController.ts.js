"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const VehiclesService_1 = require("../services/VehiclesService");
class VehicleController {
    async handle(req, res) {
        try {
            const service = new VehiclesService_1.VehicleService();
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
        const service = new VehiclesService_1.VehicleService();
        const vehicles = await service.list();
        return res.json(vehicles);
    }
    async get(req, res) {
        const service = new VehiclesService_1.VehicleService();
        const vehicle = await service.getById(Number(req.params.id));
        if (!vehicle)
            return res.status(404).json({ error: "Veículo não encontrado" });
        return res.json(vehicle);
    }
}
exports.VehicleController = VehicleController;
