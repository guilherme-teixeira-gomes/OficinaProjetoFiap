"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const GetLowStockUseCase_1 = require("../../../application/use-cases/stock/GetLowStockUseCase");
const GetStockSummaryUseCase_1 = require("../../../application/use-cases/stock/GetStockSummaryUseCase");
const AddStockUseCase_1 = require("../../../application/use-cases/stock/AddStockUseCase");
const CheckStockAvailabilityUseCase_1 = require("../../../application/use-cases/stock/CheckStockAvailabilityUseCase");
const GetCriticalStockUseCase_1 = require("../../../application/use-cases/stock/GetCriticalStockUseCase");
const GetStockMovementsUseCase_1 = require("../../../application/use-cases/stock/GetStockMovementsUseCase");
class StockController {
    async getLowStock(req, res) {
        try {
            const useCase = new GetLowStockUseCase_1.GetLowStockUseCase();
            const lowStock = await useCase.execute();
            return res.json({
                success: true,
                data: lowStock,
                count: lowStock.length,
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async getCriticalStock(req, res) {
        try {
            const useCase = new GetCriticalStockUseCase_1.GetCriticalStockUseCase();
            const data = await useCase.execute();
            return res.json({
                success: true,
                data,
                count: data.length,
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async getMovements(req, res) {
        try {
            const { partId, serviceOrderId, startDate, endDate, type } = req.query;
            const filters = {
                partId: partId ? Number(partId) : undefined,
                serviceOrderId: serviceOrderId ? Number(serviceOrderId) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                type: type,
            };
            const useCase = new GetStockMovementsUseCase_1.GetStockMovementsUseCase();
            const movements = await useCase.execute(filters);
            return res.json({
                success: true,
                data: movements,
                count: movements.length
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async getStockSummary(req, res) {
        try {
            const useCase = new GetStockSummaryUseCase_1.GetStockSummaryUseCase();
            const summary = await useCase.execute();
            return res.json({
                success: true,
                data: summary
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async addStock(req, res) {
        try {
            const { partId, quantity, description } = req.body;
            if (!partId || !quantity || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    error: "PartId e quantity (maior que 0) são obrigatórios"
                });
            }
            const useCase = new AddStockUseCase_1.AddStockUseCase();
            const movement = await useCase.execute(partId, quantity, description);
            return res.status(201).json({
                success: true,
                data: movement
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async checkAvailability(req, res) {
        try {
            const { partId, quantity } = req.params;
            const useCase = new CheckStockAvailabilityUseCase_1.CheckStockAvailabilityUseCase();
            const result = await useCase.execute(Number(partId), Number(quantity));
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.StockController = StockController;
