import { Request, Response } from "express";
import { ServiceOrderService } from "../services/ServiceOrderService";

export class ServiceOrderController {
  private service = new ServiceOrderService();

  async handle(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const order = await service.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Ordem de serviço criada com sucesso! Aguardando mecânico.",
        data: order
      });
    } catch (err: any) {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
  }
  async list(req: Request, res: Response) {
    const service = new ServiceOrderService();
    const orders = await service.list();
    res.json(orders);
  }

  async get(req: Request, res: Response) {
    const service = new ServiceOrderService();
    const order = await service.getById(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "Ordem de serviço não encontrada" });
    res.json(order);
  }

  async acceptOrder(req: Request, res: Response) {
    try {
      const { mechanicId } = req.body;
      const service = new ServiceOrderService();
      const order = await service.acceptOrder(
        Number(req.params.id), 
        mechanicId
      );
      res.json({
        success: true,
        message: "OS aceita com sucesso! Inicie o diagnóstico.",
        data: order
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async addDiagnostic(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const diagnostic = await service.addDiagnostic(
        Number(req.params.id),
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Diagnóstico adicionado com sucesso!",
        data: diagnostic
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async finishDiagnostic(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const result = await service.finishDiagnostic(Number(req.params.id));
      res.json({
        success: true,
        message: "Diagnóstico finalizado! Orçamento gerado.",
        data: result
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const order = await service.updateStatus(
        Number(req.params.id), 
        req.body.status
      );
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const order = await service.approve(
        Number(req.params.id),
        req.body.approvedDiagnosticIds
      );
      res.json({
        success: true,
        message: "Orçamento aprovado! Iniciando execução.",
        data: order
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async finish(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const order = await service.finish(Number(req.params.id));
      res.json({
        success: true,
        message: "Serviço finalizado! Aguardando entrega.",
        data: order
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deliver(req: Request, res: Response) {
    try {
      const service = new ServiceOrderService();
      const order = await service.deliver(Number(req.params.id));
      res.json({
        success: true,
        message: "Veículo entregue ao cliente!",
        data: order
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

}