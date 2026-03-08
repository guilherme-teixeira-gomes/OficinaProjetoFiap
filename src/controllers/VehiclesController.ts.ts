import { Request, Response } from "express";
import { VehicleService } from "../services/VehiclesService";


export class VehicleController {

  async handle(req: Request, res: Response) {
    try {
      const service = new VehicleService();
      const { plate, brand, model, year, clientDocument } = req.body;

      const vehicle = await service.execute({
        plate,
        brand,
        model,
        year,
        clientDocument
      });

      return res.status(201).json(vehicle);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const service = new VehicleService();
    const vehicles = await service.list();
    return res.json(vehicles);
  }

  async get(req: Request, res: Response) {
    const service = new VehicleService();
    const vehicle = await service.getById(Number(req.params.id));
    if (!vehicle) return res.status(404).json({ error: "Veículo não encontrado" });
    return res.json(vehicle);
  }
}