
import { Request, Response } from "express";
import { ServiceExecutionService } from "../services/ServiceExecutionService";

export class ServiceExecutionController {

  async startService(req: Request, res: Response) {
    try {
      const executionService = new ServiceExecutionService();
      const result = await executionService.startService(req.body);
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
      const executionService = new ServiceExecutionService();
      const result = await executionService.finishService(req.body);
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
      const executionService = new ServiceExecutionService();
      const { serviceId } = req.params;
      const result = await executionService.getAverageTimeByService(Number(serviceId));
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
      const executionService = new ServiceExecutionService();
      const result = await executionService.getAllServicesAverage();
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
      const executionService = new ServiceExecutionService();
      const { serviceOrderId } = req.params;
      const result = await executionService.getServiceOrderTimeline(Number(serviceOrderId));
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