import { Request, Response } from "express";
import { CreateVehicleUseCase } from "../../../application/use-cases/vehicle/CreateVehicleUseCase";
import { ListVehiclesUseCase } from "../../../application/use-cases/vehicle/ListVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicle/GetVehicleByIdUseCase";

export class VehicleController {

  async handle(req: Request, res: Response) {
    try {
      const service = new CreateVehicleUseCase();
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
    const service = new ListVehiclesUseCase();
    const vehicles = await service.list();
    return res.json(vehicles);
  }

  async get(req: Request, res: Response) {
    const service = new GetVehicleByIdUseCase();
    const vehicle = await service.getById(Number(req.params.id));
    if (!vehicle) return res.status(404).json({ error: "Veículo não encontrado" });
    return res.json(vehicle);
  }
}