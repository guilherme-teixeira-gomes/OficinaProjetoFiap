import { Request, Response } from "express";
import { ServiceOrderService } from "../services/ServiceOrderService";

export class ServiceOrderController {

  async handle(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const { clientDocument, vehicle, services, parts } = req.body;

      const order = await service.execute({ clientDocument, vehicle, services, parts });

      return res.status(201).json(order);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const service = new ServiceOrderService();
    const orders = await service.list();
    return res.json(orders);
  }

  async get(req: Request, res: Response) {
    const service = new ServiceOrderService();
    const order = await service.getById(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "Ordem de serviço não encontrada" });
    return res.json(order);
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const updated = await service.updateStatus(Number(req.params.id), req.body.status);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}