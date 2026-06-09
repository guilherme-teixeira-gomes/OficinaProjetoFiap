"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceExecutionRepository_1 = require("../../../../infrastructure/repositories/ServiceExecutionRepository");
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const FinishServiceExecutionUseCase_1 = require("../FinishServiceExecutionUseCase");
jest.mock("../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
    ServiceExecutionRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
    }
}));
jest.mock("../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
describe("FinishServiceExecutionUseCase", () => {
    let finishServiceUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        finishServiceUseCase = new FinishServiceExecutionUseCase_1.FinishServiceExecutionUseCase();
    });
    describe("execute", () => {
        it("deve finalizar serviço", async () => {
            const mockExecution = {
                id: 1,
                status: "EM_ANDAMENTO",
                startedAt: new Date(Date.now() - 60000),
                serviceOrderId: 1,
                serviceId: 10
            };
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue(mockExecution);
            ServiceExecutionRepository_1.ServiceExecutionRepository.save.mockResolvedValue({
                ...mockExecution,
                status: "CONCLUIDO",
                finishedAt: expect.any(Date),
                durationMinutes: 1
            });
            ServiceExecutionRepository_1.ServiceExecutionRepository.find.mockResolvedValue([
                { status: "CONCLUIDO" }
            ]);
            ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
                id: 1,
                status: "EM_EXECUCAO"
            });
            ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue({});
            const result = await finishServiceUseCase.execute({
                serviceOrderId: 1,
                serviceId: 10,
                mechanicNote: "Serviço concluído"
            });
            expect(result.status).toBe("CONCLUIDO");
        });
        it("deve dar erro se execução não encontrada", async () => {
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue(null);
            await expect(finishServiceUseCase.execute({
                serviceOrderId: 1,
                serviceId: 10
            })).rejects.toThrow("Execução não encontrada");
        });
        it("deve dar erro se serviço já concluído", async () => {
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue({
                status: "CONCLUIDO"
            });
            await expect(finishServiceUseCase.execute({
                serviceOrderId: 1,
                serviceId: 10
            })).rejects.toThrow("Serviço já foi concluído");
        });
        it("deve finalizar ordem quando todos os serviços estão concluídos", async () => {
            const mockExecution = {
                id: 1,
                status: "EM_ANDAMENTO",
                startedAt: new Date(Date.now() - 60000),
                serviceOrderId: 1,
                serviceId: 10
            };
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue(mockExecution);
            ServiceExecutionRepository_1.ServiceExecutionRepository.save.mockResolvedValue({
                ...mockExecution,
                status: "CONCLUIDO",
                finishedAt: expect.any(Date),
                durationMinutes: 1
            });
            // Simula que todos os serviços foram concluídos
            ServiceExecutionRepository_1.ServiceExecutionRepository.find.mockResolvedValue([
                { status: "CONCLUIDO" },
                { status: "CONCLUIDO" }
            ]);
            ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
                id: 1,
                status: "EM_EXECUCAO"
            });
            ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue({});
            const result = await finishServiceUseCase.execute({
                serviceOrderId: 1,
                serviceId: 10,
                mechanicNote: "Serviço concluído"
            });
            expect(result.status).toBe("CONCLUIDO");
            expect(ServiceOrderRepository_1.ServiceOrderRepository.save).toHaveBeenCalled();
        });
    });
});
