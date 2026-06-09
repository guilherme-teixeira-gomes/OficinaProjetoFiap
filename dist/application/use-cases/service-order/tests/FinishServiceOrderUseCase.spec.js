"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const FinishServiceOrderUseCase_1 = require("../FinishServiceOrderUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
describe("FinishServiceOrderUseCase", () => {
    let finishServiceOrderUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        finishServiceOrderUseCase = new FinishServiceOrderUseCase_1.FinishServiceOrderUseCase();
    });
    it("deve finalizar ordem em execução", async () => {
        const mockOrder = {
            id: 1,
            status: "EM_EXECUCAO",
            approved: true
        };
        const finishedOrder = { ...mockOrder, status: "FINALIZADA", finishedAt: new Date() };
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue(mockOrder);
        ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue(finishedOrder);
        const result = await finishServiceOrderUseCase.execute(1);
        expect(result.status).toBe("FINALIZADA");
    });
    it("não deve finalizar ordem não aprovada", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            approved: false
        });
        await expect(finishServiceOrderUseCase.execute(1)).rejects.toThrow("Não pode finalizar antes da aprovação");
    });
    it("não deve finalizar ordem fora de execução", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            approved: true,
            status: "RECEBIDA"
        });
        await expect(finishServiceOrderUseCase.execute(1)).rejects.toThrow("Ordem precisa estar em execução");
    });
});
