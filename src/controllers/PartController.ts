
import { Request, Response } from "express";
import { PartService } from "../services/PartService";

export class PartController {
  async handle(req: Request, res: Response) {
    try {
      const service = new PartService();
      const part = await service.create(req.body);
      return res.status(201).json(part);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const service = new PartService();
    const parts = await service.list();
    return res.json(parts);
  }

  async get(req: Request, res: Response) {
    const service = new PartService();
    const part = await service.getById(Number(req.params.id));
    if (!part) return res.status(404).json({ error: "Peça não encontrada" });
    return res.json(part);
  }

  async update(req: Request, res: Response) {
    try {
      const service = new PartService();
      const part = await service.update(Number(req.params.id), req.body);
      return res.json(part);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const service = new PartService();
      await service.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}