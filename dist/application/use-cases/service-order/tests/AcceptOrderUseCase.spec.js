"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const UserRepository_1 = require("../../../../infrastructure/repositories/UserRepository");
const AcceptOrderUseCase_1 = require("../AcceptOrderUseCase");
jest.mock("../../../../infrastructure/repositories/UserRepository", () => ({
    UserRepository: {
        findOne: jest.fn(),
    }
}));
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
describe("AcceptOrderUseCase", () => {
    let acceptOrderUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        acceptOrderUseCase = new AcceptOrderUseCase_1.AcceptOrderUseCase();
    });
    it("deve aceitar ordem e mudar status para EM_DIAGNOSTICO", async () => {
        const mockMechanic = { id: 1, role: "mecanico" };
        const mockOrder = {
            id: 1,
            status: "RECEBIDA",
            mechanicId: null,
            mechanic: null
        };
        const updatedOrder = {
            ...mockOrder,
            status: "EM_DIAGNOSTICO",
            mechanic: mockMechanic,
            mechanicId: 1,
            startedAt: new Date()
        };
        UserRepository_1.UserRepository.findOne.mockResolvedValue(mockMechanic);
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValueOnce(mockOrder);
        ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue(updatedOrder);
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValueOnce(updatedOrder);
        const result = await acceptOrderUseCase.execute(1, 1);
        expect(result).toHaveProperty("status", "EM_DIAGNOSTICO");
    });
    it("não deve aceitar ordem se mecânico não for encontrado", async () => {
        UserRepository_1.UserRepository.findOne.mockResolvedValue(null);
        await expect(acceptOrderUseCase.execute(1, 1)).rejects.toThrow("Mecânico não encontrado ou não autorizado");
    });
    it("não deve aceitar ordem já aceita", async () => {
        UserRepository_1.UserRepository.findOne.mockResolvedValue({ id: 1, role: "mecanico" });
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "RECEBIDA",
            mechanicId: 2
        });
        await expect(acceptOrderUseCase.execute(1, 1)).rejects.toThrow("Esta OS já foi aceita por outro mecânico");
    });
    it("não deve aceitar ordem com status diferente de RECEBIDA", async () => {
        UserRepository_1.UserRepository.findOne.mockResolvedValue({ id: 1, role: "mecanico" });
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "EM_EXECUCAO",
            mechanicId: null
        });
        await expect(acceptOrderUseCase.execute(1, 1)).rejects.toThrow("Ordem de serviço precisa estar com status RECEBIDA");
    });
});
