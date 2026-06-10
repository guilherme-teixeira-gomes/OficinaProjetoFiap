import { Request, Response } from "express";
import { CreateVehicleUseCase } from "../../../application/use-cases/vehicle/CreateVehicleUseCase";
import { ListVehiclesUseCase } from "../../../application/use-cases/vehicle/ListVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicle/GetVehicleByIdUseCase";
import { UpdateVehicleUseCase } from "../../../application/use-cases/vehicle/UpdateVehicleUseCase";
import { DeleteVehicleUseCase } from "../../../application/use-cases/vehicle/DeleteVehicleUseCase";

export class VehicleController {

  async handle(req: Request, res: Response) {
    try {
      const service = new CreateVehicleUseCase();
      const { plate, brand, model, year, clientDocument } = req.body;
      const vehicle = await service.execute({ plate, brand, model, year, clientDocument });
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

  // ── Novos métodos ────────────────────────────────────────────────────────────

  async update(req: Request, res: Response) {
    try {
      const service = new UpdateVehicleUseCase();
      const vehicle = await service.execute(Number(req.params.id), req.body);
      return res.json({ success: true, data: vehicle });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const service = new DeleteVehicleUseCase();
      const result = await service.execute(Number(req.params.id));
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}