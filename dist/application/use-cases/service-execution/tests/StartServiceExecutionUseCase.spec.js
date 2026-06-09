"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceExecutionRepository_1 = require("../../../../infrastructure/repositories/ServiceExecutionRepository");
const StartServiceExecutionUseCase_1 = require("../StartServiceExecutionUseCase");
jest.mock("../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
    ServiceExecutionRepository: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    }
}));
describe("StartServiceExecutionUseCase", () => {
    let startServiceUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        startServiceUseCase = new StartServiceExecutionUseCase_1.StartServiceExecutionUseCase();
    });
    describe("execute", () => {
        it("deve iniciar serviço novo", async () => {
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue(null);
            ServiceExecutionRepository_1.ServiceExecutionRepository.create.mockReturnValue({
                serviceOrderId: 1,
                serviceId: 10,
                status: "EM_ANDAMENTO",
                startedAt: expect.any(Date)
            });
            ServiceExecutionRepository_1.ServiceExecutionRepository.save.mockResolvedValue({
                id: 1,
                status: "EM_ANDAMENTO"
            });
            const result = await startServiceUseCase.execute({
                serviceOrderId: 1,
                serviceId: 10
            });
            expect(result.status).toBe("EM_ANDAMENTO");
        });
        it("deve iniciar serviço pendente existente", async () => {
            const existingExecution = {
                id: 1,
                status: "PENDENTE",
                startedAt: null
            };
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue(existingExecution);
            ServiceExecutionRepository_1.ServiceExecutionRepository.save.mockResolvedValue({
                ...existingExecution,
                status: "EM_ANDAMENTO",
                startedAt: expect.any(Date)
            });
            const result = await startServiceUseCase.execute({
                serviceOrderId: 1,
                serviceId: 10
            });
            expect(result.status).toBe("EM_ANDAMENTO");
        });
        it("deve dar erro se serviço já concluído", async () => {
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue({
                status: "CONCLUIDO"
            });
            await expect(startServiceUseCase.execute({
                serviceOrderId: 1,
                serviceId: 10
            })).rejects.toThrow("Este serviço já foi concluído");
        });
    });
});
