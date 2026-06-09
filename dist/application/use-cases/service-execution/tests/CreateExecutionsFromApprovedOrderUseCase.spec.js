"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceExecutionRepository_1 = require("../../../../infrastructure/repositories/ServiceExecutionRepository");
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const CreateExecutionsFromApprovedOrderUseCase_1 = require("../CreateExecutionsFromApprovedOrderUseCase");
jest.mock("../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
    }
}));
jest.mock("../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
    ServiceExecutionRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
describe("CreateExecutionsFromApprovedOrderUseCase", () => {
    let createExecutionsUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        createExecutionsUseCase = new CreateExecutionsFromApprovedOrderUseCase_1.CreateExecutionsFromApprovedOrderUseCase();
    });
    describe("execute", () => {
        it("deve criar execuções a partir da ordem aprovada", async () => {
            ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
                id: 1,
                services: [{ id: 10 }, { id: 20 }]
            });
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne.mockResolvedValue(null);
            ServiceExecutionRepository_1.ServiceExecutionRepository.save.mockResolvedValue({});
            await createExecutionsUseCase.execute(1);
            expect(ServiceExecutionRepository_1.ServiceExecutionRepository.save).toHaveBeenCalledTimes(2);
        });
        it("deve lançar erro se ordem não existir", async () => {
            ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue(null);
            await expect(createExecutionsUseCase.execute(1)).rejects.toThrow("Ordem não encontrada");
        });
        it("não deve criar execuções duplicadas", async () => {
            ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
                id: 1,
                services: [{ id: 10 }, { id: 20 }]
            });
            ServiceExecutionRepository_1.ServiceExecutionRepository.findOne
                .mockResolvedValueOnce({ id: 1 }) // primeira execução já existe
                .mockResolvedValueOnce(null); // segunda execução não existe
            ServiceExecutionRepository_1.ServiceExecutionRepository.save.mockResolvedValue({});
            await createExecutionsUseCase.execute(1);
            expect(ServiceExecutionRepository_1.ServiceExecutionRepository.save).toHaveBeenCalledTimes(1);
        });
    });
});
