"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const UpdatePartUseCase_1 = require("../UpdatePartUseCase");
jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findOne: jest.fn(),
        merge: jest.fn(),
        save: jest.fn(),
    }
}));
describe("UpdatePartUseCase", () => {
    let updatePartUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        updatePartUseCase = new UpdatePartUseCase_1.UpdatePartUseCase();
    });
    it("deve atualizar peça com sucesso", async () => {
        const existingPart = { id: 1, name: "Filtro antigo", price: 50 };
        const updatedPart = { ...existingPart, name: "Filtro novo", price: 60 };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(existingPart);
        PartRepository_1.PartRepository.merge.mockReturnValue(updatedPart);
        PartRepository_1.PartRepository.save.mockResolvedValue(updatedPart);
        const result = await updatePartUseCase.update(1, { name: "Filtro novo", price: 60 });
        expect(result.name).toBe("Filtro novo");
        expect(result.price).toBe(60);
        expect(PartRepository_1.PartRepository.merge).toHaveBeenCalledWith(existingPart, { name: "Filtro novo", price: 60 });
    });
    it("deve dar erro ao atualizar peça inexistente", async () => {
        PartRepository_1.PartRepository.findOne.mockResolvedValue(null);
        await expect(updatePartUseCase.update(1, { name: "Teste" })).rejects.toThrow("Peça não encontrada");
    });
});
