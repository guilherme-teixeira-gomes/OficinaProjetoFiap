"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const CheckStockAvailabilityUseCase_1 = require("../CheckStockAvailabilityUseCase");
jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findOne: jest.fn(),
    }
}));
describe("CheckStockAvailabilityUseCase", () => {
    let checkStockUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        checkStockUseCase = new CheckStockAvailabilityUseCase_1.CheckStockAvailabilityUseCase();
    });
    it("deve retornar disponível quando estoque é suficiente", async () => {
        const mockPart = {
            id: 1,
            name: "Filtro de óleo",
            stock: 10
        };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        const result = await checkStockUseCase.execute(1, 5);
        expect(result.available).toBe(true);
        expect(result.currentStock).toBe(10);
        expect(result.requiredQuantity).toBe(5);
        expect(result.deficit).toBeUndefined();
    });
    it("deve retornar indisponível quando estoque é insuficiente", async () => {
        const mockPart = {
            id: 1,
            name: "Filtro de óleo",
            stock: 3
        };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        const result = await checkStockUseCase.execute(1, 5);
        expect(result.available).toBe(false);
        expect(result.currentStock).toBe(3);
        expect(result.requiredQuantity).toBe(5);
        expect(result.deficit).toBe(2);
    });
    it("deve lançar erro se peça não for encontrada", async () => {
        PartRepository_1.PartRepository.findOne.mockResolvedValue(null);
        await expect(checkStockUseCase.execute(999, 5)).rejects.toThrow("Peça com ID 999 não encontrada");
    });
});
