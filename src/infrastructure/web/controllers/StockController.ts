import { Request, Response } from "express";
import { GetLowStockUseCase } from "../../../application/use-cases/stock/GetLowStockUseCase";

import { GetStockSummaryUseCase } from "../../../application/use-cases/stock/GetStockSummaryUseCase";
import { AddStockUseCase } from "../../../application/use-cases/stock/AddStockUseCase";
import { CheckStockAvailabilityUseCase } from "../../../application/use-cases/stock/CheckStockAvailabilityUseCase";
import { GetCriticalStockUseCase } from "../../../application/use-cases/stock/GetCriticalStockUseCase";
import { GetStockMovementsUseCase } from "../../../application/use-cases/stock/GetStockMovementsUseCase";

export class StockController {

  async getLowStock(req: Request, res: Response) {
    try {
      const useCase = new GetLowStockUseCase();
      const lowStock = await useCase.execute();

      return res.json({
        success: true,
        data: lowStock,
        count: lowStock.length,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async getCriticalStock(req: Request, res: Response) {
    try {
      const useCase = new GetCriticalStockUseCase();
      const data = await useCase.execute();

      return res.json({
        success: true,
        data,
        count: data.length,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async getMovements(req: Request, res: Response) {
    try {
      const { partId, serviceOrderId, startDate, endDate, type } = req.query;

      const filters: any = {
        partId: partId ? Number(partId) : undefined,
        serviceOrderId: serviceOrderId ? Number(serviceOrderId) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        type: type as "IN" | "OUT",
      };

      const useCase = new GetStockMovementsUseCase();
      const movements = await useCase.execute(filters);

      return res.json({
        success: true,
        data: movements,
        count: movements.length
      });

    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async getStockSummary(req: Request, res: Response) {
    try {
      const useCase = new GetStockSummaryUseCase();
      const summary = await useCase.execute();

      return res.json({
        success: true,
        data: summary
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async addStock(req: Request, res: Response) {
    try {
      const { partId, quantity, description } = req.body;

      if (!partId || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: "PartId e quantity (maior que 0) são obrigatórios"
        });
      }

      const useCase = new AddStockUseCase();
      const movement = await useCase.execute(partId, quantity, description);

      return res.status(201).json({
        success: true,
        data: movement
      });

    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async checkAvailability(req: Request, res: Response) {
    try {
      const { partId, quantity } = req.params;

      const useCase = new CheckStockAvailabilityUseCase();
      const result = await useCase.execute(Number(partId), Number(quantity));

      return res.json({
        success: true,
        data: result
      });

    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}