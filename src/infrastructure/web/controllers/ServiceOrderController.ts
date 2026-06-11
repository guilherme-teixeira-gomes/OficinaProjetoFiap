import { Request, Response } from "express";
import { AcceptOrderUseCase } from "../../../application/use-cases/service-order/AcceptOrderUseCase";
import { AddDiagnosticUseCase } from "../../../application/use-cases/service-order/AddDiagnosticUseCase";
import { ApproveOrderUseCase } from "../../../application/use-cases/service-order/ApproveServiceOrderUseCase";
import { CreateServiceOrderUseCase } from "../../../application/use-cases/service-order/CreateServiceOrderUseCase";
import { DeliverServiceOrderUseCase } from "../../../application/use-cases/service-order/DeliverServiceOrderUseCase";
import { FinishDiagnosticUseCase } from "../../../application/use-cases/service-order/FinishDiagnosticUseCase";
import { FinishServiceOrderUseCase } from "../../../application/use-cases/service-order/FinishServiceOrderUseCase";
import { GetServiceOrderByIdUseCase } from "../../../application/use-cases/service-order/GetServiceOrderByIdUseCase";
import { GetServiceOrderStatusUseCase } from "../../../application/use-cases/service-order/GetServiceOrderStatusUseCase";
import { ListServiceOrdersUseCase } from "../../../application/use-cases/service-order/ListServiceOrdersUseCase";
import { RejectOrderUseCase } from "../../../application/use-cases/service-order/RejectServiceOrderUseCase";
import { UpdateServiceOrderStatusUseCase } from "../../../application/use-cases/service-order/UpdateServiceOrderStatusUseCase";


export class ServiceOrderController {
  private createServiceOrderUseCase: CreateServiceOrderUseCase;
  private acceptOrderUseCase: AcceptOrderUseCase;
  private addDiagnosticUseCase: AddDiagnosticUseCase;
  private finishDiagnosticUseCase: FinishDiagnosticUseCase;
  private approveOrderUseCase: ApproveOrderUseCase;
  private rejectOrderUseCase: RejectOrderUseCase;
  private getServiceOrderByIdUseCase: GetServiceOrderByIdUseCase;
  private listServiceOrdersUseCase: ListServiceOrdersUseCase;
  private getServiceOrderStatusUseCase: GetServiceOrderStatusUseCase;
  private updateServiceOrderStatusUseCase: UpdateServiceOrderStatusUseCase;
  private finishServiceOrderUseCase: FinishServiceOrderUseCase;
  private deliverServiceOrderUseCase: DeliverServiceOrderUseCase;

  constructor() {
    this.createServiceOrderUseCase = new CreateServiceOrderUseCase();
    this.acceptOrderUseCase = new AcceptOrderUseCase();
    this.addDiagnosticUseCase = new AddDiagnosticUseCase();
    this.finishDiagnosticUseCase = new FinishDiagnosticUseCase();
    this.approveOrderUseCase = new ApproveOrderUseCase();
    this.rejectOrderUseCase = new RejectOrderUseCase();
    this.getServiceOrderByIdUseCase = new GetServiceOrderByIdUseCase();
    this.listServiceOrdersUseCase = new ListServiceOrdersUseCase();
    this.getServiceOrderStatusUseCase = new GetServiceOrderStatusUseCase();
    this.updateServiceOrderStatusUseCase = new UpdateServiceOrderStatusUseCase();
    this.finishServiceOrderUseCase = new FinishServiceOrderUseCase();
    this.deliverServiceOrderUseCase = new DeliverServiceOrderUseCase();
  }

  async handle(req: Request, res: Response) {
    try {
      const order = await this.createServiceOrderUseCase.create(req.body);
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
    try {
      const excludeFinished = req.query.excludeFinished !== 'false';
      const orders = await this.listServiceOrdersUseCase.execute(excludeFinished);
      res.json(orders);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const order = await this.getServiceOrderByIdUseCase.execute(Number(req.params.id));
      if (!order) return res.status(404).json({ error: "Ordem de serviço não encontrada" });
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const status = await this.getServiceOrderStatusUseCase.execute(Number(req.params.id));
      if (!status) return res.status(404).json({ error: "Ordem de serviço não encontrada" });
      res.json(status);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async acceptOrder(req: Request, res: Response) {
    try {
      const { mechanicId } = req.body;
      const order = await this.acceptOrderUseCase.execute(
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
      const diagnostic = await this.addDiagnosticUseCase.execute(
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
      const result = await this.finishDiagnosticUseCase.execute(Number(req.params.id));
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
      const order = await this.updateServiceOrderStatusUseCase.execute(
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
      const order = await this.approveOrderUseCase.execute(
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

  async reject(req: Request, res: Response) {
    try {
      const result = await this.rejectOrderUseCase.execute(Number(req.params.id));
      res.json({
        success: true,
        message: "Orçamento recusado!",
        data: result
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async finish(req: Request, res: Response) {
    try {
      const order = await this.finishServiceOrderUseCase.execute(Number(req.params.id));
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
      const order = await this.deliverServiceOrderUseCase.execute(Number(req.params.id));
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