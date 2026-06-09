"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceRepository_1 = require("../../../../infrastructure/repositories/ServiceRepository");
const DeleteServiceUseCase_1 = require("../DeleteServiceUseCase");
jest.mock("../../../infrastructure/repositories/ServiceRepository", () => ({
    ServiceRepository: {
        findOne: jest.fn(),
        remove: jest.fn(),
    }
}));
describe("DeleteServiceUseCase", () => {
    let deleteServiceUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        deleteServiceUseCase = new DeleteServiceUseCase_1.DeleteServiceUseCase();
    });
    it("deve deletar serviço com sucesso", async () => {
        const existingService = { id: 1, name: "Troca de óleo", price: 100 };
        ServiceRepository_1.ServiceRepository.findOne.mockResolvedValue(existingService);
        ServiceRepository_1.ServiceRepository.remove.mockResolvedValue(existingService);
        await deleteServiceUseCase.delete(1);
        expect(ServiceRepository_1.ServiceRepository.remove).toHaveBeenCalledWith(existingService);
    });
    it("deve lançar erro ao deletar serviço inexistente", async () => {
        ServiceRepository_1.ServiceRepository.findOne.mockResolvedValue(null);
        await expect(deleteServiceUseCase.delete(999)).rejects.toThrow("Serviço não encontrado");
    });
});
