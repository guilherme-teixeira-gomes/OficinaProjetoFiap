"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiagnosticRepository_1 = require("../../../../infrastructure/repositories/DiagnosticRepository");
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const ServiceRepository_1 = require("../../../../infrastructure/repositories/ServiceRepository");
const AddDiagnosticUseCase_1 = require("../AddDiagnosticUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
    ServiceRepository: {
        findByIds: jest.fn(),
    }
}));
jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findByIds: jest.fn(),
    }
}));
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
    }
}));
jest.mock("../../../../infrastructure/repositories/DiagnosticRepository", () => ({
    DiagnosticRepository: {
        create: jest.fn(),
        save: jest.fn(),
    }
}));
describe("AddDiagnosticUseCase", () => {
    let addDiagnosticUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        addDiagnosticUseCase = new AddDiagnosticUseCase_1.AddDiagnosticUseCase();
    });
    it("deve adicionar diagnóstico", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "EM_DIAGNOSTICO",
            diagnostics: []
        });
        ServiceRepository_1.ServiceRepository.findByIds.mockResolvedValue([{ id: 1, price: 100 }]);
        PartRepository_1.PartRepository.findByIds.mockResolvedValue([{ id: 2, price: 50 }]);
        DiagnosticRepository_1.DiagnosticRepository.create.mockReturnValue({ id: 99 });
        DiagnosticRepository_1.DiagnosticRepository.save.mockResolvedValue({ id: 99 });
        const result = await addDiagnosticUseCase.execute(1, {
            title: "Teste",
            description: "desc",
            includeInBudget: true,
            priority: "alta",
            serviceIds: [1],
            partIds: [2]
        });
        expect(result).toHaveProperty("id", 99);
    });
    it("não deve adicionar diagnóstico fora do status correto", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "FINALIZADA"
        });
        await expect(addDiagnosticUseCase.execute(1, {})).rejects.toThrow("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
    });
});
