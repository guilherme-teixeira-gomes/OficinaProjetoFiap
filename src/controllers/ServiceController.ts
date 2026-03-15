
import { Request, Response } from "express";
import { ServiceService } from "../services/ServiceService";

export class ServiceController {
  async handle(req: Request, res: Response) {
    try {
      const service = new ServiceService();
      const newService = await service.create(req.body);
      return res.status(201).json(newService);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const service = new ServiceService();
    const services = await service.list();
    return res.json(services);
  }

  async get(req: Request, res: Response) {
    const service = new ServiceService();
    const s = await service.getById(Number(req.params.id));
    if (!s) return res.status(404).json({ error: "Serviço não encontrado" });
    return res.json(s);
  }

  async update(req: Request, res: Response) {
    try {
      const service = new ServiceService();
      const s = await service.update(Number(req.params.id), req.body);
      return res.json(s);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const service = new ServiceService();
      await service.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}