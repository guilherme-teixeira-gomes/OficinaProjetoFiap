// src/infrastructure/web/controllers/ServiceExecutionController.ts
import { Request, Response } from "express";
import { FinishServiceExecutionUseCase } from "../../../application/use-cases/service-execution/FinishServiceExecutionUseCase";
import { GetAllServicesAverageUseCase } from "../../../application/use-cases/service-execution/GetAllServicesAverageUseCase";
import { GetAverageTimeByServiceUseCase } from "../../../application/use-cases/service-execution/GetAverageTimeByServiceUseCase";
import { GetServiceOrderTimelineUseCase } from "../../../application/use-cases/service-execution/GetServiceOrderTimelineUseCase";
import { StartServiceExecutionUseCase } from "../../../application/use-cases/service-execution/StartServiceExecutionUseCase";


export class ServiceExecutionController {
  private startServiceUseCase: StartServiceExecutionUseCase;
  private finishServiceUseCase: FinishServiceExecutionUseCase;
  private getAverageTimeUseCase: GetAverageTimeByServiceUseCase;
  private getAllAveragesUseCase: GetAllServicesAverageUseCase;
  private getTimelineUseCase: GetServiceOrderTimelineUseCase;

  constructor() {
    this.startServiceUseCase = new StartServiceExecutionUseCase();
    this.finishServiceUseCase = new FinishServiceExecutionUseCase();
    this.getAverageTimeUseCase = new GetAverageTimeByServiceUseCase();
    this.getAllAveragesUseCase = new GetAllServicesAverageUseCase();
    this.getTimelineUseCase = new GetServiceOrderTimelineUseCase();
  }

  async startService(req: Request, res: Response) {
    try {
      const result = await this.startServiceUseCase.execute({
        serviceOrderId: req.body.serviceOrderId,
        serviceId: req.body.serviceId
      });
      return res.json({
        success: true,
        data: result,
        message: "Serviço iniciado com sucesso"
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async finishService(req: Request, res: Response) {
    try {
      const result = await this.finishServiceUseCase.execute({
        serviceOrderId: req.body.serviceOrderId,
        serviceId: req.body.serviceId,
        mechanicNote: req.body.mechanicNote
      });
      return res.json({
        success: true,
        data: result,
        message: "Serviço finalizado com sucesso"
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAverageByService(req: Request, res: Response) {
    try {
      const { serviceId } = req.params;
      const result = await this.getAverageTimeUseCase.execute(Number(serviceId));
      return res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllAverages(req: Request, res: Response) {
    try {
      const result = await this.getAllAveragesUseCase.execute();
      return res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTimeline(req: Request, res: Response) {
    try {
      const { serviceOrderId } = req.params;
      const result = await this.getTimelineUseCase.execute(Number(serviceOrderId));
      return res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}