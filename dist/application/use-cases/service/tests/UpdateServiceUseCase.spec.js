"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceRepository_1 = require("../../../../infrastructure/repositories/ServiceRepository");
const UpdateServiceUseCase_1 = require("../UpdateServiceUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
    ServiceRepository: {
        findOne: jest.fn(),
        merge: jest.fn(),
        save: jest.fn(),
    }
}));
describe("UpdateServiceUseCase", () => {
    let updateServiceUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        updateServiceUseCase = new UpdateServiceUseCase_1.UpdateServiceUseCase();
    });
    it("deve atualizar serviço com sucesso", async () => {
        const existingService = { id: 1, name: "Troca de óleo", price: 100 };
        const updatedService = { ...existingService, price: 120 };
        ServiceRepository_1.ServiceRepository.findOne.mockResolvedValue(existingService);
        ServiceRepository_1.ServiceRepository.merge.mockReturnValue(updatedService);
        ServiceRepository_1.ServiceRepository.save.mockResolvedValue(updatedService);
        const result = await updateServiceUseCase.update(1, { price: 120 });
        expect(result.price).toBe(120);
        expect(ServiceRepository_1.ServiceRepository.merge).toHaveBeenCalledWith(existingService, { price: 120 });
    });
    it("deve atualizar múltiplos campos", async () => {
        const existingService = { id: 1, name: "Troca de óleo", price: 100, active: true };
        const updatedService = {
            ...existingService,
            name: "Troca de óleo sintético",
            price: 150
        };
        ServiceRepository_1.ServiceRepository.findOne.mockResolvedValue(existingService);
        ServiceRepository_1.ServiceRepository.merge.mockReturnValue(updatedService);
        ServiceRepository_1.ServiceRepository.save.mockResolvedValue(updatedService);
        const result = await updateServiceUseCase.update(1, {
            name: "Troca de óleo sintético",
            price: 150
        });
        expect(result.name).toBe("Troca de óleo sintético");
        expect(result.price).toBe(150);
    });
    it("deve lançar erro ao atualizar serviço inexistente", async () => {
        ServiceRepository_1.ServiceRepository.findOne.mockResolvedValue(null);
        await expect(updateServiceUseCase.update(999, { price: 120 })).rejects.toThrow("Serviço não encontrado");
    });
});
