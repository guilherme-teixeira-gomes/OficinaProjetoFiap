
import { Request, Response } from "express";
import { CreatePartUseCase } from "../../../application/use-cases/part/CreatePartUseCase";
import { ListPartsUseCase } from "../../../application/use-cases/part/ListPartsUseCase";
import { GetPartByIdUseCase } from "../../../application/use-cases/part/GetPartByIdUseCase";
import { UpdatePartUseCase } from "../../../application/use-cases/part/UpdatePartUseCase";
import { DeletePartUseCase } from "../../../application/use-cases/part/DeletePartUseCase";

export class PartController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreatePartUseCase();
      const part = await service.create(req.body);
      return res.status(201).json(part);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const service = new ListPartsUseCase();
    const parts = await service.list();
    return res.json(parts);
  }

  async get(req: Request, res: Response) {
    const service = new GetPartByIdUseCase();
    const part = await service.getById(Number(req.params.id));
    if (!part) return res.status(404).json({ error: "Peça não encontrada" });
    return res.json(part);
  }

  async update(req: Request, res: Response) {
    try {
      const service = new UpdatePartUseCase();
      const part = await service.update(Number(req.params.id), req.body);
      return res.json(part);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const service = new DeletePartUseCase();
      await service.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}