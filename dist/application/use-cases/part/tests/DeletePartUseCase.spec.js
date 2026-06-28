"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const DeletePartUseCase_1 = require("../DeletePartUseCase");
jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findOne: jest.fn(),
        remove: jest.fn(),
    }
}));
describe("DeletePartUseCase", () => {
    let deletePartUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        deletePartUseCase = new DeletePartUseCase_1.DeletePartUseCase();
    });
    it("deve deletar peça com sucesso", async () => {
        const existingPart = { id: 1, name: "Filtro" };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(existingPart);
        PartRepository_1.PartRepository.remove.mockResolvedValue(existingPart);
        const result = await deletePartUseCase.delete(1);
        expect(result).toHaveProperty("id", 1);
        expect(PartRepository_1.PartRepository.remove).toHaveBeenCalledWith(existingPart);
    });
    it("deve dar erro ao deletar peça inexistente", async () => {
        PartRepository_1.PartRepository.findOne.mockResolvedValue(null);
        await expect(deletePartUseCase.delete(1)).rejects.toThrow("Peça não encontrada");
    });
});
