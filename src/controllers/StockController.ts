// src/controllers/StockController.ts
import { Request, Response } from "express";
import { StockService } from "../services/StockService";

export class StockController {


  async getLowStock(req: Request, res: Response) {
    try {
      const stockService = new StockService();
      const lowStock = await stockService.getLowStock();
      return res.json({
        success: true,
        data: lowStock,
        count: lowStock.length,
        message: lowStock.length === 0
          ? "Nenhuma peça com estoque baixo"
          : `${lowStock.length} peça(s) com estoque baixo`
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getCriticalStock(req: Request, res: Response) {
    try {
      const stockService = new StockService();
      const criticalStock = await stockService.getCriticalStock();
      return res.json({
        success: true,
        data: criticalStock,
        count: criticalStock.length,
        message: criticalStock.length === 0
          ? "Nenhuma peça com estoque crítico"
          : `${criticalStock.length} peça(s) com estoque crítico`
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMovements(req: Request, res: Response) {
    try {
      const { partId, serviceOrderId, startDate, endDate, type } = req.query;

      const filters: any = {};
      if (partId) filters.partId = Number(partId);
      if (serviceOrderId) filters.serviceOrderId = Number(serviceOrderId);
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (type) filters.type = type as "IN" | "OUT";
      const stockService = new StockService();
      const movements = await stockService.getStockMovements(filters);

      return res.json({
        success: true,
        data: movements,
        count: movements.length
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getStockSummary(req: Request, res: Response) {
    try {
      const stockService = new StockService();
      const summary = await stockService.getStockSummary();
      return res.json({
        success: true,
        data: summary
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
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
      const stockService = new StockService();
      const movement = await stockService.addStock(partId, quantity, description);

      return res.status(201).json({
        success: true,
        data: movement,
        message: `${quantity} unidade(s) adicionadas ao estoque com sucesso`
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async checkAvailability(req: Request, res: Response) {
    try {
      const { partId, quantity } = req.params;
      const stockService = new StockService();
      const availability = await stockService.checkStockAvailability(
        Number(partId),
        Number(quantity)
      );

      return res.json({
        success: true,
        data: availability
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}