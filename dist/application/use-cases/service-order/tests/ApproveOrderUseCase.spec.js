"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const ServiceRepository_1 = require("../../../../infrastructure/repositories/ServiceRepository");
const CreateExecutionsFromApprovedOrderUseCase_1 = require("../../service-execution/CreateExecutionsFromApprovedOrderUseCase");
const CheckStockAvailabilityUseCase_1 = require("../../stock/CheckStockAvailabilityUseCase");
const ReserveStockUseCase_1 = require("../../stock/ReserveStockUseCase");
const ApproveServiceOrderUseCase_1 = require("../ApproveServiceOrderUseCase");
jest.mock("../../infrastructure/repositories/ServiceRepository", () => ({
    ServiceRepository: {
        findByIds: jest.fn(),
    }
}));
jest.mock("../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findByIds: jest.fn(),
    }
}));
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
jest.mock("../stock/CheckStockAvailabilityUseCase");
jest.mock("../stock/ReserveStockUseCase");
jest.mock("../stock/RestoreStockUseCase");
jest.mock("../service-execution/CreateExecutionsFromApprovedOrderUseCase");
describe("ApproveOrderUseCase", () => {
    let approveOrderUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        approveOrderUseCase = new ApproveServiceOrderUseCase_1.ApproveOrderUseCase();
    });
    it("deve aprovar ordem e calcular orçamento", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "AGUARDANDO_APROVACAO",
            approved: false,
            diagnostics: [
                {
                    id: 1,
                    includeInBudget: true,
                    recommendedServices: [{ id: 10, price: 100 }],
                    recommendedParts: [{ id: 20, price: 50 }]
                }
            ]
        });
        ServiceRepository_1.ServiceRepository.findByIds.mockResolvedValue([
            { id: 10, price: 100 }
        ]);
        PartRepository_1.PartRepository.findByIds.mockResolvedValue([
            { id: 20, price: 50 }
        ]);
        CheckStockAvailabilityUseCase_1.CheckStockAvailabilityUseCase.prototype.execute.mockResolvedValue({
            available: true,
            currentStock: 10
        });
        ReserveStockUseCase_1.ReserveStockUseCase.prototype.execute.mockResolvedValue({ id: 1 });
        ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue({});
        CreateExecutionsFromApprovedOrderUseCase_1.CreateExecutionsFromApprovedOrderUseCase.prototype.execute.mockResolvedValue([]);
        const result = await approveOrderUseCase.execute(1);
        expect(result.budget).toBe(150);
    });
    it("deve aprovar apenas diagnósticos selecionados", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "AGUARDANDO_APROVACAO",
            approved: false,
            diagnostics: [
                {
                    id: 1,
                    includeInBudget: true,
                    recommendedServices: [{ id: 10, price: 100 }],
                    recommendedParts: []
                },
                {
                    id: 2,
                    includeInBudget: true,
                    recommendedServices: [{ id: 20, price: 200 }],
                    recommendedParts: []
                }
            ]
        });
        ServiceRepository_1.ServiceRepository.findByIds.mockResolvedValue([
            { id: 10, price: 100 }
        ]);
        PartRepository_1.PartRepository.findByIds.mockResolvedValue([]);
        CheckStockAvailabilityUseCase_1.CheckStockAvailabilityUseCase.prototype.execute.mockResolvedValue({
            available: true,
            currentStock: 10
        });
        ReserveStockUseCase_1.ReserveStockUseCase.prototype.execute.mockResolvedValue({ id: 1 });
        ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue({});
        CreateExecutionsFromApprovedOrderUseCase_1.CreateExecutionsFromApprovedOrderUseCase.prototype.execute.mockResolvedValue([]);
        const result = await approveOrderUseCase.execute(1, [1]);
        expect(result.budget).toBe(100);
    });
    it("não deve aprovar se já aprovado", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            approved: true
        });
        await expect(approveOrderUseCase.execute(1)).rejects.toThrow("Orçamento já aprovado");
    });
    it("não deve aprovar se ordem não estiver aguardando aprovação", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            approved: false,
            status: "EM_EXECUCAO"
        });
        await expect(approveOrderUseCase.execute(1)).rejects.toThrow("Ordem precisa estar aguardando aprovação");
    });
    it("não deve aprovar se não houver diagnósticos", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "AGUARDANDO_APROVACAO",
            approved: false,
            diagnostics: []
        });
        await expect(approveOrderUseCase.execute(1)).rejects.toThrow("Nenhum diagnóstico encontrado para esta OS");
    });
});
