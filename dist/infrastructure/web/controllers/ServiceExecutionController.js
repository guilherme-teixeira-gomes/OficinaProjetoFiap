"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceExecutionController = void 0;
const FinishServiceExecutionUseCase_1 = require("../../../application/use-cases/service-execution/FinishServiceExecutionUseCase");
const GetAllServicesAverageUseCase_1 = require("../../../application/use-cases/service-execution/GetAllServicesAverageUseCase");
const GetAverageTimeByServiceUseCase_1 = require("../../../application/use-cases/service-execution/GetAverageTimeByServiceUseCase");
const GetServiceOrderTimelineUseCase_1 = require("../../../application/use-cases/service-execution/GetServiceOrderTimelineUseCase");
const StartServiceExecutionUseCase_1 = require("../../../application/use-cases/service-execution/StartServiceExecutionUseCase");
class ServiceExecutionController {
    constructor() {
        this.startServiceUseCase = new StartServiceExecutionUseCase_1.StartServiceExecutionUseCase();
        this.finishServiceUseCase = new FinishServiceExecutionUseCase_1.FinishServiceExecutionUseCase();
        this.getAverageTimeUseCase = new GetAverageTimeByServiceUseCase_1.GetAverageTimeByServiceUseCase();
        this.getAllAveragesUseCase = new GetAllServicesAverageUseCase_1.GetAllServicesAverageUseCase();
        this.getTimelineUseCase = new GetServiceOrderTimelineUseCase_1.GetServiceOrderTimelineUseCase();
    }
    async startService(req, res) {
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
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async finishService(req, res) {
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
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getAverageByService(req, res) {
        try {
            const { serviceId } = req.params;
            const result = await this.getAverageTimeUseCase.execute(Number(serviceId));
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getAllAverages(req, res) {
        try {
            const result = await this.getAllAveragesUseCase.execute();
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getTimeline(req, res) {
        try {
            const { serviceOrderId } = req.params;
            const result = await this.getTimelineUseCase.execute(Number(serviceOrderId));
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.ServiceExecutionController = ServiceExecutionController;
