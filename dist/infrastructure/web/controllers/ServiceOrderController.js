"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrderController = void 0;
const AcceptOrderUseCase_1 = require("../../../application/use-cases/service-order/AcceptOrderUseCase");
const AddDiagnosticUseCase_1 = require("../../../application/use-cases/service-order/AddDiagnosticUseCase");
const ApproveServiceOrderUseCase_1 = require("../../../application/use-cases/service-order/ApproveServiceOrderUseCase");
const CreateServiceOrderUseCase_1 = require("../../../application/use-cases/service-order/CreateServiceOrderUseCase");
const DeliverServiceOrderUseCase_1 = require("../../../application/use-cases/service-order/DeliverServiceOrderUseCase");
const FinishDiagnosticUseCase_1 = require("../../../application/use-cases/service-order/FinishDiagnosticUseCase");
const FinishServiceOrderUseCase_1 = require("../../../application/use-cases/service-order/FinishServiceOrderUseCase");
const GetServiceOrderByIdUseCase_1 = require("../../../application/use-cases/service-order/GetServiceOrderByIdUseCase");
const GetServiceOrderStatusUseCase_1 = require("../../../application/use-cases/service-order/GetServiceOrderStatusUseCase");
const ListServiceOrdersUseCase_1 = require("../../../application/use-cases/service-order/ListServiceOrdersUseCase");
const RejectServiceOrderUseCase_1 = require("../../../application/use-cases/service-order/RejectServiceOrderUseCase");
const UpdateServiceOrderStatusUseCase_1 = require("../../../application/use-cases/service-order/UpdateServiceOrderStatusUseCase");
class ServiceOrderController {
    constructor() {
        this.createServiceOrderUseCase = new CreateServiceOrderUseCase_1.CreateServiceOrderUseCase();
        this.acceptOrderUseCase = new AcceptOrderUseCase_1.AcceptOrderUseCase();
        this.addDiagnosticUseCase = new AddDiagnosticUseCase_1.AddDiagnosticUseCase();
        this.finishDiagnosticUseCase = new FinishDiagnosticUseCase_1.FinishDiagnosticUseCase();
        this.approveOrderUseCase = new ApproveServiceOrderUseCase_1.ApproveOrderUseCase();
        this.rejectOrderUseCase = new RejectServiceOrderUseCase_1.RejectOrderUseCase();
        this.getServiceOrderByIdUseCase = new GetServiceOrderByIdUseCase_1.GetServiceOrderByIdUseCase();
        this.listServiceOrdersUseCase = new ListServiceOrdersUseCase_1.ListServiceOrdersUseCase();
        this.getServiceOrderStatusUseCase = new GetServiceOrderStatusUseCase_1.GetServiceOrderStatusUseCase();
        this.updateServiceOrderStatusUseCase = new UpdateServiceOrderStatusUseCase_1.UpdateServiceOrderStatusUseCase();
        this.finishServiceOrderUseCase = new FinishServiceOrderUseCase_1.FinishServiceOrderUseCase();
        this.deliverServiceOrderUseCase = new DeliverServiceOrderUseCase_1.DeliverServiceOrderUseCase();
    }
    async handle(req, res) {
        try {
            const order = await this.createServiceOrderUseCase.create(req.body);
            return res.status(201).json({
                success: true,
                message: "Ordem de serviço criada com sucesso! Aguardando mecânico.",
                data: order
            });
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }
    async list(req, res) {
        try {
            const excludeFinished = req.query.excludeFinished !== 'false';
            const orders = await this.listServiceOrdersUseCase.execute(excludeFinished);
            res.json(orders);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async get(req, res) {
        try {
            const order = await this.getServiceOrderByIdUseCase.execute(Number(req.params.id));
            if (!order)
                return res.status(404).json({ error: "Ordem de serviço não encontrada" });
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async getStatus(req, res) {
        try {
            const status = await this.getServiceOrderStatusUseCase.execute(Number(req.params.id));
            if (!status)
                return res.status(404).json({ error: "Ordem de serviço não encontrada" });
            res.json(status);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async acceptOrder(req, res) {
        try {
            const { mechanicId } = req.body;
            const order = await this.acceptOrderUseCase.execute(Number(req.params.id), mechanicId);
            res.json({
                success: true,
                message: "OS aceita com sucesso! Inicie o diagnóstico.",
                data: order
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async addDiagnostic(req, res) {
        try {
            const diagnostic = await this.addDiagnosticUseCase.execute(Number(req.params.id), req.body);
            res.status(201).json({
                success: true,
                message: "Diagnóstico adicionado com sucesso!",
                data: diagnostic
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async finishDiagnostic(req, res) {
        try {
            const result = await this.finishDiagnosticUseCase.execute(Number(req.params.id));
            res.json({
                success: true,
                message: "Diagnóstico finalizado! Orçamento gerado.",
                data: result
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const order = await this.updateServiceOrderStatusUseCase.execute(Number(req.params.id), req.body.status);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async approve(req, res) {
        try {
            const order = await this.approveOrderUseCase.execute(Number(req.params.id), req.body.approvedDiagnosticIds);
            res.json({
                success: true,
                message: "Orçamento aprovado! Iniciando execução.",
                data: order
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async reject(req, res) {
        try {
            const result = await this.rejectOrderUseCase.execute(Number(req.params.id));
            res.json({
                success: true,
                message: "Orçamento recusado!",
                data: result
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async finish(req, res) {
        try {
            const order = await this.finishServiceOrderUseCase.execute(Number(req.params.id));
            res.json({
                success: true,
                message: "Serviço finalizado! Aguardando entrega.",
                data: order
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async deliver(req, res) {
        try {
            const order = await this.deliverServiceOrderUseCase.execute(Number(req.params.id));
            res.json({
                success: true,
                message: "Veículo entregue ao cliente!",
                data: order
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
exports.ServiceOrderController = ServiceOrderController;
