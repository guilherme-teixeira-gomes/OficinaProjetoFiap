"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const FinishDiagnosticUseCase_1 = require("../FinishDiagnosticUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
describe("FinishDiagnosticUseCase", () => {
    let finishDiagnosticUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        finishDiagnosticUseCase = new FinishDiagnosticUseCase_1.FinishDiagnosticUseCase();
    });
    it("deve finalizar diagnóstico e gerar orçamento", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "EM_DIAGNOSTICO",
            diagnostics: [
                {
                    id: 1,
                    includeInBudget: true,
                    recommendedServices: [{ price: 100 }],
                    recommendedParts: [{ price: 50 }]
                }
            ]
        });
        ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue({});
        const result = await finishDiagnosticUseCase.execute(1);
        expect(result.status).toBe("AGUARDANDO_APROVACAO");
        expect(result.budget).toBe(150);
    });
    it("não deve finalizar diagnóstico se ordem não estiver em diagnóstico", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "FINALIZADA"
        });
        await expect(finishDiagnosticUseCase.execute(1)).rejects.toThrow("Ordem de serviço não está em diagnóstico");
    });
    it("deve finalizar diagnóstico com orçamento zero quando não há itens", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "EM_DIAGNOSTICO",
            diagnostics: []
        });
        ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue({});
        const result = await finishDiagnosticUseCase.execute(1);
        expect(result.budget).toBe(0);
        expect(result.items).toEqual([]);
    });
});
